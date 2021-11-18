import { useEffect, useRef, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';

import { ArtImage, ArtMusic, ArtVideo, CharacterCustomisationDrawer, VideoSelection } from '../interactives';
import { Character } from '../character';
import './scene.css';

const INTERACTIVES = {
  image: (props) => (<ArtImage {...props} />),
  video: (props) => (<ArtVideo {...props} />),
  music: (props) => (<ArtMusic {...props} />),
  videoselection: (props) => (<VideoSelection {...props} />),
  charactercustomisation: (props) => (<CharacterCustomisationDrawer {...props} />)
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
  const [doorHovers, setDoorHovers] = useState(Array(doors.length).fill(false));

  useEffect(() => {
    setDoorHovers(Array(doors.length).fill(false));
  }, [doors]);

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
    if (!audio) return;
    audio.play().catch((err) => console.log(err));

    audio.addEventListener('ended', () => {
      audio.currentTime = 0;
      audio.play();
    });
  }, [audio]);

  useEffect(() => {
    window.addEventListener('click', (e) => moveToPos(e));
    return window.removeEventListener('click', (e) => moveToPos(e));
  }, []);

  const moveToPos = (e) => {
    if (e.target.classList.contains('art') || !sceneRef?.current?.contains(e.target)) return;
    if (!e.clientX || !e.clientY) return;
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

  const handleDoorClick = (event, pair, i) => {
    setTargetDoor(() => () => {
      setDoorHovers((dh) => dh.map((d, ind) => ind === i ? true : d));
      setTimeout(() => changeScene(pair.nextRoom), 200);
    });

    if (!!pair.currentRoom.fixed) {
      changeScene(pair.nextRoom);
    }

    if (!!pair.currentRoom.invisible || event.type === 'keydown') {
      setNewPos((pair.currentRoom.exitPos ?? pair.currentRoom.pos).map((c) => c * window.innerHeight));
    }

    if (pair.currentRoom.exitPos) {
      console.log('true')
      setTimeout(() => setNewPos(pair.currentRoom.exitPos.map((c) => c * window.innerHeight)), 100);
    }
    
  }

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
        renderTrackVertical={({ style, ...props }) => <div style={{...style, display: 'none'}} {...props}></div>}
      >
        <div
          className="scene-container"
          style={
            {
              backgroundImage: `url(${scene.background.image})`,
              backgroundPositionY: 'center',
              width: `${scene.background.dimensions[0]/scene.background.dimensions[1]*100}vh`,
              height: '100vh',
              overflow: 'hidden'
            }
          }
        >
          {scene.background.overlays?.map((overlay, i) => (
            <img
              className="scene-overlay"
              key={i}
              src={overlay.image}
              alt=""
              style={
                {
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  zIndex: parseInt(overlay.zindex ?? 0, 10) + 100,
                  pointerEvents: 'none',
                  userSelect: 'none'
                }
              }
            />
          ))}
          {scene.background.clouds?.map((cloud) => (
            <div
              style={
                {
                  backgroundImage: `url(${cloud.image})`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  position: 'absolute',
                  left: '-10vh',
                  top: cloud.top * 100 + 'vh',
                  width: cloud.dim[0] * 100 + 'vh',
                  height: cloud.dim[1] * 100 + 'vh',
                  animation: `clouds ${cloud.duration}s linear ${cloud.delay}s infinite`,
                  WebkitAnimation: `clouds ${cloud.duration}s linear ${cloud.delay}s infinite`,
                }
              }
            >
            
            </div>
          ))}
          {scene.room.interactives?.map((obj, key) => (INTERACTIVES[obj.type]({...obj, key})))}
          <div
            className="scene-floor"
            style={
              {
                position: 'absolute',
                //backgroundColor: '#cccc',
                width: `${floorWidth*100}vh`,
                height: '100vh',
                clipPath: 'polygon(' + roomPolygon + ')',
                pointerEvents: 'none',
                zIndex: 200,
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
          {doors.map((pair, i) => (
            <div
              key={pair.currentRoom.id}
              className="scene-door"
              id={pair.currentRoom.id}
              title={pair.currentRoom.id}
              role="button"
              tabIndex="0"
              onClick={(e) => handleDoorClick(e, pair, i)}
              onKeyDown={(e) => e.key === 'Enter' && handleDoorClick(e, pair, i)}
              onMouseEnter={() => setDoorHovers((dh) => dh.map((d, ind) => ind === i ? true : d))}
              onMouseLeave={() => setDoorHovers((dh) => dh.map((d, ind) => ind === i ? false : d))}
              style={
                {
                  position: 'absolute',
                  top: pair.currentRoom.pos[1] * 100 + 'vh',
                  left: pair.currentRoom.pos[0] * 100 + 'vh',
                  height: pair.currentRoom.dimensions[1] * 100 + 'vh',
                  width: pair.currentRoom.dimensions[0] * 100 + 'vh',
                  zIndex: pair.currentRoom.zindex || 100,
                  visibility: !!pair.currentRoom.invisible ? 'hidden' : 'visible',
                  outline: !!pair.currentRoom.hover ? 'none' : '2px solid rgb(135, 222, 139)',
                  backgroundImage: doorHovers[i] ? `url(${pair.currentRoom.hover})` : `none`
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
            sceneID={scene.id}
          />
        </div>
      </Scrollbars>
    </div>
  )
}
