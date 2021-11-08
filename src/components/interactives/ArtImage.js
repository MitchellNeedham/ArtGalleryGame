import { useInteractionBoxUpdate } from "../../api/InteractionBoxContext";
import ArtImageView from "./ArtImageView";

export default function ArtImage(props) {
  const {
    pos,
    height,
    path,
  } = props;
  const { addInteractionBox } = useInteractionBoxUpdate();
  return (
    <img
      className="art art-image"
      src={path}
      alt=""
      style={
        {
          position: 'absolute',
          left: `${pos[0] * 100}vh`,
          top: `${pos[1] * 100}vh`,
          height: `${height * 100}vh`,
          zIndex: 10,
        }
      }
      onClick={
        () => addInteractionBox(() => <ArtImageView {...props} />, '700px')
      }
    />
  )
}