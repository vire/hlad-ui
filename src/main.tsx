import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore, compose } from 'redux';
import { createEpicMiddleware } from 'redux-observable';

import Root from './containers/Root';
import rootReducer from './redux/root';
import './styles/app.css';
import { storeEffectEnhancer } from './redux/utils';
import { applicationEpic } from './redux/application';

const store = createStore(rootReducer, compose(
  applyMiddleware(createEpicMiddleware(applicationEpic)),
  storeEffectEnhancer
));

ReactDOM.render(
  <Provider store={store}>
    <Root/>
  </Provider>,
  document.querySelector('#container')
);
