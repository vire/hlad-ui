import { fromJS, List, Map as ImmutableMap } from 'immutable';

const ACTION_EXECUTED = 'ACTION_EXECUTED';
const sideEffects = [];

export const decorateReducer = (reducer) => (state, action) => {
  const result = reducer(state, action);

  if (ImmutableMap.isMap(result)) {
    const effects = result.get('effects');

    if (List.isList(effects) && effects.size > 0) {
      effects.forEach(effect => {
        if (!action[ACTION_EXECUTED]) {
          sideEffects.push(effect);
        }
      });

      Object.defineProperty(action, ACTION_EXECUTED, { value: true });
      return result.set('effects', List());
    }
  }

  return result;
};

const effectsHandler = (effect, store) => {
  if (typeof effect.execute !== 'function') {
    throw new Error('Unhandled effect ${effect}');
  }
  effect.execute(store);
};

export const storeEffectEnhancer = (next) => (reducer, initialState) => {
  const store = next(reducer, initialState);
  store.subscribe(() => {
    const { dispatch, getState } = store;
    while (sideEffects.length > 0) {
      const effect = sideEffects.shift();
      console.log('handling effect', effect);
      effectsHandler(effect, { dispatch, getState });
    }
  });
  return store;
};
