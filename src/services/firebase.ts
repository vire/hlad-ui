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

    rootRef
      .child('tests')
      .on('value', snapshot => subject$.next({
        type: 'RECEIVED_TESTS',
        payload: snapshot.val(),
      }));

    return subject$;
  },

  create(key, value) {
    const PREFIX = key.toUpperCase(); // TESTS, RECIPES
    this.rootRef
      .child(key)
      .push()
      .set(value, (err) => {
        if (err) {
          this.subject$.error({
            type: `${PREFIX}_NOT_ADDED`,
            payload: {
              value,
              error: err,
            }
          });
        } else {
          this.subject$.next({
            type: `${PREFIX}_ADDED`,
            payload: {
              value,
            }
          });
        }
      });
  },

  update(key, value) {
    const PREFIX = key.toUpperCase(); // TESTS, RECIPES
    const { id, name, recipeType, structure, URL } = value;
    this.rootRef
      .child(`${key}/${id}`)
      .update({
        name,
        type: recipeType,
        structure,
        URL: URL,
      }, (err) => {
        if (err) {
          this.subject$.error({
            type: `${PREFIX}_NOT_UPDATED`,
            payload: {
              value,
              error: err,
            }
          });
        } else {
          this.subject$.next({
            type: `${PREFIX}_UPDATED`,
            payload: {
              value,
            }
          });
        }
      });
  },
};
