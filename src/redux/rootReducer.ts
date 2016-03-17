import { fromJS, List } from 'immutable';
import { decorateReducer } from './utils';
import { FirebaseStartEffect, UpdateResourceEffect } from './effects';

const initialState = fromJS({
  recipes: [],
  effects: [],
});

const reducer = (state = initialState, {type, payload}) => {
  console.log('handling action:' + type, payload);

  if (type === 'CLICKED_EDIT_RECIPE') {
    return state.updateIn(['recipes', payload], recipe => recipe.set('editing', !recipe.get('editing')));
  }

  if (type === 'ROOT_MOUNTED') {
    return state.update('effects', updater => updater.push(FirebaseStartEffect));
  }

  if (type === 'RECEIVED_RECIPES') {
    return state.set('recipes', fromJS(payload));
  }

  if (type === 'CLICKED_RECIPE_SAVE') {
    const effect = UpdateResourceEffect
      .data('recipes', payload);
    return state.update('effects', updater => updater.push(effect));
  }

  return state;
};

export default decorateReducer(reducer)
