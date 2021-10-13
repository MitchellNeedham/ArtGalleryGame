import { useState, useRef, useEffect } from 'react';
import './character.css';

const CharMoveSpeed = 5;

export default function Character({ character }) {
  const characterRef = useRef(null);
  const [refresh, setRefresh] = useState(0);
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);
  const [moveUp, setMoveUp] = useState(0);
  const [moveRight, setMoveRight] = useState(0);

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

  useEffect(()=>{
    setPosX(posX + moveRight * CharMoveSpeed);
    setPosY(posY + moveUp * CharMoveSpeed);
  },[refresh]);

  useEffect(() => {
    setInterval(() => {
      setRefresh(new Date());
    }, 20);
  }, []);

  

  return (
    <div
      className="character"
      ref={characterRef}
      style={
        {
          top: posY + 'px',
          left: posX + 'px',
        }
      }
    >
      Character
    </div>
  )
}