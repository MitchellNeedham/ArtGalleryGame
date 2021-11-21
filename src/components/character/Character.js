import { useState, useRef, useEffect } from 'react';
import pathfinding from '../../scripts/pathfinding';
import './character.scss';
import { useSceneGraph } from '../../api/GraphContext';
import { useSceneLoaded } from '../../api/LoadedContext';
import { useCharacter, useCharacterUpdate } from '../../api/CharacterContext';

const charMoveSpeed = (size) => 5/(size/3 + 1)/6;
const SCREEN_EDGE_OFFSET = (window.innerWidth - window.innerHeight * 2900 / 2160) / 2;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, sceneID]);

  const detectMouseOnEdge = (e) => {
    if (window.innerWidth < 600 || window.innerHeight < 600 || window.matchMedia("(any-hover: none)").matches || window.matchMedia("(hover: none)").matches) {
      setScrollDir(0);
      return;
    }
    //eslint-disable-next-line
    if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    //eslint-disable-next-line
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
      setScrollDir(0);
      return;
    }
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

  function getFacingDirection() {
    if (!characterRef?.current) return 1;
    const midPoint = window.innerWidth / 2;
    const charPosX = characterRef.current.getBoundingClientRect().x;

    return charPosX < midPoint ? -1 : 1;
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
          WebkitTransform: `scaleX(${-Math.sign(speed[0]) || getFacingDirection()})`,
          transform: `scaleX(${-Math.sign(speed[0]) || getFacingDirection()})`,
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