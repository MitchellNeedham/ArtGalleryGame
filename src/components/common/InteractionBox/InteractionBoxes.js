import { useInteractionBox } from '../../../api/InteractionBoxContext';
import InteractionBox from './InteractionBox';

export default function InteractionBoxes() {
  const { IBContent } = useInteractionBox();
  return (
    <>
      {IBContent.map((box) => (
        <InteractionBox
          key={box.id}
          closeUI={() => box.closeUI()}
          width={box.width}
          height={box.height}
          background={box.background}
        >
          {box.content}
        </InteractionBox>
      ))}
    </>
  );
}