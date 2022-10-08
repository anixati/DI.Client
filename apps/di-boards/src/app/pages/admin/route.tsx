import React from 'react';
import { Outlet, Route } from 'react-router-dom';
import { AdminPage } from './admin';
import { AuditsPage } from './audit/AuditsPage';
import { OptionsPage } from './refdata';
import { RoleDetailsPage, RolesPage, TeamDetailsPage, TeamsPage, UserDetailsPage, UsersPage } from './security';

export const AdminLayout: React.FC = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export const AdminRouteList = (
  <>
    <Route path="dashboard" element={<AdminPage />} />
    <Route path="options" element={<OptionsPage />} />
    <Route path="logs" element={<AuditsPage />} />

    <Route path="users">
      <Route index={true} element={<UsersPage />} />
      <Route path=":entityId" element={<UserDetailsPage />} />
    </Route>

    <Route path="roles">
      <Route index={true} element={<RolesPage />} />
      <Route path=":entityId" element={<RoleDetailsPage />} />
    </Route>

    <Route path="teams">
      <Route index={true} element={<TeamsPage />} />
      <Route path=":entityId" element={<TeamDetailsPage />} />
    </Route>

   
  </>
);
