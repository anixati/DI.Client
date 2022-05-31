import { useNavigate } from 'react-router-dom';
import { Button } from '@mantine/core';
import { CenterPanel } from '@dotars/di-controls';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <CenterPanel title="Page not found!" desc="Page you are looking not found!" >
      <Button
        fullWidth
        style={{ marginTop: 14 }}
        variant="gradient"
        gradient={{ from: 'indigo', to: 'cyan' }}
        onClick={() => navigate('/')}
      >
        Back to Home
      </Button>
    </CenterPanel>
  );
};
