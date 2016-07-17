import { fromJS, Map as ImmutableMap } from 'immutable';

import * as Constants from '../constants';
import {FirebaseService} from '../services/firebase';

// Actions
export const showEditForm = payload => ({ type: Constants.CLICKED_SHOW_EDIT_RECIPE, payload });

export const saveRecipe = payload => ({ type: Constants.CLICKED_SAVE_RECIPE, payload });

export const updateRecipe = payload => ({ type: Constants.CLICKED_UPDATE_RECIPE, payload });

export const cancelEditForm = payload => ({ type: Constants.CLICKED_CANCEL_RECIPE, payload });

export const cancelNewForm = () => ({ type: Constants.CLICKED_CANCEL_NEW_RECIPE });

export const showNewRecipeForm = () => ({ type: Constants.CLICKED_SHOW_ADD_RECIPE });

export const requestTesting = payload => ({ type: Constants.CLICKED_TEST_RECIPE, payload });

export const publishRecipes = () => ({ type: Constants.CLICKED_PUBLISH });

// Updaters
const clickedCancelNew = (state) => state
  .set('pendingTestResultKey', undefined)
  .set('testing', false)
  .set('testResult', undefined)
  .set('displayNewForm', false);

const clickedCancelUpdate = (state, payload) => state
  .set('displayNewForm', false)
  .set('pendingTestResultKey', undefined)
  .set('testing', false)
  .set('testResult', undefined)
  .updateIn(['recipes', payload], recipe => recipe.set('editing', !recipe.get('editing')));

const clickedShowEdit = (state, payload) => state
  .updateIn(['recipes', payload], recipe => recipe.set('editing', !recipe.get('editing')));

const clickedShowAdd = (state) => state.set('displayNewForm', true);

const clickedSave = state => state.set('saving', true);

const savedOk = state => state
  .set('displayNewForm', false)
  .set('saving', false);

// TODO const saveFailed = state=> state;

const testSavedOk = (state, firebaseKey) => state
  .set('pendingTestResultKey', firebaseKey)
  .set('testing', true);

const receivedFromRecipes = (state, payload) => {
  const recipes = ImmutableMap(payload)
    .map((val, key) => fromJS(Object.assign({}, val, {ID: key})));

  return state.set('recipes', recipes);
};

const receivedFromTestResults = (state, payload) => {
  const currentTestResult: any = ImmutableMap(payload)
    .toArray()
    .find((val: any) => state.get('pendingTestResultKey') === val.pendingTestID);

  if (currentTestResult) {
    const result = currentTestResult.result ? currentTestResult.result : 'Noting matching found';
    return state
      .set('pendingTestResultKey', undefined)
      .set('testing', false)
      .set('testResult', result);
  }

  return state;
};

export const RecipesUpdater = {
  clickedCancelUpdate,
  clickedCancelNew,
  clickedShowAdd,
  clickedShowEdit,
  clickedSave,
  receivedFromTestResults,
  receivedFromRecipes,
  savedOk,
  testSavedOk,
};

// Epics
export const updateRecipeEpic = action$ => action$
  .ofType(Constants.CLICKED_UPDATE_RECIPE)
  .flatMap(({ payload }) => FirebaseService.update('recipes', payload));

export const publishAllEpic = action$ => action$
  .ofType(Constants.CLICKED_PUBLISH)
  .flatMap(({ payload }) => FirebaseService.create('crawl_jobs', { job: Date.now()}));

export const createRecipeEpic = action$ => action$
  .ofType(Constants.CLICKED_SAVE_RECIPE).delay(5000)
  .flatMap(({ payload }) => FirebaseService.create('recipes', payload))
  .mapTo({ type: Constants.RECIPE_SAVED_OK })
  .catch({ type: Constants.RECIPE_SAVE_FAILED});

export const createTestEpic = action$ => action$
  .ofType(Constants.CLICKED_TEST_RECIPE)
  .flatMap(({ payload }) => FirebaseService.create('test_jobs', payload))
  .map(action => ({ type: Constants.TEST_SAVED_OK, payload: action.payload.firebaseKey })) // means the test started and some timeout has to be scheduled
  .catch({ type: Constants.TEST_SAVE_FAILED});
  // TODO - add here some .mergeToTimeoutSource

// Reducer
const reducer = () => {}; // now just noop

export default reducer;
