import { BrowserRouter } from 'react-router-dom';
import { AuthRouter } from './routes/AuthRouter';
export const AppMain: React.FC = (rx) => {
  return (
    <BrowserRouter>
      <AuthRouter>{rx.children}</AuthRouter>
    </BrowserRouter>
  );
};
