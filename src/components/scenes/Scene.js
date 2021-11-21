import { useEffect, useRef, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';

import { useVisitedUpdate } from '../../api/VisitedContext';
import { useSceneLoaded, useSceneLoadedUpdate } from '../../api/LoadedContext';
import { ArtImage, ArtMusic, ArtVideo, CharacterCustomisationDrawer, VideoSelection, ToolTip, SpeechBubble, VoteLaptop } from '../interactives';
import { Character } from '../character';
import './scene.css';

const INTERACTIVES = {
  image: (props) => (<ArtImage {...props} />),
  video: (props) => (<ArtVideo {...props} />),
  music: (props) => (<ArtMusic {...props} />),
  videoselection: (props) => (<VideoSelection {...props} />),
  charactercustomisation: (props) => (<CharacterCustomisationDrawer {...props} />),
  tooltip: (props) => (<ToolTip {...props} />),
  speechbubble: (props) => (<SpeechBubble {...props} />),
  votelaptop: (props) => (<VoteLaptop {...props} />)
}

function load(src) {
  return new Promise(function(resolve, reject) {
    const image = new Image();
    image.addEventListener('load', resolve);
    image.addEventListener('error', reject);
    image.src = src;
  });
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
  const backgroundRef = useRef(null);
  const [newPos, setNewPos] = useState(null);
  const [targetDoor, setTargetDoor] = useState(false);
  const [audio, setAudio] = useState(new Audio(scene.music));
  const [doorHovers, setDoorHovers] = useState(Array(doors.length).fill(false));
  const [cloudDelays, setCloudDelays] = useState(
    [...Array(scene.background.clouds?.length || 0)].map(_ => Math.floor(Math.random() * 60 - 20))
  );

  const { setLoaded, updateProgressCurr } = useSceneLoadedUpdate();
  const { isLoaded } = useSceneLoaded();
  const { updateVisited } = useVisitedUpdate();

  const [images, setImages] = useState([]);

  function loadImage(imageArray) {
    if (imageArray.length < 1) {
      setLoaded(true);
    };
    updateProgressCurr(imageArray.length);
    load(imageArray[0])
    .then(() => loadImage(imageArray.slice(1)))
    .catch(() => {});
  }

  function recursiveLoadImages(obj) {
    Object.entries(obj).forEach(([key, val]) => {
      if (Array.isArray(val)) { val.forEach((o) => recursiveLoadImages(o))}
      if (val === Object(val)) { recursiveLoadImages(val) }
      if (["image", "hover", "path", "bigticket", "customIB"].includes(key)) {
        setImages((arr) => [...new Set([...arr, val])]);
      }
      if (key === "images" && Array.isArray(val) && val.length > 0) {
        setImages((arr) => [...new Set([...arr, val[0]])]);
      }
    });
  };

  useEffect(() => {
    if (images.length < 1) return;
    loadImage(images);
    console.log(images.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

  useEffect(() => {
    setImages([]);
    if (!backgroundRef || isLoaded || !scene) return;
    recursiveLoadImages(scene);
    //if (scene.sceneName === 'bedroom') recursiveLoadImages(character);
    if ('required' in scene) { updateVisited(scene.required); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene]);

  useEffect(() => {
    setDoorHovers(Array(doors.length).fill(false));
  }, [doors, scene]);

  useEffect(() => {
    setCloudDelays([...Array(scene.background.clouds?.length || 0)].map(_ => Math.floor(Math.random() * 60 - 20)));
  }, [scene]);

  useEffect(() => {
    if (!audio) {
      setAudio(new Audio(scene.music));
      audio.play();
      return;
    };
    audio.src = scene.music ?? '';
    // Yes, I am chaotic evil - the music works fine, the errors are dumb
    audio.play().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene]);

  useEffect(() => {
    if (!audio) return;

    audio.addEventListener('ended', () => {
      audio.currentTime = 0;
      audio.play();
    });
  }, [audio]);

  useEffect(() => {
    window.addEventListener('click', (e) => moveToPos(e));
    return window.removeEventListener('click', (e) => moveToPos(e));
  }, []);

  useEffect(() => {
    console.log(scrollbarRef.current.getScrollLeft());
    console.log(scrollbarRef.current.getScrollWidth());
  }, [scrollbarRef]);

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

  useEffect(() => {
    if (!scrollbarRef.current) return;
    scrollbarRef.current.scrollToLeft();
  }, [isLoaded]);

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
      setTimeout(() => setNewPos(pair.currentRoom.exitPos.map((c) => c * window.innerHeight)), 100);
    }
  }

  const handleDoorHover = (hover, door) => {
    if (door.hover && hover) return `url(${door.hover})`;
    if (door.image) return `url(${door.image})`;
    return 'none';
  }

  return (
    <div
      ref={sceneRef}
      style={
        {
          height: '100vh',
          width: `min(100vw, min(${2900/2160 * 100}vh, ${scene.background.dimensions[0]/scene.background.dimensions[1]*100}vh)`,
          margin: '0 auto 0',
        }
      }
    >
      <Scrollbars
        ref={scrollbarRef}
        renderTrackVertical={({ style, ...props }) => <div style={{...style, display: 'none'}} {...props}></div>}
        renderThumbHorizontal={props => <div {...props} className="thumb-horizontal"/>}
        renderTrackHorizontal={props => <div {...props} className="track-horizontal"/>}
      >
        <div
          className="scene-container"
          ref={backgroundRef}
          style={
            {
              backgroundImage: `url(${scene.background.image})`,
              backgroundRepeat: 'no-repeat',
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
          {scene.background.clouds?.map((cloud, i) => (
            <div
              key={i}
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
                  animation: `clouds ${cloud.duration}s linear ${cloudDelays[i]}s infinite`,
                  WebkitAnimation: `clouds ${cloud.duration}s linear ${cloudDelays[i]}s infinite`,
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
              key={pair.currentRoom.id + i}
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
                  //outline: !!pair.currentRoom.hover ? 'none' : '2px solid rgb(135, 222, 139)',
                  backgroundImage: handleDoorHover(doorHovers[i], pair.currentRoom),
                  filter: `saturate(${doorHovers[i] && pair.currentRoom.image ? '3' : '1'})`
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
