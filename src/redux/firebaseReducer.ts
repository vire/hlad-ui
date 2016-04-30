import { fromJS, Map as ImmutableMap } from 'immutable';

export const createdInRecipes = (state, payload) => {
  const { UUID } = payload;
  const stateUUID = state.get('pendingRecipeIDs').find((val, key) => val === UUID);

  if (stateUUID) {
    return state
      .set('pendingTestID', null)
      .set('currentTest', null)
      .set('displayNewForm', false)
      .update('pendingRecipeIDs', updater => updater.filterNot((val, key) => val === stateUUID));
  }

  return state;
};

export const receivedFromTestResults = (state, payload) => {
  const currentTestResult: any = ImmutableMap(payload)
    .toArray()
    .filter((val: any) => state.get('pendingTestID') === val.pendingTestID)[0];

  if (currentTestResult) {
    return state
      .set('pendingTestID', null)
      .setIn(['currentTest', 'result'], currentTestResult.result);
  }

  return state;
};

export const receivedFromRecipes = (state, payload) => {
  const recipes = ImmutableMap(payload).map((val, key) => fromJS(Object.assign({}, val, {ID: key})));
  return state.set('recipes', recipes);
};

export const receivedFromRecipeTester = (state, payload) => state.set('testerActive', payload.active);
