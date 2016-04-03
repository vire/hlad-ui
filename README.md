# hlad-ui

UI for configuring/debugging the [hlad-crawler](https://github.com/vire/hlad) using Firebase as data-store.
    
## WIP

- [x] Listen for `Recipes` and `Recipe Tests` from Firebase
- [x] Push `Recipes` to Firebase
- [x] Connect w/ [RecipeTester](https://github.com/vire/hlad/blob/master/recipe-tester.js) - define structure, evaluate, make request, see results
- [x] Notification about **RecipeTester** offline/online
- [] Hlad remote configuration - endpoint, crawl time
- [] Hlad simulate sending content to endpoint (will send to firebase and display in hlad-ui)
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
