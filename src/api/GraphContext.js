import React, {
  createContext,
  useContext,
  useState,
} from 'react';

import { constructGraph } from '../scripts/pathfinding';

const graphContext = createContext([]);
const graphUpdateContext = createContext([]);

export default function GraphProvider({ children }) {
  const [graphs, setGraphs] = useState(new Map());

  function updateGraphs(scene, outer, inner) {
    const graph = constructGraph(outer, inner ?? []);
    setGraphs((obj) => (
      obj.set(scene, graph)
    ));
    return true;
  }

  return (
    <graphUpdateContext.Provider value={{ updateGraphs }}>
      <graphContext.Provider value={{ graphs }}>
        {children}
      </graphContext.Provider>
    </graphUpdateContext.Provider>
  );
}

export function useSceneGraph() {
  const { graphs } = useContext(graphContext);
  return { graphs };
}

export function useSceneGraphUpdate() {
  const { updateGraphs } = useContext(graphUpdateContext);
  return { updateGraphs };
}