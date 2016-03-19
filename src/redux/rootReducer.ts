import { fromJS, Map as ImmutableMap } from 'immutable';
import { decorateReducer } from './utils';
import * as Effects from './effects';

const initialState = fromJS({
  pendingSaveID: null,
  displayNewForm: false,
  recipes: [],
  effects: [],
});

// constants
export const ROOT_MOUNTED = 'ROOT_MOUNTED';
export const RECEIVED_RECIPES = 'RECEIVED_RECIPES';
export const CLICKED_SHOW_EDIT_RECIPE = 'CLICKED_SHOW_EDIT_RECIPE';
export const CLICKED_SAVE_RECIPE = 'CLICKED_SAVE_RECIPE';
export const CLICKED_UPDATE_RECIPE = 'CLICKED_UPDATE_RECIPE';
export const CLICKED_CANCEL_RECIPE = 'CLICKED_CANCEL_RECIPE';
export const CLICKED_CANCEL_NEW_RECIPE = 'CLICKED_CANCEL_NEW_RECIPE';
export const CLICKED_SHOW_ADD_RECIPE = 'CLICKED_SHOW_ADD_RECIPE';
export const RESOURCE_CREATED = 'RESOURCE_CREATED';

// actions
export const showEditForm = payload => ({ type: CLICKED_SHOW_EDIT_RECIPE, payload });

export const saveRecipe = payload => ({ type: CLICKED_SAVE_RECIPE, payload });

export const updateRecipe = payload => ({ type: CLICKED_UPDATE_RECIPE, payload });

export const cancelEditForm = payload => ({ type: CLICKED_CANCEL_RECIPE, payload });

export const cancelNewForm = () => ({ type: CLICKED_CANCEL_NEW_RECIPE });

export const showNewRecipeForm = () => ({ type: CLICKED_SHOW_ADD_RECIPE });

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
    const pendingSaveID = Date.now();
    const effect = Effects.CreateResourceEffect
      .data('recipes', Object.assign({}, payload, { pendingSaveID }));
    return state
      .set('pendingSaveID', pendingSaveID)
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
    return state.set('displayNewForm', true);
  }

  if (type === CLICKED_CANCEL_NEW_RECIPE) {
    return state.set('displayNewForm', false);
  }

  if (type === RESOURCE_CREATED) {
    const currentPendingSaveID = state.get('pendingSaveID');

    return state
      .update('pendingSaveID', updater => payload.pendingSaveID === currentPendingSaveID ? null : currentPendingSaveID)
      .set('displayNewForm', false);
  }

  return state;
};

export default decorateReducer(reducer)
