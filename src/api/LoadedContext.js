import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

const loadedContext = createContext([]);
const loadedUpdateContext = createContext([]);

export default function LoadedProvider({ children }) {
  const [isLoaded, setIsLoaded] = useState([]);

  useEffect(() => {
    if (!isLoaded) {
      console.log(document.getElementsByTagName("video"));
      
      /*.forEach(element => {
        const fadeAudio = setInterval(function () {
            // Only fade if past the fade out point or not at zero already
            if (element.volume != 0.0) {
              element.volume -= 0.1;
            }
            // When volume at zero stop all the intervalling
            if (element.volume === 0.0) {
              clearInterval(fadeAudio);
            }
        }, 200);
      });*/
    }
  }, [isLoaded]);

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