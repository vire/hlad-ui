import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { Provider } from 'react-redux';
import Root from './containers/Root';
import { applyMiddleware, compose, createStore } from 'redux';
import rootReducer from './redux/rootReducer';
import './styles/app.css';
import { storeEffectEnhancer } from './redux/utils';

const middleware = ({getState, dispatch}) => (next) => (action) => {
  return next(action);
};

const createStoreWithMiddleware = compose(
  applyMiddleware(middleware),
  storeEffectEnhancer
);

const store = createStoreWithMiddleware(createStore)(rootReducer);

ReactDOM.render(
  <Provider store={store}>
    <Root />
  </Provider>,
  document.querySelector('#container')
);
