import { Group, Notification, Text } from '@mantine/core';
import axios from 'axios';
import React, { useCallback } from 'react';
import Async from 'react-async';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle } from 'tabler-icons-react';
import { IDataResponse, SiteSettings } from '../data';
import { getErrorMsg } from '../di-core';
import { useAppContext } from '../state';
import { AuthLoader } from './AuthLoader';
import { removeBearerToken, setBearerToken } from './Core';
import { LogoutPage } from './Logout';
import { REDIRECT_URL_KEY, SecurityCtx } from './types';

export const getSitemap = async () => {
  try {
    const rsp = await axios.get<IDataResponse<SiteSettings>>(`/site`);
    if (rsp.data.failed) throw new Error(`${rsp.data.messages} `);
    if (rsp.data?.result) return rsp.data.result;
    throw new Error(`Failed to get sitemap`);
  } catch (ex) {
    throw new Error(`${getErrorMsg(ex)}`);
  }
};

const SiteMapLoader: React.FC = (rx) => {
  const navigate = useNavigate();
  
  const { setSiteData } = useAppContext();
  const redirectTo = localStorage.getItem(REDIRECT_URL_KEY) || '/';
  // const [_, setRootNav] = useLocalStorage<NavLink[]>({
  //   key: 'site-map',
  //   defaultValue: [],
  // });

  const loadSitemap = useCallback(async () => {
    const siteMap = await getSitemap();
    if (!siteMap) throw new Error('failed to get site data');
    if (siteMap.restricted) navigate('/denied');

    if (siteMap.navigation && setSiteData) setSiteData(siteMap.navigation);
    // const xp = location.pathname;
    // if (setNavRoot) setNavRoot(xp.indexOf('/', 1) > 0 ? xp.substring(0, xp.indexOf('/', 1)) : xp);

    // if (redirectTo) {
    //   const rx = redirectTo.substring(0, redirectTo.indexOf('/', 1));
    // }
    return;
  }, []);

  return (
    <Async promiseFn={loadSitemap}>
      <Async.Loading>
        <AuthLoader msg="Loading site data... Please wait" />
      </Async.Loading>
      <Async.Resolved>
        <Navigate to={redirectTo} />
      </Async.Resolved>
      <Async.Rejected>
        <Notification title="Failed loading site data" disallowClose>
          <Group position="left">
            <AlertCircle size={32} color="red" />
            <Text color="red" size="lg">
              error
            </Text>
          </Group>
        </Notification>
      </Async.Rejected>
    </Async>
  );

};

export const LoginComplete: React.FC<SecurityCtx> = (rx) => {

  const completeLogin = useCallback(async () => {
    await removeBearerToken();
    const user = await rx.manager.signinCallback();
    if (!user) {
      
      throw new Error('login failed');
    }
    await rx.manager.storeUser(user);
    await setBearerToken();
    // const sd= await getSitemap();
    //if(!sd) throw new Error('failed to get sd');
    //SiteUi.Initialize(sd);
    // if (redirectTo) {
    //   const rx = redirectTo.substring(0, redirectTo.indexOf('/', 1));
    // }
    return user;
  }, [rx.manager]);

  return (
    <Async promiseFn={completeLogin}>
      <Async.Loading>
        <AuthLoader msg="Logging in... Please wait" />
      </Async.Loading>
      <Async.Resolved>
        <SiteMapLoader />
      </Async.Resolved>
      <Async.Rejected>
        <LogoutPage manager={rx.manager} />
      </Async.Rejected>
    </Async>
  );
};
