import * as Effects from './effects';

export const rootMounted = (state) => state.update('effects', updater => updater.push(Effects.FirebaseStartEffect));
