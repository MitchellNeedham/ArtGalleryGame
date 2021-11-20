import { useInteractionBoxUpdate } from "../../api/InteractionBoxContext";
import { useCharacter } from "../../api/CharacterContext";
import { useVideos } from "../../api/VideosContext";
import VideoSelectionInterface from "./VideoSelectionInterface";
import { useEffect, useState } from "react";

export default function VideoSelection(props) {
  const {
    pos,
    door,
    smallticket,
    bigticket,
    button
  } = props;
  const { addInteractionBox } = useInteractionBoxUpdate();
  const { charPos } = useCharacter();
  const { lastChanged } = useVideos();
  const [ticketDeployed, setTicketDeployed] = useState(false);
  const [refresh, setRefresh] = useState();
  const [ticketPos, setTicketPos] = useState(pos);
  const [enterTime] = useState(new Date());

  useEffect(() => {
    if (lastChanged > enterTime) {
      setTicketDeployed(true);
      setTicketPos(button.pos);
    }
  }, [lastChanged, enterTime, pos, button]);

  useEffect(() => {
    const t = setInterval(() => {
      setRefresh(new Date());
    }, 25);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
   if (ticketDeployed) {
      const orthoDist = Math.abs(charPos[1]-ticketPos[1]*100) + Math.abs(charPos[0]-ticketPos[0]*100) - 15;

      setTicketPos(([prevPosX, prevPosY]) => {
        const magnitude = Math.sqrt(Math.pow((charPos[0]/100 - ticketPos[0]), 2) + Math.pow((charPos[1]/100 - ticketPos[1]), 2));
        return ([
          prevPosX + (charPos[0]/100 - ticketPos[0])/magnitude * 0.012,
          prevPosY + ((charPos[1]/100 - 0.15) - ticketPos[1])/magnitude * 0.012
        ]);
      });

      if (orthoDist < 6) {
        setTicketDeployed(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh, charPos]);

  return (
    <>
      <div
        className="video-selection art"
        style={
          {
            position: "absolute",
            backgroundImage: `url(${button.image})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            top: button.pos[1] * 100 + 'vh',
            left: button.pos[0] * 100 + 'vh',
            width: button.dim[0] * 100 + 'vh',
            height: button.dim[1] * 100 + 'vh'
          }
        }
        onClick={
          () => addInteractionBox((closeUI) => (
            <VideoSelectionInterface closeUI={closeUI} doorID={door} pos={pos} />), '125vh', null, bigticket
          )
        }
      />
      {
        ticketDeployed && (
          <div
            style={
              {
                position: 'absolute',
                left: ticketPos[0] * 100 + 'vh',
                top: ticketPos[1] * 100 + 'vh',
                width: '100px',
              }
            }
          >
            <img src={smallticket} alt="" style={{width: 'inherit'}} />
          </div>
        )
      }
    </>
  )
};
