import { useState, useRef, useEffect } from 'react';
import pathfinding from '../../scripts/pathfinding';
import './character.scss';

const charMoveSpeed = (size) => 1/(size/3 + 1);
const SCREEN_EDGE_OFFSET = 200;
const SCROLL_SPEED = 20;

export default function Character({ character, pos, unitSize, newPos, polygons, changeScene, scrollbarRef }) {
  const characterRef = useRef(null);
  const [refresh, setRefresh] = useState(0);
  const [currPos, setCurrPos] = useState([pos[0] * 100, pos[1] * 100]);
  const [speed, setSpeed] = useState([0, 0]);
  const [height] = useState(character.dimensions.height);
  const [width] = useState(character.dimensions.width);
  const [targetPos, setTargetPos] = useState(newPos);
  const [scrollDir, setScrollDir] = useState(0);

  useEffect(() => {
    setCurrPos([pos[0] * 100, pos[1] * 100]);
  }, [pos]);


  useEffect(() => {
    if (!targetPos) return;
    const t = setInterval(() => {
      setRefresh(new Date());
    }, 25);
    return () => clearInterval(t);
  }, [targetPos]);

  useEffect(() => {
    const sb = scrollbarRef.current;
    sb?.scrollLeft(sb?.getScrollLeft() + scrollDir);
  }, [refresh, scrollDir, scrollbarRef]);

  useEffect(() => {
    if(window.matchMedia("(any-hover: none)").matches) return;
    window.addEventListener('mousemove', (e) => detectMouseOnEdge(e));
    return window.removeEventListener('mousemove', (e) => detectMouseOnEdge(e));
  }, []);

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
    if (newPos) { path = pathfinding(polygons.outer, polygons.inner, currPos.map((c) => c / 100), newPos.map((c) => c / window.innerHeight)); }
    setTargetPos(newPos === null ? null : path.map((p) => p.map((coord) => coord * 100)));
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
          (prevSpeedX * 10 + Math.abs(currPos[0]-targetPos[0][0])/orthoDist * Math.sign(targetPos[0][0]-currPos[0]))/11,
          (prevSpeedY * 10 + Math.abs(currPos[1]-targetPos[0][1])/orthoDist * Math.sign(targetPos[0][1]-currPos[1]))/11
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

  useEffect(()=>{
    handleMove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  return (
    <div
      className="character"
      ref={characterRef}
      style={
        {
          height: ratio * height + 'vh',
          width: ratio * width + 'vh',
          top: currPos[1] - ratio * height + 'vh',
          left: currPos[0] - ratio * width / 2 + 'vh',
          backgroundImage: `url(${character.actions.idle.imageSequence[0]})`,
          WebkitTransform: `scaleX(${-Math.sign(speed[0]) || 1})`,
          transform: `scaleX(${-Math.sign(speed[0]) || 1})`,
        }
      }
    />
  )
}