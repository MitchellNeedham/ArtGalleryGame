import axios from 'axios';
import React, {
  createContext,
  useContext,
  useState,
  useEffect
} from 'react';

const characterContext = createContext([]);
const characterUpdateContext = createContext([]);

export default function CharacterProvider({ children }) {
  const [characterData, setCharacterData] = useState(null);

  const [colour, setColour] = useState({hue: 0, sat: 1, val: 1});
  const [headAcc, setHeadAcc] = useState([]);
  const [bodyAcc, setBodyAcc] = useState([]);
  const [charPos, setCharPos] = useState([0, 0]);
 
  useEffect(() => {
    axios.get('/data/characters/test_character.json')
    .then((res) => {
      setCharacterData(res.data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updateColour(colour) {
    setColour(colour);
  }

  function updateHeadAcc(acc) {
    setHeadAcc(acc);
  }

  function updateBodyAcc(acc) {
    setBodyAcc(acc)
  }

  function updateCharPos(pos) {
    setCharPos(pos);
  }

  return (
    <characterUpdateContext.Provider value={{ updateColour, updateHeadAcc, updateBodyAcc, updateCharPos }}>
      <characterContext.Provider value={{ characterData, colour, headAcc, bodyAcc, charPos }}>
        {children}
      </characterContext.Provider>
    </characterUpdateContext.Provider>
  );
}

export function useCharacter() {
  const { characterData, colour, headAcc, bodyAcc, charPos } = useContext(characterContext);
  return { characterData, colour, headAcc, bodyAcc, charPos };
}

export function useCharacterUpdate() {
  const { updateColour, updateHeadAcc, updateBodyAcc, updateCharPos } = useContext(characterUpdateContext);
  return { updateColour, updateHeadAcc, updateBodyAcc, updateCharPos };
}