import { useState } from "react";
import Scrollbars from "react-custom-scrollbars-2";
import { useCharacter, useCharacterUpdate } from "../../api/CharacterContext"

import "./CharacterCustomisation.scss";

export default function Charactercustomisation(props) {
  const {
    closeUI
  } = props;
  const { characterData } = useCharacter();
  const current = useCharacter();
  const { updateColour, updateHeadAcc, updateBodyAcc} = useCharacterUpdate();

  const [colour, setColour] = useState(current.colour);
  const [headAcc, setHeadAcc] = useState(current.headAcc);
  const [bodyAcc, setBodyAcc] = useState(current.bodyAcc);

  const handleSubmit = () => {
    updateColour(colour);
    updateHeadAcc(headAcc);
    updateBodyAcc(bodyAcc);
    closeUI();
  }


  return (
    <div style={{padding: '3vh'}}>
      <div className="character-customisation">
        <div className="left">
          <div
            className="character-viewer"
          >
            <div
              style={
                {
                  backgroundImage: `url(${characterData.actions.idle})`,
                  filter: `hue-rotate(${colour.hue}deg) saturate(${colour.sat}) brightness(${colour.val})`
                }
              }
            />
            <div
              style={
                {
                  backgroundImage: [headAcc[0], bodyAcc[0]].filter(Boolean).map((src) => `url(${src})`).join(','),
                }
              }
            />

          </div>
          <div
            className="colour-selection"
          >
            {
              characterData.colours.map((col, i) => (
                <div
                  key={i}
                  className="colour-choice"
                  style={
                    {
                      backgroundColor: characterData.baseColour,
                      filter: `hue-rotate(${col.hue}deg) saturate(${col.sat}) brightness(${col.val})`
                    }
                  }
                  onClick={() => setColour(col)}
                />
              ))
            }
          </div>
        </div>
        <div className="right">
          <Scrollbars>
            <h3>Head</h3>
            <div className="acc-selection">
            {
              characterData.accessories.head.map((acc) => (
                <div
                  key={acc.name}
                  className="acc-item"
                  title={acc.name}
                  style={
                    {
                      backgroundImage: `url(${acc.images[0]})`,
                      backgroundPositionY: '35%',
                    }
                  }
                  onClick={() => setHeadAcc(acc.name === 'none' ? '' : acc.images)}
                />
              ))
            }
            </div>
            <h3>Body</h3>
            <div className="acc-selection">
              {
                characterData.accessories.body.map((acc) => (
                  <div
                    key={acc.name}
                    className="acc-item"
                    title={acc.name}
                    style={
                      {
                        backgroundImage: `url(${acc.images[0]})`,
                        backgroundPositionY: '65%',
                        backgroundSize: '250% auto',
                      }
                    }
                    onClick={() => setBodyAcc(acc.name === 'none' ? '' : acc.images)}
                  />
                ))
              }
            </div>
          </Scrollbars>
        </div>
      </div>
      <div
        className="save-customisation"
        onClick={() => handleSubmit()}
      >
        Save
      </div>
    </div>
  )
}