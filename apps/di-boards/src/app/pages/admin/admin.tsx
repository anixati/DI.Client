import { PageView } from '@dotars/di-controls';
import { Container, Text } from '@mantine/core';
import { Receipt } from 'tabler-icons-react';
import { appStyles } from '../../Styles';

export const AdminPage: React.FC = () => {
  const { classes } = appStyles();
  return (
    <PageView title="Administration" desc="" icon={<Receipt />} >
        <Container p={0} size={600}>
          <Text size="lg" color="dimmed" className={classes.description}>
            Manage Application settings and User Access
          </Text>
        </Container>
    </PageView>
  );
};
