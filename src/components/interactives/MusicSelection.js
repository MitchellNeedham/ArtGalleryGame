import { useMusic, useMusicUpdate } from "../../api/MusicContext";

export default function MusicSelection({ closeUI }) {

  const { music, activeMusic } = useMusic();
  const { changeMusic } = useMusicUpdate();

  const handleChangeMusic = (i) => {
    changeMusic(i);
    closeUI();
  }

  return (
    <div
      className="music-selection-ui"
      style={
        {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
          padding: '5vh 0',
          gap: '5vh 3.5vh'
        }
      }
    >
      {music.map((song, i) => (
        <div
          key={song.id}
          style={
            {
              fontWeight: i === activeMusic ? 700 : 400,
              width: '30vh',
              textAlign: 'center',
              fontSize: '1.6vh'
            }
          }
          onClick={() => handleChangeMusic(i)}
        >
          <p>
            {song.title}
          </p>
          <p>
            <em>{song.artist}</em>
          </p>
        </div>
      ))}
      <div style={{width: '30vh'}}></div>
    </div>
  );
}
