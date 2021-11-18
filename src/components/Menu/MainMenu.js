import { useState } from "react"

import './Menu.scss';
import SplashScreen from "./SplashScreen";

import button from '../../images/menu/button.png';

import menu from '../../images/menu/Menu_BG.jpg';

import about from '../../images/menu/Menu_PAGE_About.png';
import credits from '../../images/menu/Menu_PAGE_Credits.png';
import instructions from '../../images/menu/Menu_PAGE_Instructions.png';

import UIplay from '../../images/menu/Menu_Play_Hover.png';
import UIinstructions from '../../images/menu/Menu_Instructions_Hover.png';
import UIcredits from '../../images/menu/Menu_Credits_Hover.png';
import UItitle from '../../images/menu/Menu_Title_Hover.png';

import menuMusic from '../../images/menu/Menu.mp3';

const PAGES = [
  {
    background: about
  },
  {
    background: credits
  },
  {
    background: instructions
  }
]

export default function MainMenu({ closeMenu }) {
  const [splashOpen, setSplashOpen] = useState(true);
  const [pageOpen, setPageOpen] = useState(-1);
  
  return (
    <>
      {splashOpen && <SplashScreen close={() => setSplashOpen(false)} />}
      <div
        style={
          {
            position: 'absolute',
            top: 0,
            left: 0,
            width: 'max(132vh, 100%)',
            height: '100%',
            backgroundImage: [PAGES[pageOpen]?.background, menu].filter(Boolean).map((bg) => `url(${bg})`).join(','),
            backgroundPosition: 'center',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            zIndex: 40000,
          }
        }
      >
        {pageOpen > -1 ? (
          <img
            src={button}
            alt=""
            className="arrow-button"
            style={
              {
                zIndex: 40010,
                position: 'absolute',
                top: '26.7%',
                left: '50%',
                transform: 'translateX(-365%) scaleX(-1)',
                width: '50px'
              }
            }
            onClick={() => setPageOpen(-1)}
          />
        )
        :
        (
          <>
            <img
              className="menu-ui"
              src={UItitle}
              alt=""
              style={
                {
                  width: '40vh',
                  top: '28%',
                  left: '50%',
                  transform: 'translateX(-37%)'
                }
              }
              onClick={() => setPageOpen(0)}
            />
            <img
              className="menu-ui"
              src={UIcredits}
              alt=""
              style={
                {
                  width: '15vh',
                  top: '42%',
                  left: '50%',
                  transform: 'translateX(150%)'
                }
              }
              onClick={() => setPageOpen(1)}
            />
            <img
              className="menu-ui"
              src={UIinstructions}
              alt=""
              style={
                {
                  width: '18vh',
                  top: '45%',
                  left: '50%',
                  transform: 'translateX(-75%)'
                }
              }
              onClick={() => setPageOpen(2)}
            />
            <img
              className="menu-ui"
              src={UIplay}
              alt=""
              style={
                {
                  width: '16vh',
                  top: '50%',
                  left: '50%',
                  transform: 'translateX(32%)'
                }
              }
              onClick={() => closeMenu()}
            />
          </>
        )}
        <div className="blinking"></div>
        {!splashOpen && (
          <audio
            src={menuMusic}
            loop
            autoPlay
          />
        )}

      </div>
    </>
  )
}