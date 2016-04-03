import { Observable } from 'rxjs';

export interface FirebaseService {
  rootRef?: Firebase;
  init: any;
  create(key: string, value: any): Observable<{}>;
  update(key: string, value: any): Observable<{}>;
}

export const FirebaseService: FirebaseService  = {
  rootRef: null,

  init(rootRef: Firebase, keys: Array<string>) {
    this.rootRef = rootRef;

    return Observable.create(observer => {
      keys.forEach((keyName) => {
        rootRef
          .child(keyName)
          .on('value', snapshot => observer.next({
            type: `RECEIVED_FROM_${keyName.toUpperCase()}`, // e.g. RECEIVED_FROM_TESTS
            payload: snapshot.val(),
          }));
      });
    });
  },

  create(key, value) {
    const PREFIX = key.toUpperCase();

    return Observable.create(observer => {
      this.rootRef
        .child(key)
        .push()
        .set(value, (err) => {
          if (err) {
            observer.error({
              type: `CREATE_FAILED_IN_${PREFIX}`,
              payload: {
                originalPayload: value,
                error: err,
              }
            });
          } else {
            observer.next({
              type: `CREATED_IN_${PREFIX}`,
              payload: value
            });
          }
        });
    });
  },

  update(key, value) {
    const PREFIX = key.toUpperCase();
    const { id, name, type, structure, URL } = value;

    return Observable.create(observer => {
      this.rootRef
        .child(`${key}/${id}`)
        .update({
          name,
          type,
          structure,
          URL: URL,
        }, (err) => {
          if (err) {
            observer.error({
              type: `CREATE_FAILED_IN_${PREFIX}`,
              payload: {
                originalPayload: value,
                error: err,
              }
            });
          } else {
            observer.next({
              type: `$CREATED_IN_${PREFIX}`,
              payload: value
            });
          }
        });
    });
  },
};
