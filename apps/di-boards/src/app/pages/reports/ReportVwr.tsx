import { PageView } from '@dotars/di-controls';
import { createStyles } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Receipt } from 'tabler-icons-react';
import { IReportDef } from './Dashboard';

const rvStyles = createStyles((theme) => ({
  frame: {
    padding: 5,
    //border: 'none',
    overflow: 'scroll',
    minHeight: 50,
    border: '1px solid #ccc',
  },
}));

export const ReportVwr: React.FC = () => {
  const { classes } = rvStyles();
  const [report, setReport] = useState<IReportDef | undefined>(undefined);
  const [url, setUrl] = useState('');
  const { height, width } = useViewportSize();
  const { state } = useLocation();
  useEffect(() => {
    const { item } = state as any;
    if (item) {
      const rp = item as IReportDef;
      if (rp) {
        setReport(rp);
        setUrl(rp.url);
      }
    }
  }, [state]);
  return (
    <PageView title={report !== undefined ? report.title : ''} desc={report !== undefined ? report.description : ''} icon={<Receipt />} hideNavbtn={true}>
      <iframe id="myIframe" className={classes.frame} src={url} width="100%" height={height} title="Board Reports" allowFullScreen={true} />
    </PageView>
  );
};
