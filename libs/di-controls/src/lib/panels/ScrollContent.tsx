import { createStyles, LoadingOverlay, ScrollArea } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';
import { ReactNode, useEffect, useRef, useState } from 'react';

export interface ElasticScrollProps {
  loading: boolean;
  content(scrolled: boolean): ReactNode;
}

const useStyles = createStyles((theme) => ({
  Content: {
    background: 'white',
    flexGrow: '1',
    paddingLeft: 4,
    paddingRight: 4,
  },
}));
export const ScrollContent: React.FC<ElasticScrollProps> = (rx) => {
  const { classes } = useStyles();
  const { height } = useViewportSize();
  const [scrolled, setScrolled] = useState(false);
 // const cardRef = useRef<any>();
  const [ScrollHeight, setScrollHeight] = useState(100);
  useEffect(() => {

   // console.log(height,cardRef.current.offsetHeight,'ss')
   // if (cardRef.current) {
      let rx = height - 200;//cardRef.current.offsetHeight;
      setScrollHeight(rx);
   // }
  }, [height]);
console.log(height,'ss')
  return (
    <div className={classes.Content} >
      <LoadingOverlay visible={rx.loading} />
      <ScrollArea sx={{ height: ScrollHeight, minHeight:300,maxHeight:850, paddingRight: 20 }} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
        {rx.content(scrolled)}
      </ScrollArea>
    </div>
  );
};
