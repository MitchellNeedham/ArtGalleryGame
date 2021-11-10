import './App.css';
import { World } from './components/world';
import InteractionBoxProvider from "./api/InteractionBoxContext";
import { InteractionBoxes } from "./components/common/InteractionBox";
import LoadedProvider from './api/LoadedContext';

function App() {
  return (
    <InteractionBoxProvider>
      <LoadedProvider>
        <InteractionBoxes />
        <World />
      </LoadedProvider>
    </InteractionBoxProvider>
  );
}

export default App;
