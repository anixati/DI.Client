import { LoadingOverlay } from '@mantine/core';
import { createContext, useContext, useState } from 'react';
import { IEntity } from './index';

export interface IEntityContext {
  entity?: IEntity;
  refresh: boolean;
  loading: boolean;
  showLoading: (show: boolean) => void;
  select: (entity?: IEntity) => void;
  reload: () => void;
}
export const EntityContext = createContext<IEntityContext | undefined>(undefined);

export const useEntityContext = () => useContext(EntityContext);

export const EntityCtxProvider: React.FC = (rx) => {
  const [refresh, setRefresh] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [entity, setEntity] = useState<IEntity | undefined>(undefined);
  const select = (entity?: IEntity) => {
    setEntity(entity);
  };
  const showLoading = (show: boolean) => {
    setLoading(show);
  };
  const reload = () => {
    setRefresh(true);
  };
  return (
    <EntityContext.Provider value={{ entity, refresh, loading, showLoading, select, reload }}>
      <div>
        {rx.children}
        <LoadingOverlay visible={loading} />
      </div>
    </EntityContext.Provider>
  );
};
