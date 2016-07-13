import * as Effects from './effects';
import * as Constants from '../constants';

export const rootMounted = (state) => state.update('effects', updater => updater.push(Effects.FirebaseStartEffect));

export const receivedFromAgent = (state, payload) => state.set('agentActive', payload.active);

export const appMounted = () => ({ type: Constants.ROOT_MOUNTED });
