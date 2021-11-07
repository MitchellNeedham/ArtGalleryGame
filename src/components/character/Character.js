import { useState, useRef, useEffect } from 'react';
import './character.scss';

const charMoveSpeed = (size) => 1/(size/3 + 1);

export default function Character({ character, pos, unitSize, newPos, changeScene }) {
  const characterRef = useRef(null);
  const [refresh, setRefresh] = useState(0);
  const [posX, setPosX] = useState(pos[0] * 100);
  const [posY, setPosY] = useState(pos[1] * 100);
  const [height] = useState(character.dimensions.height);
  const [width] = useState(character.dimensions.width);
  const [targetPos, setTargetPos] = useState(newPos);

  useEffect(() => {
    setPosX(pos[0] * 100);
    setPosY(pos[1] * 100);
  }, [pos]);


  useEffect(() => {
    const t = setInterval(() => {
      setRefresh(new Date());
    }, 25);
    return () => clearInterval(t);
  }, []); 

  useEffect(() => {
    setTargetPos(newPos === null ? null : [newPos[0]/window.innerHeight*100, newPos[1]/window.innerHeight*100]);
  }, [newPos]);

  const normalY = posY/100;
  const m = (unitSize.max-unitSize.min)/(unitSize.floorMax-unitSize.floorMin);
  const c = unitSize.min - m * unitSize.floorMin;
  const ratio = normalY*m+c;

  const handleMove = () => {
   if (targetPos) {
      const orthoDist = Math.abs(posY-targetPos[1]) + Math.abs(posX-targetPos[0]);
      const speedX = Math.abs(posX-targetPos[0])/orthoDist * Math.sign(targetPos[0]-posX);
      const speedY = Math.abs(posY-targetPos[1])/orthoDist * Math.sign(targetPos[1]-posY);
      setPosX(posX => posX + speedX * charMoveSpeed(ratio) * ratio);
      setPosY(posY => posY + speedY * charMoveSpeed(ratio) * ratio * 0.75);

      if (orthoDist < 3) {
        setTargetPos(null);
        if (changeScene) changeScene();
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
          top: posY - ratio * height * 0.8 + 'vh',
          left: posX - ratio * width / 2 + 'vh',
          backgroundImage: `url(${character.actions.idle.imageSequence[0]})`
        }
      }
    />
  )
}