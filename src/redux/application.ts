import * as Constants from '../constants';
import { FirebaseService } from '../services/firebase';

// Actions
export const appMounted = () => ({ type: Constants.ROOT_MOUNTED });

// Updaters
export const updateAgentStatus = (state, payload) => state.set('agentActive', payload.active);

// Epics
// TODO firebaseService init catch!
export const applicationEpic = (action$) => action$
  .ofType(Constants.ROOT_MOUNTED)
  .flatMap(_ => FirebaseService.init(
    new Firebase(`https://${__FIREBASE_ID}.firebaseio.com`),
    ['recipes', 'tests', 'test_results', 'agent']
  ));

const reducer = () => {} // now just noop

export default reducer;

