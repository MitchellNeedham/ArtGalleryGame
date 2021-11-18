import { useInteractionBoxUpdate } from "../../api/InteractionBoxContext";
import ArtImageView from "./ArtImageView";

export default function ArtImage(props) {
  const {
    pos,
    height,
    path,
    frame
  } = props;
  const { addInteractionBox } = useInteractionBoxUpdate();
  return (
    <div
      className="art art-image"
      style={
        {
          position: 'absolute',
          left: `${pos[0] * 100}vh`,
          top: `${pos[1] * 100}vh`,
          height: `${height * 100}vh`,
        }
      }
      onClick={
        () => addInteractionBox(() => <ArtImageView {...props} />, '1400px')
      }
    >
      <img 
        src={frame.image}
        alt=""
        style={
          {
            position: 'absolute',
            height: frame.height,
            left: frame.offsetX * 100 + 'vh',
            top: frame.offsetY * 100 + 'vh'
          }
        }
      />
      <img
        src={path}
        alt="Please respect the artist by not misusing this artwork"
        style={
          {
            height: `${height * 100}vh`,
            pointerEvents: 'none'
          }
        }
      />
    </div>
  )
}