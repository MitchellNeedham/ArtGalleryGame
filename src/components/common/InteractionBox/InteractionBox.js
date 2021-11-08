import { useState, useEffect } from 'react';
import { useResizeDetector } from 'react-resize-detector';
import Scrollbars from 'react-custom-scrollbars-2';
import './InteractionBox.scss';

import iconClose from '../../../images/icon-close.png';

export default function InteractionBox({
  children, closeUI, width = '600px', height,
}) {
  const [closed, setClosed] = useState(false);
  const [dynamicHeight, setDynamicHeight] = useState(height);
  const { height: newHeight, ref } = useResizeDetector();

  useEffect(() => {
    setDynamicHeight(ref.current.getBoundingClientRect().height + 'px');
  }, [ref, newHeight]);

  if (closed) {
    return (<></>);
  }

  return (
    <div
      className="ib-background"
      role="none"
      onClick={(e) => (closeUI() || setClosed(true)) && e.stopPropagation()}
      onKeyUp={(e) => e.key === 'Escape' && (closeUI() || setClosed(true))}
    >
      <div
        className="ib-main"
        role="none"
        onClick={(e) => e.stopPropagation()}
        onKeyUp={() => {}}
        style={
          {
            width: `min(95vw, ${width})`,
            height: `min(95vh, ${dynamicHeight || height})`,
            left: `calc(50% - min(95vw, ${width}) / 2)`,
            top: `calc(50% - min(95vh, ${dynamicHeight || height}) / 2)`,
          }
        }
      >
        <div
          className="ib-close"
          title="Close"
          role="button"
          tabIndex="0"
          onClick={() => closeUI() || setClosed(true)}
          onKeyDown={(e) => e.key === 'Enter' && (closeUI() || setClosed(true))}
        >
          <img src={iconClose} alt="" />
        </div>
        <Scrollbars>
          <div ref={ref}>
            {children}
          </div>
        </Scrollbars>

      </div>
    </div>
  );
}