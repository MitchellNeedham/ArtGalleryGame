import React, {
  createContext,
  useContext,
  useState,
} from 'react';

const loadedContext = createContext([]);
const loadedUpdateContext = createContext([]);

export default function LoadedProvider({ children }) {
  const [isLoaded, setIsLoaded] = useState(false);

  function setLoaded(state) {
    setIsLoaded(state);
  }

  return (
    <loadedUpdateContext.Provider value={{ setLoaded }}>
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
  const { setLoaded } = useContext(loadedUpdateContext);
  return { setLoaded };
}