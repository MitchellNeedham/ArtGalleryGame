import { Character } from '../character';
import './scene.css';

export default function Scene({ scene, characterData }) {
  if (!scene) return <></>;
  
  const roomPolygon = scene.room.polygon.map(([val1, val2]) => val1*100+'% ' +val2*100+'%').join(', ');
  console.log(roomPolygon);
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
              top: door.pos[1] * 100 + '%',
              left: door.pos[0] * 100 + '%',
            }
          }
        >


        </div>
      ))}
      <Character character={characterData} />
    </>
  )
}