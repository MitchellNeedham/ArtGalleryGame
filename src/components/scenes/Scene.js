import { useEffect, useState } from 'react/cjs/react.development';
import { Character } from '../character';
import './scene.css';

export default function Scene(
  {
    scene,
    changeScene,
    character,
    doors,
    spawnPos,
  }) {
  // HOOKS //
  const [newPos, setNewPos] = useState(null);
  const [targetDoor, setTargetDoor] = useState(false);

  useEffect(() => {
    window.addEventListener('click', (e) => moveToPos(e));
    return window.removeEventListener('click', (e) => moveToPos(e));
  }, []);

  const moveToPos = (e) => {
    setTargetDoor((td) => e.target.classList.contains('scene-door') ? td : false);
    setNewPos([e.x, e.y]);
  }

  // RETURN IF NO SCENE DATA
  if (!scene) return <></>;
  
  const roomPolygon = scene.room.polygon.map(([val1, val2]) => val1*100+'vh ' +val2*100+'vh').join(', ');
  const [head, ...tail] = scene.room.polygon.sort((p1, p2) => p2[1] - p1[1]);
  const floorWidth = scene.room.polygon.reduce((acc, val) => acc > val[0] ? acc : val[0], 0);

  const floorMin = scene.room.polygon.reduce((acc, val) => acc < val[1] ? acc : val[1]);
  const floorMax = scene.room.polygon.reduce((acc, val) => acc > val[1] ? acc : val[1]);

  return (
    <>
      <div
        className="scene-floor"
        style={
          {
            backgroundColor: '#ccc',
            width: `${floorWidth*100}vh`,
            height: '100vh',
            clipPath: 'polygon(' + roomPolygon + ')',
          }
        }
      >
        Scene
      </div>
      {doors.map((pair) => (
        <div
          key={pair.currentRoom.id}
          className="scene-door"
          title={pair.currentRoom.id}
          role="button"
          tabIndex="0"
          onClick={() => setTargetDoor(() => () => changeScene(pair.nextRoom))}
          onKeyDown={(e) => e.key === 'Enter' && setTargetDoor(() => () => changeScene(pair.nextRoom))}
          style={
            {
              position: 'absolute',
              top: pair.currentRoom.pos[1] * 100 + 'vh',
              left: pair.currentRoom.pos[0] * 100 + 'vh',
            }
          }
        >
        </div>
      ))}
      <Character
        character={character}
        pos={spawnPos}
        newPos={newPos}
        unitSize={{...scene.room.unitSize, floorMin, floorMax }}
        changeScene={targetDoor}
      />
    </>
  )
}