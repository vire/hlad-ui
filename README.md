# hlad-ui

UI for configuring/debugging the [hlad-crawler](https://github.com/vire/hlad) using Firebase as data-store.
    
## WIP

- [x] Connect w/ Firebase + read initial data model
- [] Listen to changes from Firebase (resolve conflicts)
- [] Push changes to Firebase
- [] LiveRecipe editor - paste configuration and see results
- [] Hlad remote configuration - endpoint, crawl time
- [] Tests + CI

## Setup

```
$ npm install
```

## Run

- Firebase endpoint is configurable as process.env.FIREBASE_ID

```
$ FIREBASE_ID=<your-firebase-id> npm start
```

## Test

```
$ npm test
```

or development mode

```
$ npm run test:dev # lunches karma with watch capability
```

## Build

```
$ npm run build
```

# License

ISC
