import { Card } from '@mantine/core';
import { useLayoutEffect, useRef, useState } from 'react';

export interface cardProps {
  offset: number;
}
export const ElasticCard: React.FC<cardProps> = (rx) => {
  const cardRef = useRef<any>();
  const [pnlHeight, setPnlHeight] = useState(200);
  useLayoutEffect(() => {
    setPnlHeight(cardRef.current.parentNode.getBoundingClientRect().height - 75);
  }, [cardRef]);
  return (
    <Card withBorder style={{ height: pnlHeight }} ref={cardRef}>
      {rx.children}
    </Card>
  );
};



