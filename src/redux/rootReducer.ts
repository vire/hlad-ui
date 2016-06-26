import { fromJS, Map as ImmutableMap } from 'immutable';

import * as Constants from '../constants';
import { decorateReducer } from './utils';
import { RecipeModel } from '../models/recipe';
import { Effect } from './effects';
import { rootMounted, receivedFromAgent } from './appReducer';
import * as RecipesReducer from './recipesReducer';

interface State extends ImmutableMap<string, any> {
  pendingRecipeIDs: Array<string>;
  displayNewForm: boolean;
  pendingTestID: string;
  currentTest: any;
  recipes: Array<RecipeModel>;
  effects: Array<Effect>;
  testerActive: boolean;
}

const initialState: State = fromJS({
  pendingRecipeIDs: [],
  displayNewForm: false,
  pendingTestID: undefined,
  currentTest: undefined,
  recipes: [],
  effects: [],
  agentActive: false,
});

const reducer = (state = initialState, {type, payload}) => {
  console.log('handling action:' + type, payload);

  switch (type) {
    case Constants.ROOT_MOUNTED:
      return rootMounted(state);
    case Constants.RECEIVED_FROM_AGENT:
      return receivedFromAgent(state, payload);
    // recipes related stuff
    case Constants.CREATED_IN_RECIPES:
      return RecipesReducer.createdInRecipes(state, payload);
    case Constants.RECEIVED_FROM_RECIPES:
      return RecipesReducer.receivedFromRecipes(state, payload);
    case Constants.RECEIVED_FROM_TEST_RESULTS:
      return RecipesReducer.receivedFromTestResults(state, payload);
    // recipes state modifications by user
    case Constants.CLICKED_SHOW_ADD_RECIPE:
      return RecipesReducer.clickedShowAdd(state);
    case Constants.CLICKED_TEST_NEW_RECIPE:
      return RecipesReducer.clickedTestNew(state, payload);
    case Constants.CLICKED_CANCEL_NEW_RECIPE:
      return RecipesReducer.clickedCancelNew(state);
    case Constants.CLICKED_SAVE_RECIPE:
      return RecipesReducer.clickedSave(state, payload);
    case Constants.CLICKED_SHOW_EDIT_RECIPE:
      return RecipesReducer.clickedShowEdit(state, payload);
    case Constants.CLICKED_UPDATE_RECIPE:
      return RecipesReducer.clickedUpdate(state, payload);
    case Constants.CLICKED_CANCEL_RECIPE:
      return RecipesReducer.clickedCancel(state, payload);
    case Constants.CLICKED_PUBLISH:
      return RecipesReducer.publish(state);
    default:
      console.warn('Unhandled action', type);
      return state;
  }
};

export default decorateReducer(reducer);
