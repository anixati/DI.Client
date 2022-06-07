import { Navigate, Outlet, Route } from 'react-router-dom';
import { AppointeePage } from './appointee/appointee';
import { AppointeeList } from './appointee/appointeeList';
import { BoardAppointmentList, BoardAppointmentPage } from './appointments/BoardAppointmentsList';
import { BoardsList } from './board';
import { BoardsPage } from './board/BoardsPage';
import { DashboardPage } from './dashboard';
import { MinisterPage } from './ministers/minister';
import { MinisterList } from './ministers/ministerList';
import { PortfolioPage } from './portfolios/portfolio';
import { PotyfolioList } from './portfolios/portfolioList';
import { BoardRolePage, BoardRolesList } from './roles/BoardRolesList';
import { SecretaryPage } from './secretaries/secretary';
import { SecretaryList } from './secretaries/secretaryList';
import { UsersList } from './users/UsersList';
import { UsersPage } from './users/UsersPage';

export const BoardsLayout: React.FC = () => {
  return <Outlet />;
};

export const IndexPage: React.FC = () => {
  return <Navigate to="/boards" replace />;
};
export const BoardRouteList = (
  <>
    <Route path="boards" element={<IndexPage />} />
    <Route path="dashboard" element={<DashboardPage />} />
    <Route path="list">
      <Route index={true} element={<BoardsList />} />
      <Route path=":entityId" element={<BoardsPage />} />
    </Route>
    <Route path="appointments">
      <Route index={true} element={<BoardAppointmentList />} />
      <Route path=":entityId" element={<BoardAppointmentPage />} />
    </Route>
    <Route path="brdroles">
      <Route index={true} element={<BoardRolesList />} />
      <Route path=":entityId" element={<BoardRolePage />} />
    </Route>

    <Route path="appointees">
      <Route index={true} element={<AppointeeList />} />
      <Route path=":entityId" element={<AppointeePage />} />
    </Route>
    <Route path="ministers">
      <Route index={true} element={<MinisterList />} />
      <Route path=":entityId" element={<MinisterPage />} />
    </Route>
    <Route path="secretaries">
      <Route index={true} element={<SecretaryList />} />
      <Route path=":entityId" element={<SecretaryPage />} />
    </Route>
    <Route path="portfolios">
      <Route index={true} element={<PotyfolioList />} />
      <Route path=":entityId" element={<PortfolioPage />} />
    </Route>
    <Route path="appusers">
      <Route index={true} element={<UsersList />} />
      <Route path=":entityId" element={<UsersPage />} />
    </Route>
  </>
);
