import { useEffect, useState } from 'react';
import axios from 'axios';

import { Scene } from '../scenes';

export default function World() {
  const [worldData, setWorldData] = useState([]);
  const [characterData, setCharacterData] = useState({});
  const [scene, setScene] = useState(0);

  useEffect(() => {
    axios
    .get('/data/worlds/test_world.json')
    .then((res) => {
      setWorldData(res.data);
    });

    axios
    .get('/data/characters/test_character.json')
    .then((res) => {
      setCharacterData(res.data);
    });
  }, []);

  return (
    <div>
      <Scene scene={worldData[scene]} character={characterData} />
    </div>
  );

}