import './App.css';
import { World } from './components/world';
import InteractionBoxProvider from "./api/InteractionBoxContext";
import GraphProvider from './api/GraphContext';
import { InteractionBoxes } from "./components/common/InteractionBox";
import LoadedProvider from './api/LoadedContext';

function App() {
  return (
    <InteractionBoxProvider>
      <GraphProvider>
        <LoadedProvider>
          <InteractionBoxes />
          <World />
        </LoadedProvider>
      </GraphProvider>
    </InteractionBoxProvider>
  );
}

export default App;
