import { useState, useRef, useEffect } from 'react';
import pathfinding from '../../scripts/pathfinding';
import './character.scss';
import { useSceneGraph } from '../../api/GraphContext';
import { useSceneLoaded } from '../../api/LoadedContext';
import { useCharacter, useCharacterUpdate } from '../../api/CharacterContext';

const charMoveSpeed = (size) => 5/(size/3 + 1)/6;
const SCREEN_EDGE_OFFSET = 200;
const SCROLL_SPEED = 20;

const ANIM_FRAME_LENGTH = 2;

export default function Character({ pos, unitSize, newPos, polygons, changeScene, scrollbarRef, sceneID }) {
  const characterRef = useRef(null);
  const { characterData: character, colour, headAcc, bodyAcc } = useCharacter();
  const [refresh, setRefresh] = useState(0);
  const [currPos, setCurrPos] = useState([pos[0] * 100, pos[1] * 100]);
  const [speed, setSpeed] = useState([0, 0]);
  const [height, setHeight] = useState(character?.dimensions.height ?? 0);
  const [width, setWidth] = useState(character?.dimensions.width ?? 0);
  const [targetPos, setTargetPos] = useState(newPos);
  const [scrollDir, setScrollDir] = useState(0);
  const [counter, setCounter] = useState(0);
  const [animFrame, setAnimFrame] = useState(0);

  const { graphs } = useSceneGraph();

  const { isLoaded } = useSceneLoaded();

  const { updateCharPos } = useCharacterUpdate();

  useEffect(() => {
    setHeight(character?.dimensions.height);
    setWidth(character?.dimensions.width);
  }, [character]);

  useEffect(() => {
    setCurrPos([pos[0] * 100, pos[1] * 100]);
  }, [pos]);

  useEffect(() => {
    if (targetPos) {
      setCounter(c => c + 1);
      if (counter > ANIM_FRAME_LENGTH) {
        setAnimFrame(f => mod(f + 1, character.frames));
        setCounter(0);
      }
    } 
    if (!targetPos && (counter || animFrame)) {
      setCounter(0);
      setAnimFrame(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh, targetPos]);

  useEffect(() => {
    const t = setInterval(() => {
      setRefresh(new Date());
    }, 25);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const sb = scrollbarRef.current;
    sb?.scrollLeft(sb?.getScrollLeft() + scrollDir);
  }, [refresh, scrollDir, scrollbarRef]);

  useEffect(() => {
    if(window.matchMedia("(any-hover: none)").matches) return;
    if (isLoaded) {
      window.addEventListener('mousemove', (e) => detectMouseOnEdge(e));
    }
    return window.removeEventListener('mousemove', (e) => detectMouseOnEdge(e));
  }, [isLoaded, sceneID]);

  const detectMouseOnEdge = (e) => {    
    if (e.clientX - window.innerWidth > -SCREEN_EDGE_OFFSET) {
      setScrollDir(SCROLL_SPEED);
      return;
    }
    if (e.clientX < SCREEN_EDGE_OFFSET) {
      setScrollDir(-SCROLL_SPEED);
      return;
    }
    setScrollDir(0);
    return;
  }

  useEffect(() => {
    let path = newPos;
    if (newPos) {
      graphs.get(sceneID).then((g) => {
        path = pathfinding(polygons.outer, polygons.inner, currPos.map((c) => c / 100), newPos.map((c) => c / window.innerHeight), g);
        setTargetPos(path.map((p) => p.map((coord) => coord * 100)));
      });
      return;
    }
    setTargetPos(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newPos]);

  const normalY = currPos[1]/100;
  const m = (unitSize.max-unitSize.min)/(unitSize.floorMax-unitSize.floorMin);
  const c = unitSize.min - m * unitSize.floorMin;
  const ratio = normalY*m+c;

  const handleMove = () => {
   if (targetPos?.length > 0) {
      const orthoDist = Math.abs(currPos[1]-targetPos[0][1]) + Math.abs(currPos[0]-targetPos[0][0]);
      setSpeed(([prevSpeedX, prevSpeedY]) => (
        [
          (prevSpeedX * 6 + Math.abs(currPos[0]-targetPos[0][0])/orthoDist * Math.sign(targetPos[0][0]-currPos[0]))/7,
          (prevSpeedY * 6 + Math.abs(currPos[1]-targetPos[0][1])/orthoDist * Math.sign(targetPos[0][1]-currPos[1]))/7
        ]
      ));

      setCurrPos(([prevPosX, prevPosY]) => (
        [
          prevPosX + speed[0] * charMoveSpeed(ratio) * ratio,
          prevPosY + speed[1] * charMoveSpeed(ratio) * ratio * 0.75
        ]
      ));

      if (orthoDist < 2) {
        if (targetPos.length > 1) {
          setTargetPos((path) => path.slice(1));
        } else {
          setTargetPos(null);
          setSpeed([0, 0]);
          if (changeScene) changeScene();
        }
      }
    }
  }

  useEffect(() => {
    updateCharPos(currPos);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currPos]);

  useEffect(()=>{
    handleMove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  function mod(n, m) {
    return ((n % m) + m) % m;
  }

  return (
    <div
      className="character"
      ref={characterRef}
      style={
        {
          height: ratio * height + 'vh',
          width: ratio * width + 'vh',
          top: currPos[1] - ratio * height * 0.8 + 'vh',
          left: currPos[0] - ratio * width / 2 + 'vh',
          WebkitTransform: `scaleX(${-Math.sign(speed[0]) || 1 })`,
          transform: `scaleX(${-Math.sign(speed[0]) || 1})`,
          zIndex: 100 + parseInt(currPos[1], 10)
        }
      }
    >
      <div
        style={
          {
            backgroundImage: character?.actions.walk.map((img) => `url(${img})`) + `, url(${character?.actions.idle})`,
            backgroundPositionX: targetPos ? character?.actions.walk.map((_, i) => i === animFrame ? 'center' : '1000px') + ', 1000px' : Array(character?.actions.walk.length).fill('1000px') + ', center',
            filter: `hue-rotate(${colour.hue}deg) saturate(${colour.sat}) brightness(${colour.val})`
          }
        }
      />
      <div
        style={
          {
            backgroundImage: [...headAcc, ...bodyAcc].map((src) => `url(${src})`),
            backgroundPositionX: [...headAcc, ...bodyAcc].map((_, i) => mod(i, 6) === animFrame ? 'center' : '1000px'),
          }
        }
      />
    </div>
  )
}