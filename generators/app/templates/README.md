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

This is a topic for developers willing to help us build a better micro service. Reading below will cover how to approach this project and how to develop a new route for this micro service.

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

### Package.json scripts

We rely on [npm scripts session](https://docs.npmjs.com/misc/scripts) to provide them. Every test ca run with [Istanbul](https://istanbul.js.org/) coverage tool.

- `npm test`: call all the test commands we have to test this project;
- `npm run test:lint`: only check the lint specs of our javascript;
- `npm run test:unit`: run all unit tests;
- `npm run test:unit:debug`: all unit tests with more verbosity;
- `npm run test:functional`: run all functional/integration tests;
- `npm run test:functional:debug`: all functional/integration tests with more verbosity;
- `npm run docs`: generates the swagger.yaml file, that integrates with [Apiary.io](https://apiary.io/).

### Branches purposes (Gitflow)

  - **develop**: used for development. We don't expect this environment to be always working nor up and running, since this is
the right place to check how the code is going to perform in a *production like* environment. Start new features here!

  - **release**: used to test new features, bug or incident fixes. We expect this environment to be always up and running, without trace of features partially developed - this environment must be stable! We are going to use the code here to be moved to PRODUCTION, so breaking this environment must bring the same feeling as breaking production.

  - **master**: this is where our current stable software must reside. Moving code here must follow [SEMANTIC VERSIONING v2.0.0](http://semver.org/) with a commented git tag.

It is also your responsability to check if our Countinuous Integration is working properly to deliver your patch.

### Code delivery

We would like to give an overview of how to deliver a patch to this project, by describing how a new route (or endpoint), should be written.

Let's take the `/health` route as the code sample of this example.

1. create your separated branch for this one:

```shell-script
git checkout develop
git pull origin develop
git branch -b feature/new_route
```

2. ensure you have everything OK to run this project entirely in your local machine, start any dependencies with the provided `docker-compose.yml`. If you are going to start a new dependency, `docker-compose.yml` is the file you also need to prepare with this dependency - we are keeping how to use `docker-compose` commands out of this scope. Then get all the node modules this project need:

```shell-script
npm install
```

Note that if you need a new node module we suggest you to install it via `npm install <module_name> --save`, if you are not comfortable with `npm`, try reading [npm documentation for installing new dependencies](https://docs.npmjs.com/cli/install).

3. For exposing your new route lies the tricky part to understand it: the route is a file path under `src/routes/`. Therefore to expose `/health` we need to create the file `src/routes/health.js`. We also have a version of the micro service API prepended in the route, to find out how it works you can check how we use the environment variable `API_VERSION`.

4. Work on `src/routes/health.js`: this is where you give life to your endpoint and also to the documentation. With regards to *documentation*, if you need new [Open API](https://www.openapis.org/) definitions, write it in `src/doc.json` and use it in the route file. If you need to deal with an information that is nice to be structured, you may need to write or update a module in `src/models`. If you need to use files like .sql - for database queries - or html templates, or even image files, save them in `src/assets`. If you need to connect to a database, or any external dependency, `src/services` is where you create the javascript to define a solution to this dependency.

If you need anything that is a repetitive task when receiving a request in your route, think about using a [ExpressJS middleware](https://expressjs.com/en/guide/using-middleware.html).

5. *Organization of features inside the code*: we are grouping the features we develop in `src/services` files, so pay attention to keep this kind of organization in your development. Also keep attention to folders structures that may arise inside the main folders of this project - always discuss what is better with the team.

6. Give it an automated test: We encourage every developer to write unit and functional tests, so `tests` folder is where you should find sample codes for it!

7. Ensure you have every other part of the micro service running as expected by the written tests with:

```shell-script
npm test
```

Check if your environment variables are pointing to the best place to test your new feature with the tests.

8. Now you must be confident to push your code and open a Pull Request to our *develop branch*.

If you have questions, always count on discussing with your teammates!

Happy coding! :-)
