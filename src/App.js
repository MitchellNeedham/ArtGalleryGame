import './App.css';
import { World } from './components/world';
import InteractionBoxProvider from "./api/InteractionBoxContext";
import { InteractionBoxes } from "./components/common/InteractionBox";

function App() {
  return (
    <InteractionBoxProvider>
      <InteractionBoxes />
      <World />
    </InteractionBoxProvider>
  );
}

export default App;
