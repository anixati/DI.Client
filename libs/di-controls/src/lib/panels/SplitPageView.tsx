import { createStyles } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';
import { Allotment } from 'allotment';

import { IPageViewProps, PageView } from './PageView';
const useStyles = createStyles((theme) => ({
  pnlctr: {
    width: '100%',
    height: '100%',
  },
  card: {
    height: '100%',
    padding: '1.5rem',
  },
  container: {
    padding:0,
    overflowY: 'scroll',
    width: '100%',
  },
}));

export const SplitPageView: React.FC<IPageViewProps> = (rx) => {
  const { classes } = useStyles();
  const { height } = useViewportSize();
  return (
    <PageView {...rx}>
      <div className={classes.container} style={{height:'86vh'}}>
        <Allotment>{rx.children}</Allotment>
      </div>
    </PageView>
  );
};
