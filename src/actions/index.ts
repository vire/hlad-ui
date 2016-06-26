import * as Constants from '../constants';

export const showEditForm = payload => ({ type: Constants.CLICKED_SHOW_EDIT_RECIPE, payload });

export const saveRecipe = payload => ({ type: Constants.CLICKED_SAVE_RECIPE, payload });

export const updateRecipe = payload => ({ type: Constants.CLICKED_UPDATE_RECIPE, payload });

export const cancelEditForm = payload => ({ type: Constants.CLICKED_CANCEL_RECIPE, payload });

export const cancelNewForm = () => ({ type: Constants.CLICKED_CANCEL_NEW_RECIPE });

export const showNewRecipeForm = () => ({ type: Constants.CLICKED_SHOW_ADD_RECIPE });

export const testNewRecipe = payload => ({ type: Constants.CLICKED_TEST_NEW_RECIPE, payload });

export const publish = () => ({ type: Constants.CLICKED_PUBLISH });
