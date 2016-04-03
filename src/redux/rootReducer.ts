import { fromJS, Map as ImmutableMap } from 'immutable';
import { decorateReducer } from './utils';
import * as Effects from './effects';
import uuid from 'node-uuid';

const initialState = fromJS({
  pendingRecipeIDs: [],
  displayNewForm: false,
  pendingTestID: null,
  currentTest: null,
  recipes: [],
  effects: [],
  testerActive: false,
});

// constants
export const ROOT_MOUNTED = 'ROOT_MOUNTED';
export const CLICKED_SHOW_EDIT_RECIPE = 'CLICKED_SHOW_EDIT_RECIPE';
export const CLICKED_SAVE_RECIPE = 'CLICKED_SAVE_RECIPE';
export const CLICKED_UPDATE_RECIPE = 'CLICKED_UPDATE_RECIPE';
export const CLICKED_CANCEL_RECIPE = 'CLICKED_CANCEL_RECIPE';
export const CLICKED_CANCEL_NEW_RECIPE = 'CLICKED_CANCEL_NEW_RECIPE';
export const CLICKED_SHOW_ADD_RECIPE = 'CLICKED_SHOW_ADD_RECIPE';
export const CLICKED_TEST_NEW_RECIPE = 'CLICKED_TEST_NEW_RECIPE';

// firebase triggered
export const RECEIVED_FROM_TESTS = 'RECEIVED_FROM_TESTS';
export const CREATED_IN_TESTS = 'CREATED_IN_TESTS';
export const CREATE_FAILED_IN_TESTS = 'CREATE_FAILED_IN_TESTS';
export const UPDATED_IN_TESTS = 'UPDATED_IN_TESTS';
export const UPDATE_FAILED_IN_TESTS = 'UPDATE_FAILED_IN_TESTS';

export const RECEIVED_FROM_TEST_RESULTS = 'RECEIVED_FROM_TEST_RESULTS';

export const RECEIVED_FROM_RECIPE_TESTER = 'RECEIVED_FROM_RECIPE_TESTER';

export const RECEIVED_FROM_RECIPES = 'RECEIVED_FROM_RECIPES';
export const CREATED_IN_RECIPES = 'CREATED_IN_RECIPES';
export const CREATE_FAILED_IN_RECIPES = 'CREATE_FAILED_IN_RECIPES';
export const UPDATED_IN_RECIPES = 'UPDATED_IN_RECIPES';
export const UPDATE_FAILED_IN_RECIPES = 'UPDATE_FAILED_IN_RECIPES';

// actions
export const showEditForm = payload => ({ type: CLICKED_SHOW_EDIT_RECIPE, payload });
export const saveRecipe = payload => ({ type: CLICKED_SAVE_RECIPE, payload });
export const updateRecipe = payload => ({ type: CLICKED_UPDATE_RECIPE, payload });
export const cancelEditForm = payload => ({ type: CLICKED_CANCEL_RECIPE, payload });
export const cancelNewForm = () => ({ type: CLICKED_CANCEL_NEW_RECIPE });
export const showNewRecipeForm = () => ({ type: CLICKED_SHOW_ADD_RECIPE });
export const testNewRecipe = payload => ({ type: CLICKED_TEST_NEW_RECIPE, payload });

const reducer = (state = initialState, {type, payload}) => {
  console.log('handling action:' + type, payload);

  if (type === CLICKED_SHOW_EDIT_RECIPE) {
    return state.updateIn(['recipes', payload], recipe => recipe.set('editing', !recipe.get('editing')));
  }

  if (type === ROOT_MOUNTED) {
    return state.update('effects', updater => updater.push(Effects.FirebaseStartEffect));
  }

  if (type === RECEIVED_FROM_RECIPES) {
    const recipes = ImmutableMap(payload).map((val, key) => {
      return fromJS(Object.assign({}, val, {ID: key}));
    });
    return state.set('recipes', recipes);
  }

  if (type === CLICKED_SAVE_RECIPE) {
    const UUID = uuid.v1();
    const effect = Effects.CreateResourceEffect.data('recipes', Object.assign({}, payload, { UUID }));

    return state
      .update('pendingRecipeIDs', updater => updater.push(UUID))
      .update('effects', updater => updater.push(effect));
  }

  if (type === CLICKED_UPDATE_RECIPE) {
    const effect = Effects.UpdateResourceEffect
      .data('recipes', payload);
    return state.update('effects', updater => updater.push(effect));
  }

  if (type === CLICKED_CANCEL_RECIPE) {
    return state
      .updateIn(['recipes', payload], recipe => recipe.set('editing', !recipe.get('editing')))
      .set('pendingTestID', null)
      .set('displayNewForm', false)
      .set('currentTest', null);
  }

  if (type === CLICKED_SHOW_ADD_RECIPE) {
    return state
      .set('displayNewForm', true);
  }

  if (type === CLICKED_CANCEL_NEW_RECIPE) {
    return state
      .set('pendingTestID', null)
      .set('displayNewForm', false)
      .set('currentTest', null);
  }

  if (type === CREATED_IN_RECIPES) {
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
  }

  if (type === CLICKED_TEST_NEW_RECIPE) {
    const pendingTestID = uuid.v1();

    const effect = Effects.CreateResourceEffect
      .data('tests', Object.assign({}, payload, { pendingTestID }));

    return state
      .set('pendingTestID', pendingTestID)
      .set('currentTest', fromJS(payload))
      .update('effects', updater => updater.push(effect));
  }

  if (type === RECEIVED_FROM_TEST_RESULTS) {
    const currentTestResult: any = ImmutableMap(payload)
      .toArray()
      .filter((val: any) => state.get('pendingTestID') === val.pendingTestID)[0];

    if (currentTestResult) {
      return state
        .set('pendingTestID', null)
        .setIn(['currentTest', 'result'], currentTestResult.result);
    }

    return state;
  }

  if (type === RECEIVED_FROM_RECIPE_TESTER) {

    return state
      .set('testerActive', payload.active);
  }

  console.warn('Unhandled action', type);

  return state;
};

export default decorateReducer(reducer)
