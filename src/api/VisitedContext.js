import React, {
  createContext,
  useContext,
  useState,
} from 'react';

const ROOM_COUNT = 3;

const visitedContext = createContext([]);
const visitedUpdateContext = createContext([]);

export default function VisitedProvider({ children }) {
  const [visitedRooms, setVisitedRooms] = useState(Array(ROOM_COUNT).fill(false));

  function updateVisited(n) {
    if (visitedRooms[n]) return;
    setVisitedRooms((rooms) => rooms.map((bool, i) => i === n ? true : bool ));
    console.log(visitedRooms);
  }

  return (
    <visitedUpdateContext.Provider value={{ updateVisited }}>
      <visitedContext.Provider value={{ visitedRooms }}>
        {children}
      </visitedContext.Provider>
    </visitedUpdateContext.Provider>
  );
}

export function useVisited() {
  const { visitedRooms } = useContext(visitedContext);
  return { visitedRooms };
}

export function useVisitedUpdate() {
  const { updateVisited } = useContext(visitedUpdateContext);
  return { updateVisited };
}