import { useEffect, useState, useRef } from "react";

export default function ArtVideo(props) {
  const {
    pos,
    dimensions,
    path
  } = props;
  const [darkRoom, setDarkRoom] = useState(false);
  const darkenRef = useRef(null);

  const onPlayerStateChange = (event) => {
    if (event.data === window.YT.PlayerState.PLAYING) {
      setDarkRoom(true);
      return;
    };
    setDarkRoom(false);
  }

  const onPlayerReady = (event) => {
    event.target.playVideo();
  }

  useEffect(() => {
    window.YT.ready(() => {
      new window.YT.Player('player', {
        width: window.innerHeight * dimensions[0],
        height: window.innerHeight * dimensions[1],
        videoId: path,
        playerVars: {
          rel: 0,
          start: 1,
          modestbranding: 1,
        },
        events: {
          onStateChange: onPlayerStateChange,
          onReady: onPlayerReady
        }
      });
    });    
  }, [path, dimensions]);

  

  return (
    <div
      ref={darkenRef}
      className={'theatre-overlay' + (darkRoom ? ' lights-out' : ' lights-on')}
      style={
        {
          position:'relative',
          width: '100%',
          height: '100%',
          //backgroundColor: darkRoom ? '#000a' : '#0000',
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
  )
}