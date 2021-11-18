import { useInteractionBoxUpdate } from "../../api/InteractionBoxContext";
import Charactercustomisation from "./CharacterCustomisation";

export default function CharacterCustomisationDrawer(props) {
  const {
    pos,
    dim,
  } = props;

  const { addInteractionBox } = useInteractionBoxUpdate();
  
  const openCustomisation = () => {
    addInteractionBox((closeUI) => <Charactercustomisation {...props} closeUI={closeUI} />, '800px')
  }

  return (
    <div
      style={
        {
          position:"absolute",
          top: pos[1] * 100 + 'vh',
          left: pos[0] * 100 + 'vh',
          width: dim[0] * 100 + 'vh',
          height: dim[0] * 100 + 'vh',
          backgroundColor: 'blue'
        }
      }
      onClick={() => openCustomisation()}
    >

    </div>
  )
}
