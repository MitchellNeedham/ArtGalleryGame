import { useEffect, useState } from "react";
import { useCharacter } from "../../api/CharacterContext";

export default function SpeechBubble(props) {
  const {
    image,
    posX,
    range,
  } = props;
  const { charPos } = useCharacter();
  const [visible, setVisible] = useState(false);


  useEffect(() => {
    setVisible(charPos[0]/100 > posX - range && charPos[0]/100 < posX + range);
  }, [charPos, posX, range]);

  return (
    <img
      style={
        {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: visible ? 'block' : 'none',
          pointerEvents: 'none'
        }
      }
      src={image}
      alt="speech bubble"
    />
  )
}