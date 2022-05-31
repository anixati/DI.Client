import { Outlet, Route } from 'react-router-dom';
import { AppointeeList } from './appointee/appointeeList';
import { AppointeePage } from './appointee/appointee';
import { ActiveBoardsPage, UpcomingPage, VacanciesPage } from './board';
import { DashboardPage } from './dashboard';

export const BoardsLayout: React.FC = () => {
  return <Outlet />;
};

export const BoardRouteList = (
  <>
    <Route path="dashboard" element={<DashboardPage />} />
    <Route path="active" element={<ActiveBoardsPage />} />
    <Route path="vacancies" element={<VacanciesPage />} />
    <Route path="upcoming" element={<UpcomingPage />} />
    <Route path="appointees">
      <Route index={true} element={<AppointeeList />} />
      <Route path=":entityId" element={<AppointeePage />} />
    </Route>
    <Route path="events" element={<UpcomingPage />} />
  </>
);
