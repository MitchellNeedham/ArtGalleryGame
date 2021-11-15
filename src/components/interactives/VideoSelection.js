import { useInteractionBoxUpdate } from "../../api/InteractionBoxContext";
import VideoSelectionInterface from "./VideoSelectionInterface";

export default function VideoSelection(props) {
  const {
    pos,
    door
  } = props;
  const { addInteractionBox } = useInteractionBoxUpdate();
  return (
    <div
      className="video-selection art"
      style={
        {
          position: "absolute",
          top: pos[1] * 100 + 'vh',
          left: pos[0] * 100 + 'vh',
        }
      }
      onClick={
        () => addInteractionBox((closeUI) => (
          <VideoSelectionInterface closeUI={closeUI} doorID={door} pos={pos} />), '700px'
        )
      }
    >
      <h2>
        Select Film
      </h2>
    </div>
  )
};
