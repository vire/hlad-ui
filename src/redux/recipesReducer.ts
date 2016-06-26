import uuid from 'node-uuid';
import * as Effects from './effects';
import { fromJS, Map as ImmutableMap } from 'immutable';

export const clickedCancel = (state, payload) => {
  return state
    .updateIn(['recipes', payload], recipe => recipe.set('editing', !recipe.get('editing')))
    .set('pendingTestID', null)
    .set('displayNewForm', false)
    .set('currentTest', null);
};

export const clickedUpdate = (state, payload) => {
  const effect = Effects.UpdateResourceEffect
    .data('recipes', payload);
  return state.update('effects', updater => updater.push(effect));
};

export const clickedShowEdit = (state, payload) => {
  return state
    .updateIn(['recipes', payload], recipe => recipe.set('editing', !recipe.get('editing')));
};

export const clickedSave = (state, payload) => {
  const UUID = uuid.v1();
  const effect = Effects.CreateResourceEffect.data('recipes', Object.assign({}, payload, { UUID }));

  return state
    .update('pendingRecipeIDs', updater => updater.push(UUID))
    .update('effects', updater => updater.push(effect));
};

export const clickedTestNew = (state, payload) => {
  const pendingTestID = uuid.v1();

  const effect = Effects.CreateResourceEffect
    .data('test_jobs', Object.assign({}, payload, { pendingTestID }));

  return state
    .set('pendingTestID', pendingTestID)
    .set('currentTest', fromJS(payload))
    .update('effects', updater => updater.push(effect));
};

export const clickedCancelNew = (state) => {
  return state
    .set('pendingTestID', null)
    .set('displayNewForm', false)
    .set('currentTest', null);
};

export const clickedShowAdd = (state) => state.set('displayNewForm', true);

export const receivedFromRecipes = (state, payload) => {
  const recipes = ImmutableMap(payload).map((val, key) => fromJS(Object.assign({}, val, {ID: key})));
  return state.set('recipes', recipes);
};

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

export const publish = (state) => {
  const effect = Effects.CreateResourceEffect
    .data('crawl_jobs', { job: Date.now()});
  return state.update('effects', updater => updater.push(effect));
}
