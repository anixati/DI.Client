import { IApiResponse } from '@dotars/di-core';
import { ThemeIcon } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { AlertCircle, AlertOctagon, CircleCheck } from 'tabler-icons-react';

export const ShowNotify = (action: number, data: IApiResponse) => {
  let title = '';
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
      break;
    }
  }
  ShowInfo(`${title}`, `${data?.result?.message}`);
};

export const ShowError = (title: string, message: string) => {
  showNotification({
    autoClose: 5000,
    title,
    message,
    styles: (theme) => ({
      root: {
        backgroundColor: theme.colors.red[1],
        borderColor: theme.colors.red[5],
      },
      closeButton: {
        color: theme.colors.red[5],
        '&:hover': { backgroundColor: theme.white },
      },
      title: { color:  theme.colors.red[5]},
      description: { color:  theme.colors.red[5] },
    }),
    color: 'red',
    // style: { backgroundColor: 'red' },
    // sx: { backgroundColor: 'red' },
    icon: <AlertOctagon />,
  });
};
export const ShowInfo = (title: string, message: string) => {
  showNotification({
    autoClose: 5000,
    title,
    message,
    styles: (theme) => ({
      root: {
        backgroundColor: theme.colors.yellow[1],
        borderColor: theme.black,
        '&::before': { backgroundColor: theme.white },
      },
      closeButton: {
        color: theme.black,
        '&:hover': { backgroundColor: theme.colors.yellow[4] },
      },
      title: { color: theme.black },
      description: { color: theme.black },
    }),

    icon: <CircleCheck />,
  });
};


export const ShowWarn = (title: string, message: string) => {
  showNotification({
    autoClose: 2000,
    title,
    message,
    styles: (theme) => ({
      root: {
        backgroundColor: theme.white,
        borderColor: theme.colors.violet[7],
      },
      closeButton: {
        color: theme.colors.violet[7],
        '&:hover': { backgroundColor: theme.white },
      },
      title: { color:  theme.colors.violet[7]},
      description: { color:  theme.colors.violet[7] },
    }),
    icon: <AlertCircle />,
  });
};
