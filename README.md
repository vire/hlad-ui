# hlad-ui

UI for configuring/debugging the [hlad-crawler](https://github.com/vire/hlad) using Firebase as data-store.
    
## WIP

- [x] Sync (Pull/Create/Update) `Recipes` via Firebase
- [x] Ability to test new recipes before saving them
- [x] Real-time notifications about **Crawling Agent** status changes
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
