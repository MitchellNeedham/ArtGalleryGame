import splash from '../../images/menu/Acknowledgement.jpg';
import button from '../../images/menu/button.png';

export default function SplashScreen({ close }) {
  return (
    <>
      <img
        src={splash}
        alt=""
        style={
          {
            zIndex: 19,
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            height: '100%'
          }
        }
      />
      <img
        className="arrow-button"
        src={button}
        alt=""
        style={
          {
            zIndex: 20,
            position: 'absolute',
            top: '75%',
            left: '50%',
            transform: 'translateX(-50%)',
            height: '10vh'
          }
        }
        onClick={() => close()}
      />
    </>
  )
}