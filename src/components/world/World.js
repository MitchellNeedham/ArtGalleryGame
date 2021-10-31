import { useEffect, useState } from 'react';
import axios from 'axios';

import { Scene } from '../scenes';

export default function World() {
  const [worldData, setWorldData] = useState([]);
  const [characterData, setCharacterData] = useState({});
  const [scene] = useState(0);

  useEffect(() => {
    axios
    .all([
      axios.get('/data/worlds/test_world.json'),
      axios.get('/data/characters/test_character.json')
    ])
    .then(axios.spread((res1, res2) => {
      setCharacterData(res2.data);
      setWorldData(res1.data);
    }));
  }, []);

  console.log(characterData);

  return (
    <div>
      <Scene scene={worldData[scene]} character={characterData} />
    </div>
  );

}