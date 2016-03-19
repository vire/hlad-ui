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
  },

  create(key, value) {
    this.rootRef
      .child(key)
      .push()
      .set(value, (err) => {
        if (err) {
          this.subject$.error({
            type: 'RESOURCE_NOT_CREATED',
            payload: {
              value,
              error: err,
            }
          });
        } else {
          this.subject$.next({
            type: 'RESOURCE_CREATED',
            payload: {
              value,
            }
          });
        }
      });
  },

  update(key, value) {
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
            type: 'RESOURCE_UPDATE_FAILED',
            payload: {
              value,
              error: err,
            }
          });
        } else {
          this.subject$.next({
            type: 'RESOURCE_UPDATED',
            payload: {
              value,
            }
          });
        }
      });
  },
};
