import { Subject } from 'rxjs';

export const FirebaseService = {
  subject$: null,
  rootRef: null,

  init(rootRef) {
    this.rootRef = rootRef;

    const subject$ = new Subject();
    this.subject$ = subject$;

    rootRef
      .child('recipes')
      .on('value', snapshot => subject$.next({
        type: 'RECEIVED_RECIPES',
        payload: snapshot.val(),
      }));

    return subject$;
  }
};
