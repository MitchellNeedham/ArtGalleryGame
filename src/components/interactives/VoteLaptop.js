import { useState } from "react";

import { useInteractionBoxUpdate } from "../../api/InteractionBoxContext";
import VoteInterface from "./VoteInterface";

export default function VoteLaptop(props) {
  const {
    hover,
    pos,
    dim,
    zindex,
    customIB
  } = props;
  const { addInteractionBox } = useInteractionBoxUpdate();
  const [laptopHover, setLaptopHover] = useState(false);

  const openVoteInterface = () => {
    addInteractionBox((closeUI) => <VoteInterface {...props} closeUI={closeUI} />, '120vh', '90vh', customIB)
  }

  return (
    <div
      style={
        {
          backgroundImage: laptopHover ? `url(${hover})` : '',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          position: 'absolute',
          top: pos[1] * 100 + 'vh',
          left: pos[0] * 100 + 'vh',
          width: dim[0] * 100 + 'vh',
          height: dim[1] * 100 + 'vh',
          zIndex: parseInt(zindex, 10) + 100,
          cursor: laptopHover ? 'pointer' : 'auto',
        }
      }
      onMouseEnter={() => setLaptopHover(true)}
      onMouseLeave={() => setLaptopHover(false)}
      onClick={() => openVoteInterface()}
    />
  )
}