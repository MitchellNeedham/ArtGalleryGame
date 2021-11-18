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
  const [activeVideo, setActiveVideo] = useState(-1);
  const [lastChanged, setLastChanged] = useState(null);

  useEffect(() => {
    axios.get('/data/video/videos.json')
    .then((res) => {
      setVideos(res.data);
    });
  }, []);

  function changeVideo(index) {
    setActiveVideo(index);
    setLastChanged(new Date());
  }

  return (
    <videosUpdateContext.Provider value={{ changeVideo }}>
      <videosContext.Provider value={{ activeVideo, videos, lastChanged }}>
        {children}
      </videosContext.Provider>
    </videosUpdateContext.Provider>
  );
}

export function useVideos() {
  const { activeVideo, videos, lastChanged } = useContext(videosContext);
  return { activeVideo, videos, lastChanged };
}

export function useVideosUpdate() {
  const { changeVideo } = useContext(videosUpdateContext);
  return { changeVideo };
}