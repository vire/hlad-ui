import Firebase from 'firebase';
import { ActionsObservable } from 'redux-observable';

import * as Constants from '../constants';
import { FirebaseService } from '../services/firebase';

// Actions
export const appMounted = () => ({ type: Constants.APP_MOUNTED });

// Updaters
export const updateAgentStatus = (state: any, payload:any) => state.set('agentActive', payload.active);

// Epics
// TODO firebaseService init catch!
export const applicationEpic = (action$: ActionsObservable<any>) => action$
  .ofType(Constants.APP_MOUNTED)
  .flatMap(_ => FirebaseService.init(
    new Firebase(`https://${__FIREBASE_ID}.firebaseio.com`),
    ['recipes', 'tests', 'test_results', 'agent']
  ));

const reducer = () => {}; // now just noop

export default reducer;

