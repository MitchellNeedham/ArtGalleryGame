export default function ArtImageView(props) {
  const {
    path,
    title,
    artist,
    desc
  } = props;
  return (
    <div className="viewer">
      <img src={path} alt="" />
      <h1>{title}</h1>
      <h2 className="artist-text">
        <em>{artist}</em>
      </h2>
      <p>{desc}</p>
    </div>
  )
}