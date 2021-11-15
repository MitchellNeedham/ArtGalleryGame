import axios from 'axios';
import React, {
  createContext,
  useContext,
  useState,
} from 'react';

const sceneContext = createContext([]);
const sceneUpdateContext = createContext([]);

export default function ScenesProvider({ children }) {
  const [activeScene, setActiveScene] = useState(0);

  function changeScene(index) {
    setActiveScene(index);
  }

  return (
    <sceneUpdateContext.Provider value={{ changeScene }}>
      <sceneContext.Provider value={{ activeScene }}>
        {children}
      </sceneContext.Provider>
    </sceneUpdateContext.Provider>
  );
}

export function useScene() {
  const { activeScene } = useContext(sceneContext);
  return { activeScene };
}

export function useSceneUpdate() {
  const { changeScene } = useContext(sceneUpdateContext);
  return { changeScene };
}