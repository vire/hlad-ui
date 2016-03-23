import Firebase from 'firebase';
import { FirebaseService } from '../services/firebase';

abstract class IStreamPayload {
  type: string;
  payload: any;
}

abstract class IErrorPayload {
  originalPayload: any;
  error: Error;
}

abstract class IStreamErrorPayload {
  type: string;
  payload: IErrorPayload;
}

// the FirebaseService instance will get Injected into the effect
export const FirebaseStartEffect = {
  execute({ dispatch }) {
    const firebaseRef = new Firebase(`https://${__FIREBASE_ID}.firebaseio.com`);
    const stream$ = FirebaseService.init(firebaseRef, ['recipes', 'tests', 'test_results', 'recipe_tester']);

    stream$.subscribe(
      ({type, payload}: IStreamPayload) => dispatch({type, payload}),
      ({type, payload}: IStreamErrorPayload) => dispatch({type, payload})
    );
  }
};

export const UpdateResourceEffect = {
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

export const CreateResourceEffect = {
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
