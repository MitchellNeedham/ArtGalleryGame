import { useState, useRef, useEffect } from 'react';
import './character.css';

const CharMoveSpeed = 0.8;

export default function Character({ character, pos, unitSize }) {
  const characterRef = useRef(null);
  const [refresh, setRefresh] = useState(0);
  const [posX, setPosX] = useState(pos[0] * 100);
  const [posY, setPosY] = useState(pos[1] * 100);
  const [moveUp, setMoveUp] = useState(0);
  const [moveRight, setMoveRight] = useState(0);
  const [height] = useState(character.dimensions.height);
  const [width] = useState(character.dimensions.width);

  useEffect(() => {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'd' || e.key === 'ArrowRight') { setMoveRight(1) }
      if (e.key === 'a' || e.key === 'ArrowLeft') { setMoveRight(-1) }
      if (e.key === 'w' || e.key === 'ArrowUp') { setMoveUp(-1) }
      if (e.key === 's' || e.key === 'ArrowDown') { setMoveUp(1) }
    });

    window.addEventListener('keyup', (e) => {
      if (e.key === 'd' || e.key === 'ArrowRight') { setMoveRight(0) }
      if (e.key === 'a' || e.key === 'ArrowLeft') { setMoveRight(0) }
      if (e.key === 'w' || e.key === 'ArrowUp') { setMoveUp(0) }
      if (e.key === 's' || e.key === 'ArrowDown') { setMoveUp(0) }
    });
  }, []);

  useEffect(() => {
    setPosX(pos[0] * 100);
    setPosY(pos[1] * 100);
  }, [pos]);

  useEffect(()=>{
    setPosX(posX => posX + moveRight * CharMoveSpeed);
    setPosY(posY => posY + moveUp * CharMoveSpeed);
  }, [refresh, moveRight, moveUp]);

  useEffect(() => {
    setInterval(() => {
      setRefresh(new Date());
    }, 25);
  }, []);

  const normalY = posY/100;
  const m = (unitSize.max-unitSize.min)/(unitSize.floorMax-unitSize.floorMin);
  const c = unitSize.min - m * unitSize.floorMin;
  const ratio = normalY*m+c;

  

  return (
    <div
      className="character"
      ref={characterRef}
      style={
        {
          height: ratio * height + 'vh',
          width: ratio * width + 'vh',
          top: posY + 'vh',
          left: posX + 'vh',
        }
      }
    >
      Character
    </div>
  )
}