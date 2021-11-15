import { useEffect, useState, useRef } from "react";

import { useVideos } from "../../api/VideosContext";
import { useSceneLoaded } from "../../api/LoadedContext";

import VideoSelection from "./VideoSelection";

export default function ArtVideo(props) {
  const {
    pos,
    dimensions,
    path
  } = props;
  const [darkRoom, setDarkRoom] = useState(false);
  const darkenRef = useRef(null);
  const [player, setPlayer] = useState(null);
  const [ready, setReady] = useState(false);

  const { videos, activeVideo } = useVideos();
  const { isLoaded } = useSceneLoaded();

  useEffect(() => {
    if (isLoaded && ready && player) {
      setTimeout(() => {
        setDarkRoom(true);
      }, 750);

      setTimeout(() => {
        player.playVideo();
      }, 1000);
    }
  }, [isLoaded, ready, player]);

  const onPlayerStateChange = (event) => {
    if (event.data === window.YT.PlayerState.PLAYING) {
      setDarkRoom(true);
      //setPaused(false);
      return;
    }
    if (event.data === window.YT.PlayerState.PAUSED || event.data === window.YT.PlayerState.ENDED) {
      //setPaused(true);
      setDarkRoom(false);
    }
  }

  const onPlayerReady = () => {
    setReady(true);
  }

  useEffect(() => {
    window.YT.ready(() => {
      setPlayer(new window.YT.Player('player', {
        width: window.innerHeight * dimensions[0],
        height: window.innerHeight * dimensions[1],
        videoId: videos[activeVideo]?.id,
        playerVars: {
          rel: 0,
          start: 1,
          modestbranding: 1,
        },
        events: {
          onStateChange: onPlayerStateChange,
          onReady: onPlayerReady
        }
      }));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, dimensions]);

  useEffect(() => {
    player?.loadVideoById(videos[activeVideo].id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeVideo, videos]);


  return (
    <>
      <div
        ref={darkenRef}
        className={'theatre-overlay' + (darkRoom ? ' lights-out' : ' lights-on')}
        style={
          {
            position:'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            mixBlendMode: 'multiply',
          }
        }
      >
        <div
          className="video-container"
          style={
            {
              position: 'absolute',
              left: pos[0] * 100 + 'vh',
              top: pos[1] * 100 + 'vh',
              width: window.innerHeight * dimensions[0] + 'px',
              height: window.innerHeight * dimensions[1] + 'px',
              WebkitAnimation: darkRoom ? 'fadelight 3s ease-in-out alternate infinite' : 'none',
              animation: darkRoom ? 'fadelight 3s ease-in-out alternate infinite' : 'none',
              //boxShadow: `0 100px 200px 100px ${darkRoom ? '#fff3' : '#0000'}`,
            }
          }
        >
          <div
            id="player"
          ></div>
        </div>
      </div>
      <VideoSelection pos={[1.1, 0.9]} />
    </>
  )
}