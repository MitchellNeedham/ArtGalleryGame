import { useRef, useEffect, useState } from "react";

import { useMusic, useMusicUpdate } from "../../api/MusicContext";
import { useSceneLoaded } from "../../api/LoadedContext";
import { useInteractionBoxUpdate } from "../../api/InteractionBoxContext";

import MusicSelection from "./MusicSelection";
import AudioPlayer from "react-h5-audio-player";
import 'react-h5-audio-player/src/styles.scss';

function mod(n, m) {
  return ((n % m) + m) % m;
}

export default function ArtMusic(props) {
  const {
    selectpos
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
      audioRef.current?.audio.current.play();
      return;
    }
    audioRef.current?.audio.current.pause();
  }, [playing]);

  useEffect(() => {
    setTimeout(() => setPlaying(isLoaded), 500);
  }, [isLoaded]);

  const openSongs = () => {
    addInteractionBox(
      (closeUI) => (<MusicSelection closeUI={closeUI} />)
    , '1000px');
  }

  const handleChangeSong = (change) => {
    const newSong = mod(activeMusic + change, music.length);
    changeMusic(newSong);
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
      {isLoaded &&
      (
        <div className="music-player" >
          <p>
            {`${music[activeMusic]?.title} - ${music[activeMusic]?.artist}`}
          </p>
          <AudioPlayer
            src={music[activeMusic]?.path}
            ref={audioRef}
            showJumpControls={false}
            showSkipControls
            onClickNext={() => handleChangeSong(1)}
            onClickPrevious={() => handleChangeSong(-1)}
            onCanPlayThrough={() => audioRef.current?.audio.current.play()}
            onEnded={() => handleChangeSong(1)}
            customAdditionalControls={[]}
          />
        </div>
      )}
    </>
  )
}