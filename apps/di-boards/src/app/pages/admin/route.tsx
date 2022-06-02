import React from 'react';
import { Outlet, Route } from 'react-router-dom';
import { AuditsPage } from './audit/AuditsPage';
import { OptionsPage } from './refdata';
import { RolesPage, TeamsPage, UsersPage } from './security';

export const AdminLayout: React.FC = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export const AdminRouteList = (
  <>
    <Route path="options" element={<OptionsPage />} />
    <Route path="logs" element={<AuditsPage />} />
    <Route path="roles" element={<RolesPage />} />
    <Route path="users" element={<UsersPage />} />
    <Route path="teams" element={<TeamsPage />} />
  </>
);
