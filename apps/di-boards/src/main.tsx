import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';
import App from './app';
import 'regenerator-runtime/runtime';

ReactDOM.render(
  //<StrictMode>
  <App />,
  //</StrictMode>
  document.getElementById('root')
);
