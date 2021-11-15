import axios from 'axios';
import React, {
  createContext,
  useContext,
  useState,
  useEffect
} from 'react';

const videosContext = createContext([]);
const videosUpdateContext = createContext([]);

export default function VideosProvider({ children }) {
  const [videos, setVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(0);

  useEffect(() => {
    axios.get('/data/video/videos.json')
    .then((res) => {
      setVideos(res.data);
    });
  }, []);

  function changeVideo(index) {
    setActiveVideo(index);
  }

  return (
    <videosUpdateContext.Provider value={{ changeVideo }}>
      <videosContext.Provider value={{ activeVideo, videos }}>
        {children}
      </videosContext.Provider>
    </videosUpdateContext.Provider>
  );
}

export function useVideos() {
  const { activeVideo, videos } = useContext(videosContext);
  return { activeVideo, videos };
}

export function useVideosUpdate() {
  const { changeVideo } = useContext(videosUpdateContext);
  return { changeVideo };
}