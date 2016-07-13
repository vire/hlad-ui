import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore, compose } from 'redux';
import { combineEpics, createEpicMiddleware } from 'redux-observable';

import Root from './containers/Root';
import rootReducer from './redux/root';
import './styles/app.css';
import { storeEffectEnhancer } from './redux/utils';

const rootEpic = action$ =>
  action$.ofType('PING')
    .delay(1000) // Asynchronously wait 1000ms then continue
    .mapTo({ type: 'PONG' })

const store = createStore(rootReducer, compose(
  applyMiddleware(createEpicMiddleware(rootEpic)),
  storeEffectEnhancer
));

ReactDOM.render(
  <Provider store={store}>
    <Root/>
  </Provider>,
  document.querySelector('#container')
);
