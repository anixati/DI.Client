import { Navigate, Outlet, Route } from 'react-router-dom';
import { AppointeePage } from './appointee/appointee';
import { AppointeeList } from './appointee/appointeeList';
import { BoardAppointmenList } from './appointments/BoardAppointmentsList';
import { BoardsList } from './board';
import { BoardsPage } from './board/BoardsPage';
import { DashboardPage } from './dashboard';
import { MinisterPage } from './ministers/minister';
import { MinisterList } from './ministers/ministerList';
import { PortfolioPage } from './portfolios/portfolio';
import { PotyfolioList } from './portfolios/portfolioList';
import { BoardRolesList } from './roles/BoardRolesList';
import { SecretaryPage } from './secretaries/secretary';
import { SecretaryList } from './secretaries/secretaryList';

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
      <Route index={true} element={<BoardAppointmenList />} />
      <Route path=":entityId" element={<AppointeePage />} />
    </Route>
    <Route path="brdroles">
      <Route index={true} element={<BoardRolesList />} />
      <Route path=":entityId" element={<AppointeePage />} />
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
  </>
);
