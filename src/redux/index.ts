import { combineEpics } from 'redux-observable';

import { createRecipeEpic, updateRecipeEpic, publishAllEpic, createTestEpic } from './recipes';
import { applicationEpic } from './application';

export const epics = combineEpics(
  createRecipeEpic,
  createTestEpic,
  applicationEpic,
  publishAllEpic,
  updateRecipeEpic
);
