import { AppMain } from '@dotars/di-shell';
import { Navigate, Route } from 'react-router-dom';
import { ActiveBoardsPage, AdminLayout, AdminRouteList, BoardsLayout, DashboardPage, GenderReportPage, Report1Page, Report2Page, ReportdashPage, ReportLayout, UpcomingPage, VacanciesPage } from './pages';
import { RootLayout } from './RootLayout';

export const HomePage: React.FC = () => {
  return <Navigate to="boards" replace />;
};

export const AppRoutes: React.FC = () => {
  return (
    <AppMain>
      <Route path="/" element={<RootLayout />}>
        <Route path="" element={<HomePage />} />
        <Route path="boards" element={<BoardsLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="active" element={<ActiveBoardsPage />} />
          <Route path="vacancies" element={<VacanciesPage />} />
          <Route path="upcoming" element={<UpcomingPage />} />
          <Route path="appointees" element={<UpcomingPage />} />
          <Route path="events" element={<UpcomingPage />} />
        </Route>
        <Route path="reports" element={<ReportLayout />}>
          <Route path="dashboard" element={<ReportdashPage />} />
          <Route path="gender" element={<GenderReportPage />} />
          <Route path="report1" element={<Report1Page />} />
          <Route path="report2" element={<Report2Page />} />
        </Route>
         <Route path="admin" element={<AdminLayout />}>
           {AdminRouteList}         
        </Route> 
      </Route>
    </AppMain>
  );
};
