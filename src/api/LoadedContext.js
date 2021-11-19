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
    if (!progressBar) return;
    progressBar.style.width = 100 - progressCurr/progressMax * 100 + 'vw';
  }, [progressCurr, progressBar, progressMax]);

  function setLoaded(state) {
    setIsLoaded(state);
    loadingScreen.className = state ? "hidden-ls" : "visible-ls";
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