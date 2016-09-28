import { fromJS, Map as ImmutableMap } from 'immutable';

import * as Constants from '../constants';
import { FirebaseService } from '../services/firebase';
import {ActionsObservable} from 'redux-observable';

type PayloadType = any;

// Actions
export const showEditForm = (payload: PayloadType) => ({ type: Constants.CLICKED_SHOW_EDIT_RECIPE, payload });

export const saveRecipe = (payload: PayloadType) => ({ type: Constants.CLICKED_SAVE_RECIPE, payload });

export const updateRecipe = (payload: PayloadType) => ({ type: Constants.CLICKED_UPDATE_RECIPE, payload });

export const cancelEditForm = (payload: PayloadType) => ({ type: Constants.CLICKED_CANCEL_RECIPE, payload });

export const cancelNewForm = () => ({ type: Constants.CLICKED_CANCEL_NEW_RECIPE });

export const showNewRecipeForm = () => ({ type: Constants.CLICKED_SHOW_ADD_RECIPE });

export const requestTesting = (payload: PayloadType) => ({ type: Constants.CLICKED_TEST_RECIPE, payload });

export const publishRecipes = () => ({ type: Constants.CLICKED_PUBLISH });

// Updaters
const clickedCancelNew = (state: ImmutableMap<any, any>) => state
  .set('pendingTestResultKey', undefined)
  .set('testing', false)
  .set('testResult', undefined)
  .set('displayNewForm', false);

const clickedCancelUpdate = (state: ImmutableMap<any, any>, payload: PayloadType) => state
  .set('displayNewForm', false)
  .set('pendingTestResultKey', undefined)
  .set('testing', false)
  .set('testResult', undefined)
  .updateIn(['recipes', payload], recipe => recipe.set('editing', !recipe.get('editing')));

const clickedShowEdit = (state: ImmutableMap<any, any>, payload: PayloadType) => state
  .updateIn(['recipes', payload], recipe => recipe.set('editing', !recipe.get('editing')));

const clickedShowAdd = (state: ImmutableMap<any, any>) => state.set('displayNewForm', true);

const clickedSave = (state: ImmutableMap<any, any>) => state.set('saving', true);

const savedOk = (state: ImmutableMap<any, any>) => state
  .set('displayNewForm', false)
  .set('saving', false);

// TODO const saveFailed = state=> state;

const testSavedOk = (state: ImmutableMap<any, any>, firebaseKey: string) => state
  .set('pendingTestResultKey', firebaseKey)
  .set('testing', true);

const receivedFromRecipes = (state: ImmutableMap<any, any>, payload: PayloadType) => {
  const recipes = ImmutableMap(payload)
    .map((val, key) => fromJS(Object.assign({}, val, {ID: key})));

  return state.set('recipes', recipes);
};

const receivedFromTestResults = (state: ImmutableMap<any, any>, payload: PayloadType) => {
  const pendingTestResultKey = state.get('pendingTestResultKey');
  const currentTestResult: any = ImmutableMap(payload)
    .toArray()
    .find((val: any) => pendingTestResultKey && pendingTestResultKey === val.pendingTestResultKey);

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
export const updateRecipeEpic = (action$: ActionsObservable<any>) => action$
  .ofType(Constants.CLICKED_UPDATE_RECIPE)
  .flatMap(({ payload }) => FirebaseService.update('recipes', payload));

export const publishAllEpic = (action$: ActionsObservable<any>) => action$
  .ofType(Constants.CLICKED_PUBLISH)
  .flatMap(() => FirebaseService.create('crawl_jobs', { job: Date.now()}));

export const createRecipeEpic = (action$: ActionsObservable<any>) => action$
  .ofType(Constants.CLICKED_SAVE_RECIPE).delay(5000)
  .flatMap(({ payload }) => FirebaseService.create('recipes', payload))
  .mapTo({ type: Constants.RECIPE_SAVED_OK });
  // .catch({ type: Constants.RECIPE_SAVE_FAILED});

export const createTestEpic = (action$: ActionsObservable<any>) => action$
  .ofType(Constants.CLICKED_TEST_RECIPE)
  .flatMap(({ payload }) => FirebaseService.create('test_jobs', payload))
  .map(action => ({ type: Constants.TEST_SAVED_OK, payload: action.payload.firebaseKey }));
  // means the test started and some timeout has to be scheduled
  // .catch({ type: Constants.TEST_SAVE_FAILED});
  // TODO - add here some .mergeToTimeoutSource

// Reducer
const reducer = () => {}; // now just noop

export default reducer;
