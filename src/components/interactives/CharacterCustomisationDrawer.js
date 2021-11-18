import { useState } from "react";
import { useInteractionBoxUpdate } from "../../api/InteractionBoxContext";
import Charactercustomisation from "./CharacterCustomisation";

export default function CharacterCustomisationDrawer(props) {
  const {
    pos,
    dim,
  } = props;

  const [played, setPlayed] = useState(!!sessionStorage.getItem('played'));
  const { addInteractionBox } = useInteractionBoxUpdate();
  
  const openCustomisation = () => {
    addInteractionBox((closeUI) => <Charactercustomisation {...props} closeUI={closeUI} />, '800px')
  }

  return (
    <div
      className={`drawer ${!played && 'drawer-ajar'}`}
      style={
        {
          position:"absolute",
          top: pos[1] * 100 + 'vh',
          left: pos[0] * 100 + 'vh',
          width: dim[0] * 100 + 'vh',
          height: dim[1] * 100 + 'vh',
        }
      }
      onClick={() => openCustomisation()}
      onMouseEnter={() => setPlayed(true)}
    >

    </div>
  )
}
