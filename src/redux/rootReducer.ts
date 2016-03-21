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
export const RESOURCE_CREATED = 'RESOURCE_CREATED'; // DEPRECATED
export const TESTS_ADDED = 'TESTS_ADDED';
export const RECIPES_ADDED = 'RECIPES_ADDED';
export const RECEIVED_RECIPES = 'RECEIVED_RECIPES';
export const RECEIVED_TESTS = 'RECEIVED_TESTS';

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

  if (type === RECEIVED_RECIPES) {
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
    return state.updateIn(['recipes', payload], recipe => recipe.set('editing', !recipe.get('editing')));
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

  if (type === RECIPES_ADDED) {
    const { UUID } = payload;
    const stateUUID = state.get('pendingRecipeIDs').find((val, key) => val === UUID);

    if (stateUUID) {
      //
      state
        .set('pendingTestID', null)
        .set('displayNewForm', false)
        .set('currentTest', null)
        .set('displayNewForm', false)
        .update('pendingRecipeIDs', updater => updater.filterNot((val, key) => val === stateUUID));
    }
    return state;
  }

  if (type === CLICKED_TEST_NEW_RECIPE) {
    const pendingTestID = state.set('pendingTestID', uuid.v1()).get('pendingTestID');

    const effect = Effects.CreateResourceEffect
      .data('tests', Object.assign({}, payload, { pendingTestID }));

    return state
      .set('currentTest', fromJS(payload))
      .update('effects', updater => updater.push(effect));
  }

  if (type === RECEIVED_TESTS) {
    const currentTest = ImmutableMap(payload)
      .filter((val, key) => val['pendingTestID'] === state.get('pendingTestID')).first();

    if (currentTest) {
      // set test result to the current test
      return state
        .get('pendingTestID', null)
        .set('currentTest', currentTest);
    }
    return state;
  }

  return state;
};

export default decorateReducer(reducer)
