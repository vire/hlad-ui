import { fromJS, Map as ImmutableMap } from 'immutable';

import * as Constants from '../constants';
import { RecipeModel } from '../models/recipe';
import { updateAgentStatus } from './application';
import { RecipesUpdater } from './recipes';

interface State extends ImmutableMap<string, any> {
  agentActive: boolean;
  displayNewForm: boolean;
  pendingTestResultKey: string;
  recipes: RecipeModel[];
  saving: boolean;
  testing: boolean;
  testResult: any;
}

const initialState: State = fromJS({
  agentActive: false,
  displayNewForm: false,
  pendingTestResultKey: undefined,
  recipes: [],
  saving: false,
  testing: false,
  testResult: undefined,
});

const createReducer = (initialState = {}, reducerMap) => {
  return (previousState = initialState, action) => {
    const next = reducerMap[action.type];
    if (next) {
      if (typeof next !== 'function') {
        throw Error(`Invalid reduction function with typeof "${typeof next}"`);
      }

      // bingo we have a reduction fn let's apply it
      return next(previousState, action);
    }

    console.warn(`Action: ${action.type} not handled in reducer`);

    return previousState;
  };
};

export default createReducer(initialState, {
  [Constants.RECEIVED_FROM_AGENT]: (state, action) => updateAgentStatus(state, action.payload),
  [Constants.RECEIVED_FROM_RECIPES]: (state, action) => RecipesUpdater.receivedFromRecipes(state, action.payload),
  [Constants.RECEIVED_FROM_TEST_RESULTS]: (state, action) => RecipesUpdater.receivedFromTestResults(state, action.payload),
  [Constants.CLICKED_SHOW_ADD_RECIPE]: (state, action) => RecipesUpdater.clickedShowAdd(state),
  [Constants.CLICKED_SHOW_EDIT_RECIPE]: (state, action) => RecipesUpdater.clickedShowEdit(state, action.payload),
  [Constants.CLICKED_SAVE_RECIPE]: (state, action) => RecipesUpdater.clickedSave(state),
  [Constants.RECIPE_SAVED_OK]: (state, action) => RecipesUpdater.savedOk(state),
  [Constants.TEST_SAVED_OK]: (state, action) => RecipesUpdater.testSavedOk(state, action.payload),
  [Constants.CLICKED_CANCEL_NEW_RECIPE]: (state, action) => RecipesUpdater.clickedCancelNew(state),
  [Constants.CLICKED_CANCEL_RECIPE]: (state, action) => RecipesUpdater.clickedCancelUpdate(state, action.payload),
});
