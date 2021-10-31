import { Character } from '../character';
import './scene.css';

export default function Scene({ scene, character }) {
  if (!scene) return <></>;
  
  const roomPolygon = scene.room.polygon.map(([val1, val2]) => val1*100+'vh ' +val2*100+'vh').join(', ');
  const [head, ...tail] = scene.room.polygon.sort((p1, p2) => p2[1] - p1[1]);

  console.log(head, tail);

  return (
    <>
      <div
        style={
          {
            backgroundColor: '#ccc',
            width: '100vw',
            height: '100vh',
            clipPath: 'polygon(' + roomPolygon + ')',
          }
        }
      >
        Scene
      </div>
      {scene.room.doors.map((door) => (
        <div
          key={door.id}
          className="door"
          style={
            {
              position: 'absolute',
              top: door.pos[1] * 100 + 'vh',
              left: door.pos[0] * 100 + 'vh',
            }
          }
        >


        </div>
      ))}
      <Character character={character} pos={scene.room.spawn} />
    </>
  )
}