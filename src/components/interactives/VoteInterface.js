import { useVisited } from "../../api/VisitedContext";

export default function VoteInterface(props) {
  const { visitedRooms } = useVisited();

  console.log(visitedRooms);

  if (visitedRooms.some((room) => !room)) {
    return (
      <div
        style={
          {
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translateX(-50%) translateY(-80%)',
            textAlign: 'center'
          }
        }
      >
        <h1>
          Have a look at all the art on display and come back here to vote!
        </h1>
      </div>
    )
  }

  return (
    <div>
      Hello
    </div>
  );
}
