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
    .data('tests', Object.assign({}, payload, { pendingTestID }));

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
