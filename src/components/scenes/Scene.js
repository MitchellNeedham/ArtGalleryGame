import { useEffect, useRef, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';

import { ArtImage, ArtMusic, ArtVideo } from '../interactives';
import { Character } from '../character';
import './scene.css';

const INTERACTIVES = {
  image: (props) => (<ArtImage {...props} />),
  video: (props) => (<ArtVideo {...props} />),
  music: (props) => (<ArtMusic {...props} />),
}

export default function Scene(
  {
    scene,
    changeScene,
    character,
    doors,
    spawnPos,
  }) {
  // HOOKS //
  const scrollbarRef = useRef(null);
  const sceneRef = useRef(null);
  const [newPos, setNewPos] = useState(null);
  const [targetDoor, setTargetDoor] = useState(false);
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    setAudio(scene.music !== null ? new Audio(scene.music) : null);

    return () => {
      setAudio((oldAudio) => {
        if (oldAudio !== null) {
          oldAudio.pause();
        }
        return null;
      });
    }
  }, [scene]);

  useEffect(() => {
    audio?.play().catch((err) => console.log(err));
    audio?.addEventListener('ended', () => {
      audio.currentTime = 0;
      audio.play();
    });
  }, [audio]);

  useEffect(() => {
    window.addEventListener('click', (e) => moveToPos(e));
    return window.removeEventListener('click', (e) => moveToPos(e));
  }, []);

  const moveToPos = (e) => {
    if (e.target.classList.contains('art') || !sceneRef.current.contains(e.target)) return;
    const boundingBox = sceneRef.current.getBoundingClientRect();
    setTargetDoor((td) => e.target.classList.contains('scene-door') ? td : false);

    setNewPos(
      [
        e.x + scrollbarRef?.current?.getScrollLeft() - (window.innerWidth > boundingBox.width ? (window.innerWidth - boundingBox.width)/2 : 0),
        e.y + scrollbarRef?.current?.getScrollTop()
      ]
    );
  }

  // RETURN IF NO SCENE DATA
  if (!scene) return <></>;

  const roomPolygon = scene.room.polygon.map(([val1, val2]) => val1*100+'vh ' +val2*100+'vh').join(', ');
  //const [head, ...tail] = scene.room.polygon.sort((p1, p2) => p2[1] - p1[1]);
  const floorWidth = scene.room.polygon.reduce((acc, val) => acc > val[0] ? acc : val[0], 0);

  const floorMin = scene.room.polygon.reduce((acc, val) => acc < val[1] ? acc : val[1]);
  const floorMax = scene.room.polygon.reduce((acc, val) => acc > val[1] ? acc : val[1]);
  return (
    <div
      ref={sceneRef}
      style={
        {
          height: '100vh',
          width: `min(100vw, ${scene.background.dimensions[0]/scene.background.dimensions[1]*100}vh`,
          margin: '0 auto 0',
        }
      }
    >
      <Scrollbars
        ref={scrollbarRef}
      >
        <div
          className="scene-container"
          style={
            {
              backgroundImage: `url(${scene.background.image})`,
              width: `${scene.background.dimensions[0]/scene.background.dimensions[1]*100}vh`,
              height: '100vh',
              overflow: 'hidden'
            }
          }
        >
          {scene.room.interactives?.map((obj, key) => (INTERACTIVES[obj.type]({...obj, key})))}
          <div
            className="scene-floor"
            style={
              {
                //backgroundColor: '#cccc',
                width: `${floorWidth*100}vh`,
                height: '100vh',
                clipPath: 'polygon(' + roomPolygon + ')',
              }
            }
          >
            {scene.room.innerPolygons?.map((polygon, i) => (
              <div
                key={i}
                style={
                  {
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    //backgroundColor: 'blue',
                    clipPath: `polygon(${polygon.map(([val1, val2]) => val1*100+'vh ' +val2*100+'vh').join(', ')})`
                  }
                }
              />
            ))}
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
                  height: pair.currentRoom.dimensions[0] * 100 + 'vh',
                  width: pair.currentRoom.dimensions[1] * 100 + 'vh',
                }
              }
            >
            </div>
          ))}
          <Character
            character={character}
            pos={spawnPos}
            newPos={newPos}
            polygons={{outer: scene.room.polygon, inner: scene.room.innerPolygons ?? []}}
            unitSize={{...scene.room.unitSize, floorMin, floorMax }}
            changeScene={targetDoor}
            scrollbarRef={scrollbarRef}
          />
        </div>
      </Scrollbars>
    </div>
  )
}
