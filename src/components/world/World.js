import { useEffect, useState } from 'react';
import axios from 'axios';

import { useSceneLoadedUpdate } from '../../api/LoadedContext';
import { Scene } from '../scenes';
import { useSceneGraphUpdate } from '../../api/GraphContext';

export default function World() {
  const [worldData, setWorldData] = useState([]);
  const [characterData, setCharacterData] = useState({});
  const [scene, setScene] = useState(0);
  const [doors, setDoors] = useState([]);
  const [spawnPos, setSpawnPos] = useState(null);
  const [loadingScreen, setLoadingScreen] = useState(null);

  const { setLoaded } = useSceneLoadedUpdate();
  const { updateGraphs } = useSceneGraphUpdate();

  useEffect(() => {
    setLoadingScreen(document.getElementById('loading-screen'));
    axios
    .all([
      axios.get('/data/worlds/test_world.json'),
      axios.get('/data/characters/test_character.json')
    ])
    .then(axios.spread((res1, res2) => {
      setCharacterData(res2.data);
      setWorldData(res1.data);
    }));
  }, []);

  useEffect(() => {
    if (!loadingScreen) return;
    setTimeout(() => {
      loadingScreen.className="hidden-ls";
      setLoaded(true);
    }, 3000);
  }, [loadingScreen, setLoaded]);

  useEffect(() => {
    if (!worldData[scene]) { return; }
    setDoors(worldData[scene].room.doors.map((door) => {
      const connectingDoor = worldData
        .reduce((memo, worldScene, i) => {
          if (i === scene) { return memo; }
          const matchingDoor = worldScene.room.doors.find((d) => d.id === door.id);
          if (matchingDoor) {
            return (
              {
                currentRoom: {
                  scene,
                  ...door
                },
                nextRoom: {
                  scene: i,
                  ...matchingDoor
                }
              }
            );
          }
          return memo;
        }, {});
      return connectingDoor;
    }));
  }, [scene, worldData]);

  useEffect(() => {
    worldData.forEach((scene) => {
      updateGraphs(scene.id, scene.room.polygon, scene.room.innerPolygons);
    });
  }, [worldData, updateGraphs]);

  const changeScene = (entryDoor) => {
    loadingScreen.className = "visible-ls";
    setLoaded(false);
    setTimeout(() => {
      setSpawnPos([entryDoor.pos[0] + entryDoor.dimensions[0]/2, entryDoor.pos[1] + entryDoor.dimensions[1]]);
      setScene(entryDoor.scene);
      
    }, 1000);
    setTimeout(() => {
      setLoaded(true);
      loadingScreen.className = "hidden-ls";
    }, 4000);
  };

  if (!worldData[scene]) {
    return <></>;
  }

  return (
    <div>
      <Scene
        scene={worldData[scene]}
        character={characterData}
        doors={doors}
        changeScene={(door) => changeScene(door)}
        spawnPos={spawnPos ?? worldData[scene].room.spawn ?? [0.5, 0.95]}
      />
    </div>
  );
}