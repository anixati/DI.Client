import { Outlet, Route } from 'react-router-dom';
import { GenderReportPage, Report1Page, Report2Page, ReportdashPage } from './pages';

export const ReportLayout: React.FC = () => {
  return <Outlet />;
};

export const ReportRouteList = (
  <>
    <Route path="dashboard" element={<ReportdashPage />} />
    <Route path="gender" element={<GenderReportPage />} />
    <Route path="report1" element={<Report1Page />} />
    <Route path="report2" element={<Report2Page />} />
  </>
);
