import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

const loadedContext = createContext([]);
const loadedUpdateContext = createContext([]);

export default function LoadedProvider({ children }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [progressMax, setProgressMax] = useState(0);
  const [progressCurr, setProgressCurr] = useState(0);

  useEffect(() => {
    if (!isLoaded) {
      setTimeout(() => setLoaded(!isLoaded), 30000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  useEffect(() => {
    document.getElementById('progress-bar').style.width = 100 - progressCurr/progressMax * 100 + 'vw';
  }, [progressCurr, progressMax]);

  function setLoaded(loaded) {
    setIsLoaded(loaded);
    document.getElementById('loading-screen').className = loaded ? "hidden-ls" : "visible-ls";
    document.getElementById('progress-bar').style.width = 0;
    setProgressCurr(0);
    setProgressMax(0);
  }

  function updateProgressCurr(curr) {
    setProgressMax((max) => Math.max(max, curr));
    setProgressCurr(curr);
  }

  return (
    <loadedUpdateContext.Provider value={{ setLoaded, updateProgressCurr }}>
      <loadedContext.Provider value={{ isLoaded }}>
        {children}
      </loadedContext.Provider>
    </loadedUpdateContext.Provider>
  );
}

export function useSceneLoaded() {
  const { isLoaded } = useContext(loadedContext);
  return { isLoaded };
}

export function useSceneLoadedUpdate() {
  const { setLoaded, updateProgressCurr } = useContext(loadedUpdateContext);
  return { setLoaded, updateProgressCurr };
}