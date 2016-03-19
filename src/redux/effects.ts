import Firebase from 'firebase';
import { FirebaseService } from '../services/firebase';

// the FirebaseService instance will get Injected into the effect
export const FirebaseStartEffect = {
  execute({ dispatch }) {
    const firebaseRef = new Firebase(`https://${__FIREBASE_ID}.firebaseio.com`);
    const stream$ = FirebaseService.init(firebaseRef);

    stream$.subscribe(
      value => dispatch(value),
      err => dispatch(err)
    );
  }
};

export const UpdateResourceEffect = {
  data(key, value) {
    this.key = key;
    this.value = value;
    return this;
  },

  execute() {
    FirebaseService.update(this.key, this.value);
  }
};

export const CreateResourceEffect = {
  data(key, value) {
    this.key = key;
    this.value = value;
    return this;
  },

  execute() {
    FirebaseService.create(this.key, this.value);
  }
}
