import axios from 'axios';
import React, {
  createContext,
  useContext,
  useState,
} from 'react';
import { useEffect } from 'react/cjs/react.development';

const musicContext = createContext([]);
const musicUpdateContext = createContext([]);

export default function MusicProvider({ children }) {
  const [music, setMusic] = useState([]);
  const [activeMusic, setActiveMusic] = useState(0);

  useEffect(() => {
    axios.get('/data/music/music.json')
    .then((res) => {
      setMusic(res.data);
    });
  }, []);

  function changeMusic(index) {
    setActiveMusic(index);
  }

  return (
    <musicUpdateContext.Provider value={{ changeMusic }}>
      <musicContext.Provider value={{ activeMusic, music }}>
        {children}
      </musicContext.Provider>
    </musicUpdateContext.Provider>
  );
}

export function useMusic() {
  const { activeMusic, music } = useContext(musicContext);
  return { activeMusic, music };
}

export function useMusicUpdate() {
  const { changeMusic } = useContext(musicUpdateContext);
  return { changeMusic };
}