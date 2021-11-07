export default function ArtVideo(props) {
  const {
    pos,
    dimensions,
    path
  } = props;
  return (
      <iframe
        width={window.innerHeight * dimensions[0]}
        height={window.innerHeight * dimensions[1]}
        src={path}
        frameBorder="0"
        style={
          {
            position: 'absolute',
            left: pos[0] * 100 + 'vh',
            top: pos[1] * 100 + 'vh'
          }
        }
        title="Video"
        allowFullScreen
      ></iframe>
  )
}