import { fromJS, List } from 'immutable';
import { decorateReducer } from './utils';
import { FirebaseStartEffect } from './effects';

const initialState = fromJS({
  recipes: [],
});

const reducer = (state = initialState, {type, payload}) => {
  console.log('handling action:' + type, payload);
  if (type === 'CLICKED_EDIT_RECIPE') {
    return state.updateIn(['recipes', payload], recipe => recipe.set('editing', !recipe.get('editing')));
  }

  if (type === 'ROOT_MOUNTED') {
    const effect = {
      execute() {
        console.log('I am a simple side effect!');
      }
    };

    return state.set('effects', List.of(FirebaseStartEffect));
  }

  if (type === 'RECEIVED_RECIPES') {
    return state.set('recipes', fromJS(payload));
  }

  return state;
};



export default decorateReducer(reducer)
