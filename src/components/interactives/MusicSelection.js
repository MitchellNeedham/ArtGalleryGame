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
          padding: '30px 0',
          gap: '20px 50px'
        }
      }
    >
      {music.map((song, i) => (
        <div
          key={song.id}
          style={
            {
              fontWeight: i === activeMusic ? 700 : 400,
              width: '40%',
              textAlign: i % 2 === 0 ? 'right' : 'left'
            }
          }
          onClick={() => handleChangeMusic(i)}
        >
          {[song.title, song.artist].filter(Boolean).join(' - ')}
        </div>
      ))}
    </div>
  );
}
