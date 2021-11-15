import { useRef, useEffect, useState } from "react";

import { useMusic, useMusicUpdate } from "../../api/MusicContext";
import { useSceneLoaded } from "../../api/LoadedContext";
import { useInteractionBoxUpdate } from "../../api/InteractionBoxContext";

import MusicSelection from "./MusicSelection";

export default function ArtMusic(props) {
  const {
    selectpos,
    playpos
  } = props;
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const { isLoaded } = useSceneLoaded();
  const { music, activeMusic } = useMusic();
  const { changeMusic } = useMusicUpdate();
  const { addInteractionBox } = useInteractionBoxUpdate();

  useEffect(() => {
    setPlaying(true);
  }, [activeMusic]);

  useEffect(() => {
    if (playing) {
      audioRef.current?.play();
      return;
    }
    audioRef.current?.pause();
  }, [playing]);

  useEffect(() => {
    setTimeout(() => setPlaying(isLoaded), 500);
  }, [isLoaded]);

  const openSongs = () => {
    addInteractionBox(
      (closeUI) => (<MusicSelection closeUI={closeUI} />)
    , '1000px');
  }

  return (
    <>
      <div
        className="song-selection art"
        style={
          {
            position: 'absolute',
            top: selectpos[1] * 100 + 'vh',
            left: selectpos[0] * 100 + 'vh',
          }
        }
        onClick={() => openSongs()}
        onKeyUp={(e) => e.key === 'Enter' && openSongs(!playing)}
      >
        Songs
      </div>
      <div
        className="song-selection art"
        style={
          {
            position: 'absolute',
            top: playpos[1] * 100 + 'vh',
            left: playpos[0] * 100 + 'vh',
          }
        }
        onClick={() => setPlaying(!playing)}
        onKeyUp={(e) => e.key === 'Enter' && setPlaying(!playing)}
      >
        {playing ? 'Pause' : 'Play'}
      </div>
      {isLoaded &&
        <audio
          style={
            {
              position: 'absolute',
              top: selectpos[1] * 100 + 'vh',
              left: selectpos[0] * 100 + 'vh',
            }
          }
          ref={audioRef}
          src={music[activeMusic]?.path}
          onCanPlayThrough={(e) => audioRef.current?.play()}
          onEnded={() => changeMusic(activeMusic + 1)}
        >
        </audio>
      }
    </>
  )
}