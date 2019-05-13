### Writing Tests

We use jest for testing.

Create tests in the __tests__ folder.

To add things that need to be part of setup before tests, add it to __tests__/setup/ and reference the file in package.json under jest.setupFiles.

To exclude files in the `__tests__` folder from being run as part of tests, add it to the `jest.modulePathIgnorePatterns` key in package.json.

### Mocks

You will often need to mock things, most often things that interface with native phone modules, and calls to external APIs.

To mock network requests made using the `fetch` library, we use [`jest-fetch-mock`](https://github.com/jefflau/jest-fetch-mock#readme). The global `fetch` variable is over-written with the `mock` as part of our tests setup. You mock calls by calling, for eg. `fetch.mockResponseOnce('your mock response')`. The next network request you make via your tests will then receive 'your mock response' as response. Refer to the `jest-fetch-mock` documentation for more complex cases. 

To mock Native calls, see __tests__/setup/mock.js. You create a `key` for the native module you wish to mock, with the value being the mock.

To mock a library that is in package.json, create a file in the __mocks__ folder. For eg. if you needed to mock react-native-oauth, create a file called __mocks__/react-native-oauth.js. Then, in your tests, your mock wll be used. If you do not wish your mock to be used for a particular test, call `jest.unmock('<module-name>)`

To mock our own modules, create a folder called __mocks__ inside the code folder and put a file there. For eg. to mock services/api.js, you would create services/__mocks__/api.js with your mock, and use jest.mock('./services/api') before your test.

### Snapshots

Especially for UI components, one often wants to test that something renders to match a particular "snapshot". Jest makes it easy to create a "snapshot" of any expected variable / outcome, and create a "snapshot" (failing subsequent tests if the snapshot doesn't match).

To create a snapshot for any variable you are testing:

`expect(someVar).toMatchSnapshot()` - Jest will then automatically create a snapshot, and allow you to inspect changes and regenerate the snapshot when there are code changes.

The snapshots are created in a __snapshots__ folder and should be checked in to the repository.

Your tests will fail if something changes. If you wish to regenerate the snapshot to reflect your changes, run `jest -u` and `jest` will show you changes between snapshots, you can verify they are as expected, and choose to update your snapshots. 

### Coverage

Run `jest --coverage` to see an output of test coverage.

### Resources

For docs on expect assertions: https://jestjs.io/docs/en/expect
A pretty neat `jest` cheatsheet: https://github.com/sapegin/jest-cheat-sheet