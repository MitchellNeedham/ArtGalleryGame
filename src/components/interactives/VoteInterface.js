import { useVisited } from "../../api/VisitedContext";
import { useState } from "react";

import { v4 as uuidv4 } from 'uuid';

import './VoteInterface.scss';
import axios from "axios";

const ART = [
  {
    title: "Film Category",
    text: [
      "Symbiotic Reckoning - Sam Carson",
      "Before Your Eyes - Ivan Jeldres",
      "The Lion's Garden - Madelaine Ari",
      "Stray - Megan Cox",
      "Becoming a Star: The Highs and Lows of Social Media - Richie Hot Model",
      "Always a Stranger in a Foreign Place - Agnese Perri",
      "The Insects Inside My Head - Anne Hsuyin & Edward Foo",
    ],
  },
  {
    title: "Music Category",
    text: [
      "Brick Walls - Finn Baulch",
      "All Things Come In Time - My Giddy Aunt",
      "From Mount Taibai - Ian Coyukiat",
      "Rebeginning - Mayumi Mullins",
      "Brown Hair Blue Eyes - Tasty Lyks",
      "Stop The Blues - Alisha K",
      "How Long Through? - Yelderbert",
    ],
  },
  {
    title: "Visual Art Category",
    text: [
      "Almost Blue - Ivan Jedlres",
      "Realm of Nokia - Luke Rotella",
      "Shh..Listen - Samantha Tran",
      "The Heart is a Muscle - Dion Fibishenko",
      "Ophelia - Keely Varmalis",
      "Poison - Sam Morris",
      "This Too - Jasmine Slater"
    ]
  }
];

export default function VoteInterface() {
  const { visitedRooms } = useVisited();
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState([-1, -1, -1]);
  const [voted, setVoted] = useState(localStorage.getItem('voterID'));

  const handleSubmit = () => {
    if (!localStorage.getItem('voterID')) {
      localStorage.setItem('voterID', uuidv4());
    }
    localStorage.setItem('vote', JSON.stringify(selected));
    axios.post('https://phils-music-list.herokuapp.com/api/vote/add', {
      video: selected[0],
      music: selected[1],
      image: selected[2],
      time: new Date().toISOString(),
      id: localStorage.getItem('voterID')
    })
    setStep(0);
    setVoted(true);
  }

  if (voted) {
    return (
      <div
        className="vote-end"
        style={
          {
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '2vh'
          }
        }
      >
        <h2>
          Thank you for voting!
        </h2>
        <p>
          You can revisit Digital Dawdle at any time to check out all the amazing works.
        </p>
        <div
          className="vote-again"
          onClick={() => setVoted(false)}
        >
          Change vote?
        </div>
      </div>
    )
  }

  if (visitedRooms.some((room) => !room) && !localStorage.getItem('voterID')) {
    return (
      <div
        style={
          {
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            fontSize: '2.5vh'
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
    <div
      className="vote-interface"
      style={
        {
          width: '100%',
          height: '100%',
        }
      }
    >
      <div className="vote-selection">
        <h2>{ART[step].title}</h2>
        {ART[step].text.map((text, i) => {
          const splitText = text.split(' - ');
          return (
            <div
              className="vote-item"
              key={i}
              onClick={() => setSelected((old) => old.map((val, j) => j === step ? i : val))}
              style={
                {
                  color: selected[step] === i ? 'green' : 'black',
                }
              }
            >
              <p><b>{splitText[0]}</b></p>
              <p><em>{splitText[1]}</em></p>
            </div>
          );
        })}
        {selected[step] >= 0 && (
          <div
            className="vote-submit"
            onClick={() => step < selected.length - 1 ? setStep((prev) => prev + 1) : handleSubmit()}
          >
            {step < selected.length - 1 ? 'Next' : 'Submit'}
          </div>
        )}
      </div>
    </div>
  );
}
