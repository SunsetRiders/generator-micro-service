# <%= userviceName %> Microservice

<%= projectDescription %>

You can find the objective of this project and dependencies in the [ARCHITECTURE.md](ARCHITECTURE.md) file within this repository.

> **Reminder:** [Making READMEs readable](https://pages.18f.gov/open-source-guide/making-readmes-readable/).

## How to run this application for development (locally)?

### System requirements

  - [Node.js - <%= nodeVersion %>](https://nodejs.org/en/), we recommend that you install it using
    [Node Version Manager (`nvm`)](https://github.com/creationix/nvm);

### Getting started

```shell-script
ln -s .env.example .env # Create a symbolic link .env -> .env.example;
npm install             # install all Node.js dependencies, development
                        # dependencies included;
npm run start           # Builds the front-end and back-end application, api
                        # documentation and runs database _migrate_ and then the
                        # application (IMPORTANT: You should have RethinkDB
                        # running);
npm run test:unit       # Runs the unit tests;
npm run test:functional # Runs the functional tests, IMPORTANT: You should have
                        # RethinkDB running;
```

## How to run this application on Docker?

### System requirements

  - [Docker](https://www.docker.com/), we recommend version 1.11.2 or newer;
  - [Docker Compose](https://docs.docker.com/compose/), we recommend version 1.7.1 or newer.

### Getting started

```
docker-compose up --build api       # runs the application;
docker-compose up --build test      # runs all the tests, unit and functional;
```

## Environment Variables

For development:

```shell-script
cp .env.example .env
```
Or, as a suggestion to a changing environment:

```shell-script
ln -s .env.example .env
```

For production:

*Set this environment variables in your service provider.*

Environment Variable                                | Required                      | Usage
----------------------------------------------------|-------------------------------|------------------------------------
`API_HOST`                                          | :heavy_check_mark:            | Service API host number
`API_KEY`                                           | :heavy_check_mark:            | Service mandatory header "api_key" to access routes, default is `tokenisdevtoken`
`API_PORT`                                          | :heavy_check_mark:            | Service API port number
`API_VERSION`                                       | :heavy_check_mark:            | Service API open api documentation `(e.g: "api/v1", "api/v2")`
`LOGS_COLOR`                                        | Optional, default is false    | Logentries color output
`LOGS_LOGENTRIES_TOKEN`                             | Optional, default is empty    | Logentries.com token
`LOGS_TRANSPORTS`                                   | Optional, default is console  | Logentries type of transport, `[console,file,logentries etc...]`


*NOTE: This configuration file will be used by `getconfig`;*

## How to develop and test new patches

This is a topic for developers willing to help us build a better micro service.

### Folders Structure

Let us introduce how we organize the folders structure first:

```
.
├── .github
|   └── PULL_REQUEST_TEMPLATE.md
├── bin
├── config
├── lib
├── src
|   ├── assets
|   ├── models
|   └── services
└── tests
```

:sparkles: **.github**: This is our integration with github service, we highlight that we are going to provide a [Pull Request Template](https://help.github.com/articles/creating-a-pull-request-template-for-your-repository/).

:information_source: **bin**: Find the wrappers to start the services we provide within this code here, `package.json` is going to have commands pointing to those files.

:memo: **config**: This folder contains javascript files that are responsible to read the `.env` file, constructing and exporting a module to our app, that can be used through `const configs = require('getconfig')` - a code snippet that is used a lot when requiring environment variables.

:point_right: **lib**: It's a design decision to write the modules we may export one day in this folder, so everything that you can re-utilize must be here.

:heavy_check_mark: **src**: The app we write lives here. Explore the business logic and the algorithms to help us with them all here.

:heavy_check_mark: **src/assets**: When we need resources that are not javascript files, but the code needs them, like HTML files for emails templates, images, text files and so.

:heavy_check_mark: **src/models**: Do you know when we need to have a module or a class to help us structuring our information, organizing inputs or outputs, so we welcome code responsible for this here.

:heavy_check_mark: **src/services**: "Services" are those files that contain the business logic itself and may use some resources from `src/models`, `src/assets`, or even something from the `/lib` folder.

:heavy_check_mark: **src/routes**: Contains the files that implement the controllers + API documentation ([Open API](https://www.openapis.org/)).

A route path is generated using the folder tree itself, *example*:

File `routes/nominations/{nominationId}.js` is going to implement a controler + API Docs for route `/nominations/{nominationId}`

:ghost: **tests**: Unit tests, Functional tests or any other kind of test should be here. You know good software comes with some QA, right? We use [mocha](https://mochajs.org/) + [chai](http://chaijs.com/) to develop them.

:ghost: **tests/functional**: Functional or Integration tests.

:ghost: **tests/unit**: Unit tests.

### Package.json commands

We rely on [npm scripts session](https://docs.npmjs.com/misc/scripts) to provide them. Every test runs with [Istanbul](https://istanbul.js.org/) coverage tool.

- `npm test`: call all the test commands we have to test this project;
- `npm run test:lint`: only check the lint specs of our javascript;
- `npm run test:unit`: run all unit tests;
- `npm run test:unit:debug`: all unit tests with more verbosity;
- `npm run test:functional`: run all functional/integration tests;
- `npm run test:functional:debug`: all functional/integration tests with more verbosity;
- `npm run docs`: generates the swagger.yaml file, that integrates with [Apiary.io](https://apiary.io/).
