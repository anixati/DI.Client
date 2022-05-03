import { StrictMode } from 'react';
import { Provider} from 'jotai'
import * as ReactDOM from 'react-dom';
import App from './app';
import 'regenerator-runtime/runtime';

ReactDOM.render(
  //<StrictMode>
    <Provider> <App /></Provider>
  //</StrictMode>
  ,
  document.getElementById('root')
);
