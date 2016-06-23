import { fromJS, Map as ImmutableMap } from 'immutable';
import { decorateReducer } from './utils';
import { RecipeModel } from '../models/recipe';
import { Effect } from './effects';
import * as FirebaseReducer from './firebaseReducer';
import * as RecipesReducer from './recipesReducer';
import { rootMounted } from './appReducer';

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

export const RECEIVED_FROM_AGENT = 'RECEIVED_FROM_AGENT';

export const RECEIVED_FROM_RECIPES = 'RECEIVED_FROM_RECIPES';
export const CREATED_IN_RECIPES = 'CREATED_IN_RECIPES';
export const CREATE_FAILED_IN_RECIPES = 'CREATE_FAILED_IN_RECIPES';
export const UPDATED_IN_RECIPES = 'UPDATED_IN_RECIPES';
export const UPDATE_FAILED_IN_RECIPES = 'UPDATE_FAILED_IN_RECIPES';

export const CLICKED_PUBLISH = 'CLICKED_PUBLISH';

// actions
export const showEditForm = payload => ({ type: CLICKED_SHOW_EDIT_RECIPE, payload });
export const saveRecipe = payload => ({ type: CLICKED_SAVE_RECIPE, payload });
export const updateRecipe = payload => ({ type: CLICKED_UPDATE_RECIPE, payload });
export const cancelEditForm = payload => ({ type: CLICKED_CANCEL_RECIPE, payload });
export const cancelNewForm = () => ({ type: CLICKED_CANCEL_NEW_RECIPE });
export const showNewRecipeForm = () => ({ type: CLICKED_SHOW_ADD_RECIPE });
export const testNewRecipe = payload => ({ type: CLICKED_TEST_NEW_RECIPE, payload });
export const publish = () => ({ type: CLICKED_PUBLISH });

const reducer = (state = initialState, {type, payload}) => {
  console.log('handling action:' + type, payload);

  switch (type) {
    case ROOT_MOUNTED:
      return rootMounted(state);
    case CREATED_IN_RECIPES:
      return FirebaseReducer.createdInRecipes(state, payload);
    case RECEIVED_FROM_RECIPES:
      return FirebaseReducer.receivedFromRecipes(state, payload);
    case RECEIVED_FROM_AGENT:
      return FirebaseReducer.receivedFromAgent(state, payload);
    case RECEIVED_FROM_TEST_RESULTS:
      return FirebaseReducer.receivedFromTestResults(state, payload);

    case CLICKED_SHOW_ADD_RECIPE:
      return RecipesReducer.clickedShowAdd(state);
    case CLICKED_TEST_NEW_RECIPE:
      return RecipesReducer.clickedTestNew(state, payload);
    case CLICKED_CANCEL_NEW_RECIPE:
      return RecipesReducer.clickedCancelNew(state);
    case CLICKED_SAVE_RECIPE:
      return RecipesReducer.clickedSave(state, payload);

    case CLICKED_SHOW_EDIT_RECIPE:
      return RecipesReducer.clickedShowEdit(state, payload);
    case CLICKED_UPDATE_RECIPE:
      return RecipesReducer.clickedUpdate(state, payload);
    case CLICKED_CANCEL_RECIPE:
      return RecipesReducer.clickedCancel(state, payload);
    default:
      console.warn('Unhandled action', type);
      return state;
  }
};

export default decorateReducer(reducer);
