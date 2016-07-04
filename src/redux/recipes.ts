import uuid from 'node-uuid';
import * as Effects from './effects';
import { fromJS, Map as ImmutableMap } from 'immutable';

import * as Constants from '../constants';

// Actions
export const showEditForm = payload => ({ type: Constants.CLICKED_SHOW_EDIT_RECIPE, payload });

export const saveRecipe = payload => ({ type: Constants.CLICKED_SAVE_RECIPE, payload });

export const updateRecipe = payload => ({ type: Constants.CLICKED_UPDATE_RECIPE, payload });

export const cancelEditForm = payload => ({ type: Constants.CLICKED_CANCEL_RECIPE, payload });

export const cancelNewForm = () => ({ type: Constants.CLICKED_CANCEL_NEW_RECIPE });

export const showNewRecipeForm = () => ({ type: Constants.CLICKED_SHOW_ADD_RECIPE });

export const testNewRecipe = payload => ({ type: Constants.CLICKED_TEST_NEW_RECIPE, payload });

export const publishRecipes = () => ({ type: Constants.CLICKED_PUBLISH });

// Updaters
const clickedCancel = (state, payload) => {
  return state
    .updateIn(['recipes', payload], recipe => recipe.set('editing', !recipe.get('editing')))
    .set('pendingTestID', null)
    .set('displayNewForm', false)
    .set('currentTest', null);
};

const addUpdateEffect = (state, payload) => {
  const effect = Effects.UpdateResourceEffect
    .data('recipes', payload);
  return state.update('effects', updater => updater.push(effect));
};

const clickedShowEdit = (state, payload) => {
  return state
    .updateIn(['recipes', payload], recipe => recipe.set('editing', !recipe.get('editing')));
};

const clickedSave = (state, payload) => {
  const UUID = uuid.v1();
  const effect = Effects.CreateResourceEffect.data('recipes', Object.assign({}, payload, { UUID }));

  return state
    .update('pendingRecipeIDs', updater => updater.push(UUID))
    .update('effects', updater => updater.push(effect));
};

const addTestNewEffect = (state, payload) => {
  const pendingTestID = uuid.v1();

  const effect = Effects.CreateResourceEffect
    .data('test_jobs', Object.assign({}, payload, { pendingTestID }));

  return state
    .set('pendingTestID', pendingTestID)
    .set('currentTest', fromJS(payload))
    .update('effects', updater => updater.push(effect));
};

const clickedCancelNew = (state) => {
  return state
    .set('pendingTestID', null)
    .set('displayNewForm', false)
    .set('currentTest', null);
};

const clickedShowAdd = (state) => state.set('displayNewForm', true);

const receivedFromRecipes = (state, payload) => {
  const recipes = ImmutableMap(payload)
    .map((val, key) => fromJS(Object.assign({}, val, {ID: key})));

  return state.set('recipes', recipes);
};

const createdInRecipes = (state, payload) => {
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

const receivedFromTestResults = (state, payload) => {
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

const addPublishEffect = (state) => {
  const effect = Effects.CreateResourceEffect
    .data('crawl_jobs', { job: Date.now()});

  return state.update('effects', updater => updater.push(effect));
};

export const RecipesUpdater = {
  clickedCancel,
  clickedCancelNew,
  clickedShowAdd,
  clickedShowEdit,
  clickedSave,
  addTestNewEffect,
  createdInRecipes,
  addUpdateEffect,
  addPublishEffect,
  receivedFromTestResults,
  receivedFromRecipes,
};

// Reducer

const reducer = () => {}; // now just noop

export default reducer;
