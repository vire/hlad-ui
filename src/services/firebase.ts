import {Observable, Observer} from 'rxjs';

type payload = {
  type: string;
  payload: any;
}

export interface FirebaseService {
  rootRef?: Firebase;
  init(rootRef: Firebase, keys: Array<string>): Observable<any>;
  create(key: string, value: any): Observable<payload>;
  update(key: string, value: any): Observable<payload>;
}

export const FirebaseService: FirebaseService  = {
  rootRef: undefined,

  init(rootRef: Firebase, keys: Array<string>) {
    this.rootRef = rootRef;

    return Observable.create((observer: Observer<any>) => {
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

    return Observable.create((observer: Observer<any>) => {
      const newRef = this.rootRef
        .child(key)
        .push();

        newRef.set(value, (err: Error) => {
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
              payload: Object.assign({}, value, { firebaseKey: newRef.key() })
            });
          }
        });
    });
  },

  update(key, value) {
    const PREFIX = key.toUpperCase();
    const { id, name, type, structure, URL } = value;

    return Observable.create((observer: Observer<any>) => {
      this.rootRef
        .child(`${key}/${id}`)
        .update({
          name,
          type,
          structure,
          URL: URL,
        }, (err: Error) => {
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
