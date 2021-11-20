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
  const [loadingScreen, setLoadingScreen] = useState(null);
  const [progressBar, setProgressBar] = useState(null);
  const [progressMax, setProgressMax] = useState(0);
  const [progressCurr, setProgressCurr] = useState(0);

  useEffect(() => {
    setLoadingScreen(document.getElementById('loading-screen'));
    setProgressBar(document.getElementById('progress-bar'));
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      setTimeout(() => setLoaded(!isLoaded), 15000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  useEffect(() => {
    if (!progressBar) return;
    progressBar.style.width = 100 - progressCurr/progressMax * 100 + 'vw';
  }, [progressCurr, progressBar, progressMax]);

  function setLoaded(loaded) {
    if (!loadingScreen || !progressBar) return;
    setIsLoaded(loaded);
    loadingScreen.className = loaded ? "hidden-ls" : "visible-ls";
    progressBar.style.width = 0;
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