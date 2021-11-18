import { useState } from 'react';
import './App.css';
import { World } from './components/world';
import { MainMenu } from './components/Menu';
import InteractionBoxProvider from "./api/InteractionBoxContext";
import GraphProvider from './api/GraphContext';
import { InteractionBoxes } from "./components/common/InteractionBox";
import LoadedProvider from './api/LoadedContext';
import VideosProvider from './api/VideosContext';
import MusicProvider from './api/MusicContext';
import CharacterProvider from './api/CharacterContext';
import VisitedProvider from './api/VisitedContext';


function App() {
  const [menuOpen, setMenuOpen] = useState(true);
  return (
    <InteractionBoxProvider>
      <GraphProvider>
        <VideosProvider>
          <MusicProvider>
            <LoadedProvider>
              <CharacterProvider>
                <VisitedProvider>
                  {menuOpen && false ? <MainMenu closeMenu={() => setMenuOpen(false)}/> : <World />}
                  <InteractionBoxes />
                </VisitedProvider>
              </CharacterProvider>
            </LoadedProvider>
          </MusicProvider>
        </VideosProvider>
      </GraphProvider>
    </InteractionBoxProvider>
  );
}

export default App;
