import { fromJS, Map as ImmutableMap } from 'immutable';

import * as Constants from '../constants';
import { decorateReducer } from './utils';
import { RecipeModel } from '../models/recipe';
import { Effect } from './effects';
import { rootMounted, receivedFromAgent } from './application';
import { RecipesUpdater } from './recipes';

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
      return RecipesUpdater.createdInRecipes(state, payload);
    case Constants.RECEIVED_FROM_RECIPES:
      return RecipesUpdater.receivedFromRecipes(state, payload);
    case Constants.RECEIVED_FROM_TEST_RESULTS:
      return RecipesUpdater.receivedFromTestResults(state, payload);
    // recipes state modifications by user
    case Constants.CLICKED_SHOW_ADD_RECIPE:
      return RecipesUpdater.clickedShowAdd(state);
    case Constants.CLICKED_TEST_NEW_RECIPE:
      return RecipesUpdater.addTestNewEffect(state, payload);
    case Constants.CLICKED_CANCEL_NEW_RECIPE:
      return RecipesUpdater.clickedCancelNew(state);
    case Constants.CLICKED_SAVE_RECIPE:
      return RecipesUpdater.clickedSave(state, payload);
    case Constants.CLICKED_SHOW_EDIT_RECIPE:
      return RecipesUpdater.clickedShowEdit(state, payload);
    case Constants.CLICKED_UPDATE_RECIPE:
      return RecipesUpdater.addUpdateEffect(state, payload);
    case Constants.CLICKED_CANCEL_RECIPE:
      return RecipesUpdater.clickedCancel(state, payload);
    case Constants.CLICKED_PUBLISH:
      return RecipesUpdater.addPublishEffect(state);
    default:
      console.warn('Unhandled action', type);
      return state;
  }
};

export default decorateReducer(reducer);