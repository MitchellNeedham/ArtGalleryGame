import { useState } from "react";

export default function SpeechBubble(props) {
  const {
    image,
    pos,
    dim,
  } = props;
  const [visible, setVisible] = useState(false);

  return (
    <>
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
      <div
        style={
          {
            position: 'absolute',
            top: pos[1] * 100 + 'vh',
            left: pos[0] * 100 + 'vh',
            height: dim[1] * 100 + 'vh',
            width: dim[0] * 100 + 'vh'
          }
        }
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      >

      </div>
    </>
  )
}