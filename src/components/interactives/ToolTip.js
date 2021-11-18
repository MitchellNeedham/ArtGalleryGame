import { useState } from "react";

export default function ToolTip(props) {
  const {
    image
  } = props;

  const [src, setSrc] = useState(image);

  if (!!sessionStorage.getItem('played')) {
    return <></>;
  }

  return (
    <img
      src={src}
      alt=""
      style={
        {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 200,
          backdropFilter: 'brightness(0.7)'
        }
      }
      onClick={() => {setSrc(''); sessionStorage.setItem('played', 'true')}}
    />
  )
}