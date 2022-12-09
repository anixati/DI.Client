import { Button, Container, Text, Title, useMantineTheme } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { appStyles } from './Styles';


export const LandingPage: React.FC = () => {
  const { classes } = appStyles();
  const theme = useMantineTheme();
  const navigate = useNavigate();
  return (
    <Container className={classes.wrapper} size={1400}>
      <div className={classes.inner}>
        <Title className={classes.title}>
          <Text component="span" color={theme.primaryColor} inherit>
            Boards
          </Text>{' '}
          Application
        </Title>

        <Container p={0} size={600}>
          <Text size="lg" color="dimmed" className={classes.description}>
           ..
          </Text>
        </Container>

        <div className={classes.controls}>
          <Button className={classes.control} size="lg" variant="default" color="gray" onClick={()=>{navigate('boards')}}>
            Start
          </Button>
        </div>
      </div>
    </Container>
  );
};
