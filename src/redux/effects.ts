import Firebase from 'firebase';

import { FirebaseService } from '../services/firebase';

type NextValue = {
  type: string;
  payload: any;
}

type ErrorPayload = {
  originalPayload: any;
  error: Error;
}

type ErrorValue = {
  type: string;
  payload: ErrorPayload;
}

export interface Effect {
  data(key: string, value: any): Effect;
  execute(dispatch: any): void;
}

// the FirebaseService instance will get Injected into the effect
export const FirebaseStartEffect = {
  execute({ dispatch }) {
    const firebaseRef = new Firebase(`https://${__FIREBASE_ID}.firebaseio.com`);
    const stream$ = FirebaseService.init(firebaseRef, ['recipes', 'tests', 'test_results', 'agent']);

    stream$.subscribe(
      ({type, payload}: NextValue) => dispatch({type, payload}),
      ({type, payload}: ErrorValue) => dispatch({type, payload})
    );
  }
};

export const UpdateResourceEffect: Effect = {
  data(key, value) {
    this.key = key;
    this.value = value;
    return this;
  },

  execute({ dispatch }) {
    FirebaseService.update(this.key, this.value)
      .subscribe(
        value => dispatch(value),
        error => dispatch(error)
      );
  }
};

export const CreateResourceEffect: Effect = {
  data(key, value) {
    this.key = key;
    this.value = value;
    return this;
  },

  execute({ dispatch }) {
    FirebaseService.create(this.key, this.value)
      .subscribe(
        value => dispatch(value),
        error => dispatch(error)
      );
  }
};
