  import { AppMain } from '@dotars/di-shell';
import { Outlet, Route } from 'react-router-dom';
import { LandingPage } from './LandingPage';
import { AdminLayout, AdminRouteList, BoardRouteList, BoardsLayout, DashboardPage, ReportDashboard, ReportLayout, ReportRouteList } from './pages';
import { AdminPage } from './pages/admin/admin';

const RootLayout: React.FC = () => {
  return <Outlet />;
};

export const AppRoutes: React.FC = () => {
  return (
    <AppMain>
      <Route path="/" element={<RootLayout />}>
        <Route path="" element={<LandingPage />} />
        <Route path="boards" element={<BoardsLayout />}>
          <Route index element={<DashboardPage />} />
          {BoardRouteList}
        </Route>
        <Route path="reports" element={<ReportLayout />}>
          <Route index element={<ReportDashboard />} />
          {ReportRouteList}
        </Route>
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<AdminPage />} />
          {AdminRouteList}
        </Route>
      </Route>
    </AppMain>
  );
};
