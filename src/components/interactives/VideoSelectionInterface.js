import { useVideos, useVideosUpdate } from "../../api/VideosContext";

export default function VideoSelectionInterface({ pos, closeUI, doorID }) {
  const { videos, activeVideo } = useVideos();
  const { changeVideo } = useVideosUpdate();
  const door = document.getElementById(doorID);
  
  const handleClick = (event, index) => {
    event.stopPropagation();
    changeVideo(index);
    door?.click({ pos });
    closeUI();
  }

  return (
    <div
      className="video-selection-ui"
      style={
        {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          padding: '50px 0',
        }
      }
    >
      {videos.map((videoData, i) => (
        <div
          key={videoData.id}
          style= {
            {
              fontWeight: i === activeVideo ? 700 : 400,
            }
          }
          onClick={(e) => handleClick(e, i)}
        >
          <p>
           {[videoData.title, videoData.artist].filter(Boolean).join(' - ')}
          </p>
        </div>
      ))}
    </div>
  )
};
