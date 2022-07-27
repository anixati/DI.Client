import { Outlet, Route } from 'react-router-dom';
import { ReportVwr } from './ReportVwr';

export const ReportLayout: React.FC = () => {
  return <Outlet />;
};

export const ReportRouteList = (
  <Route path="view">
    <Route path=":reportId" element={<ReportVwr />} />
  </Route>
);
