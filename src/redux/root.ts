import { fromJS, Map as ImmutableMap } from 'immutable';

import * as Constants from '../constants';
import { decorateReducer } from './utils';
import { RecipeModel } from '../models/recipe';
import { Effect } from './effects';
import { updateAgentStatus } from './application';
import { RecipesUpdater } from './recipes';

interface State extends ImmutableMap<string, any> {
  agentActive: boolean;
  displayNewForm: boolean;
  effects: Array<Effect>;
  pendingTestResultKey: string;
  recipes: RecipeModel[];
  saving: boolean;
  testing: boolean;
  testResult: any;
}

const initialState: State = fromJS({
  agentActive: false,
  displayNewForm: false,
  effects: [],
  pendingTestResultKey: undefined,
  recipes: [],
  saving: false,
  testing: false,
  testResult: undefined,
});

const reducer = (state = initialState, {type, payload}) => {
  console.log('handling action:' + type, payload);

  switch (type) {
    case Constants.RECEIVED_FROM_AGENT:
      return updateAgentStatus(state, payload);
    case Constants.RECEIVED_FROM_RECIPES:
      return RecipesUpdater.receivedFromRecipes(state, payload);
    case Constants.RECEIVED_FROM_TEST_RESULTS:
      return RecipesUpdater.receivedFromTestResults(state, payload);

    // recipes state modifications by user
    case Constants.CLICKED_SHOW_ADD_RECIPE:
      return RecipesUpdater.clickedShowAdd(state);
    case Constants.CLICKED_SHOW_EDIT_RECIPE:
      return RecipesUpdater.clickedShowEdit(state, payload);

    case Constants.CLICKED_SAVE_RECIPE:
      return RecipesUpdater.clickedSave(state);
    case Constants.RECIPE_SAVED_OK:
      return RecipesUpdater.savedOk(state);

    case Constants.TEST_SAVED_OK:
      return RecipesUpdater.testSavedOk(state, payload);

    case Constants.CLICKED_CANCEL_NEW_RECIPE:
      return RecipesUpdater.clickedCancelNew(state);
    case Constants.CLICKED_CANCEL_RECIPE:
      return RecipesUpdater.clickedCancelUpdate(state, payload);
    default:
      console.warn('Unhandled action', type);
      return state;
  }
};

export default decorateReducer(reducer);
