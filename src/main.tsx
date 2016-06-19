import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { Provider } from 'react-redux';
import Root from './containers/Root';
import { createStore } from 'redux';
import rootReducer from './redux/rootReducer';
import './styles/app.css';
import { storeEffectEnhancer } from './redux/utils';

const store = createStore(rootReducer, storeEffectEnhancer);

ReactDOM.render(
  <Provider store={store}>
    <Root />
  </Provider>,
  document.querySelector('#container')
);
