import { useEffect, useState } from 'react';
import axios from 'axios';

import { Scene } from '../scenes';

export default function World() {
  const [worldData, setWorldData] = useState([]);
  const [characterData, setCharacterData] = useState({});
  const [scene, setScene] = useState(0);
  const [doors, setDoors] = useState([]);
  const [spawnPos, setSpawnPos] = useState(null);

  useEffect(() => {
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
                  id: door.id,
                  scene,
                  pos: door.pos,
                },
                nextRoom: {
                  id: matchingDoor.id,
                  scene: i,
                  pos: matchingDoor.pos,
                }
              }
            );
          }
          return memo;
        }, {});
      return connectingDoor;
    }));
  }, [scene, worldData]);

  const changeScene = (entryDoor) => {
    console.log(entryDoor);
    setSpawnPos(entryDoor.pos);
    setScene(entryDoor.scene);
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
        spawnPos={spawnPos ?? worldData[scene].room.spawn}
      />
    </div>
  );

}