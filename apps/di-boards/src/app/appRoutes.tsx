import { AppMain } from '@dotars/di-shell';
import { Navigate, Outlet, Route } from 'react-router-dom';
import { AdminLayout, AdminRouteList, BoardRouteList, BoardsLayout, ReportLayout, ReportRouteList } from './pages';

export const RootLayout: React.FC = () => {
  return <Outlet />;
};

export const HomePage: React.FC = () => {
  return <Navigate to="/boards" replace />;
};

export const AppRoutes: React.FC = () => {
  return (
    <AppMain>
      <Route path="/" element={<RootLayout />}>
        <Route path="" element={<HomePage />} />
        <Route path="boards" element={<BoardsLayout />}>
          {BoardRouteList}
        </Route>
        <Route path="reports" element={<ReportLayout />}>
          {ReportRouteList}
        </Route>
        <Route path="admin" element={<AdminLayout />}>
          {AdminRouteList}
        </Route>
      </Route>
    </AppMain>
  );
};
