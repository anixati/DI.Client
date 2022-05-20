import { IApiResponse, IChangeRequest, useEntityContext } from '@dotars/di-core';
import { Button, createStyles, Group, Text } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import axios from 'axios';
import { ReactNode, useEffect, useState } from 'react';
import { AlertOctagon } from 'tabler-icons-react';
import { dispatch } from 'use-bus';

const useStyles = createStyles((theme) => ({
  button: {
    borderRadius: 0,

    '&:not(:first-of-type)': {
      borderLeftWidth: 0,
    },

    '&:first-of-type': {
      borderTopLeftRadius: theme.radius.sm,
      borderBottomLeftRadius: theme.radius.sm,
    },

    '&:last-of-type': {
      borderTopRightRadius: theme.radius.sm,
      borderBottomRightRadius: theme.radius.sm,
    },
  },
}));

export interface EntityToolbarProps {
  url: string;
  canLock: boolean;
  actions?: ReactNode;
  disabled: boolean;
  onUpdate: () => void;
  OnCreate: () => void;
}
export const EntityBar: React.FC<EntityToolbarProps> = (rx) => {
  const { classes } = useStyles();
  const modals = useModals();
  const ectx = useEntityContext();
  const isNew = ectx?.entity === undefined;
  const [disabled, setDisabled] = useState<boolean>(rx.disabled);
  //const [disabled,] = useAtom(disableToolbar);
  let payload: IChangeRequest;
  //const [payload, setPayload] = useState<IChangeRequest>();

  useEffect(() => {
    setDisabled(rx.disabled);
  }, [rx]);

  const changeState = async (request: IChangeRequest) => {
    const resp = await axios.post<IApiResponse>(rx.url, request);
    const data = resp.data;
    if (data.failed) {
      console.log(data);
      showNotification({ autoClose: 5000, title: 'Failed to change state', message: `${data.messages}`, color: 'red', icon: <AlertOctagon /> });
    } else {
      Notify(request.action, data);
    }
    return data;
  };

  const Notify = (action: number, data: IApiResponse) => {
    let title = '';
    let notifyMsg = 'RELOAD';
    switch (action) {
      case 2: {
        title = 'Enabled Sucessfully!';
        break;
      }
      case 3: {
        title = 'Disabled Sucessfully!';
        break;
      }
      case 4: {
        title = 'Locked Sucessfully!';
        break;
      }
      case 5: {
        title = 'Unlocked Sucessfully!';
        break;
      }
      case 6: {
        title = 'Deleted Sucessfully!';
        notifyMsg = 'ONDELETE';
        break;
      }
    }
    showNotification({ autoClose: 5000, title: `${title}`, message: `${data?.result?.message}`, color: 'blue', icon: <AlertOctagon /> });
    dispatch(notifyMsg);
  };
  const execAction = async (action: number, reason: string) => {
    if (ectx && ectx.entity) {
      try {
        ectx.showLoading(true);
        const id = ectx.entity.id;
        if (id) {
          await  changeState({ id, name: 'User Action', reason: reason, action: action });
        }
      } finally {
        ectx.showLoading(false);
      }
    }
  };

  const onClickCreate = () => {
    try {
      ectx?.showLoading(true);
      rx.OnCreate();
    } finally {
      ectx?.showLoading(false);
    }
  };
  const onClickUpdate = () => {
    try {
      ectx?.showLoading(true);
      rx.onUpdate();
    } finally {
      ectx?.showLoading(false);
    }
  };
  const onClickLock = () => {
    execAction(4, 'Lock entity');
  };
  const onClickUnlock = () => {
    execAction(5, 'UnLock entity');
  };
  const onClickDisable = () => {
    execAction(3, 'Disable entity');
  };
  const onClickEnable = () => {
    execAction(2, 'Enable entity');
  };
  const onClickDelete = () => {
    modals.openConfirmModal({
      title: 'Please confirm',
      centered: true,
      children: <Text size="sm">Are you sure you want to delete this </Text>,
      labels: { confirm: 'Yes', cancel: 'No' },
      confirmProps: { color: 'red' },
      onConfirm: () => {
              execAction(6, 'Delete entity');
      },
    });


  
  };

  return (
    <Group spacing={0} position="right">
      {rx.actions}
      {isNew && (
        <Button  color="dotars" className={classes.button} compact onClick={onClickCreate}>
          Create
        </Button>
      )}
      {!isNew && (
        <>
          {ectx?.entity?.isDisabled === false && ectx?.entity?.isLocked === false && (
            <Button  color="dotars" className={classes.button} compact onClick={onClickUpdate} disabled={disabled}>
              Update
            </Button>
          )}

          {rx.canLock && ectx?.entity?.isDisabled === false && ectx?.entity?.isLocked === false && (
            <Button variant="outline" color="dotars" className={classes.button} compact onClick={onClickLock} disabled={disabled}>
              Lock
            </Button>
          )}
          {rx.canLock && ectx?.entity?.isLocked === true && (
            <Button variant="outline" color="dotars" className={classes.button} compact onClick={onClickUnlock} disabled={disabled}>
              Un-lock
            </Button>
          )}

          {ectx?.entity?.isDisabled === false && ectx?.entity?.isLocked === false && (
            <Button variant="outline" color="dotars" className={classes.button} compact onClick={onClickDisable} disabled={disabled}>
              Disable
            </Button>
          )}
          {ectx?.entity?.isDisabled === true && (
            <Button variant="outline" className={classes.button} compact onClick={onClickEnable} disabled={disabled}>
              Enable
            </Button>
          )}
          {ectx?.entity?.isDisabled === false && ectx?.entity?.isLocked === false && (
            <Button color="red" className={classes.button} compact onClick={onClickDelete} disabled={disabled}>
              Delete
            </Button>
          )}
        </>
      )}
    </Group>
  );
};
