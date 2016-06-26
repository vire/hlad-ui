import * as Effects from './effects';

export const rootMounted = (state) => state.update('effects', updater => updater.push(Effects.FirebaseStartEffect));

export const receivedFromAgent = (state, payload) => state.set('agentActive', payload.active);
