import React, {
  createContext,
  useContext,
  useState,
} from 'react';
import { v4 as uuidv4 } from 'uuid';

const interactionBoxContext = createContext([]);
const interactionBoxUpdateContext = createContext([]);

export default function InteractionBoxProvider({ children }) {
  const [IBContent, setIBContent] = useState([]);

  function addInteractionBox(content, width, height, background) {
    const id = uuidv4();
    const newIB = {
      id,
      closeUI: () => close(id),
      content: content(() => close(id)),
      width,
      height,
      background,
    };
    setIBContent([...IBContent, newIB]);
  }

  function close(id) {
    setIBContent(IBContent.filter((obj) => obj.id !== id));
  }

  return (
    <interactionBoxUpdateContext.Provider value={{ addInteractionBox, close }}>
      <interactionBoxContext.Provider value={{ IBContent }}>
        {children}
      </interactionBoxContext.Provider>
    </interactionBoxUpdateContext.Provider>
  );
}

export function useInteractionBox() {
  const { IBContent } = useContext(interactionBoxContext);
  return { IBContent };
}

export function useInteractionBoxUpdate() {
  const { addInteractionBox, close } = useContext(interactionBoxUpdateContext);
  return { addInteractionBox, close };
}