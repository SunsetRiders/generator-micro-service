# <%= userviceName %> Microservice

<%= projectDescription %>

## How to run this application for development (locally)?

### System requirements

  - [Node.js - <%= nodeVersion %>](https://nodejs.org/en/), we recommend that you install it using
    [Node Version Manager (`nvm`)](https://github.com/creationix/nvm);
  - [RethinkDB](https://www.rethinkdb.com/), we suggest that you use it inside a
    docker container.
  - [PostgreSQL](https://www.postgresql.org/), we suggest that you use it inside a
    docker container.

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

  - [Docker](https://www.docker.com/), we recommend version 1.11.2;
  - [Docker Compose](https://docs.docker.com/compose/), we recommend version 1.7.1

### Getting started

```
docker-compose up --build api       # runs the application;
docker-compose up --build rethinkdb # runs rethinkdb;
docker-compose up --build test      # runs all the tests, unit and functional;
```

## Environment Variables

For development:

```shell-script
cp .env.example .env
```

For production:

> Set this environment variables on your provider.

Environment Variable                                | Required                      | Usage
----------------------------------------------------|-------------------------------|------------------------------------
`API_HOST`                                          | :heavy_check_mark:            | Service API host number
`API_KEY`                                           | :heavy_check_mark:            | Service mandatory header "api_key" to access routes, default is `tokenisdevtoken`
`API_PORT`                                          | :heavy_check_mark:            | Service API port number
`API_VERSION`                                       | :heavy_check_mark:            | Service API open api documentation `(e.g: "api/v1", "api/v2")`
`APP_PASSWORD`                                      | :heavy_check_mark:            | The "basic auth" password requested by the browser when accessing the Admin UI
`APP_USER`                                          | :heavy_check_mark:            | The "basic auth" user requested by the browser when accessing the Admin UI
`LOGS_COLOR`                                        | Optional, default is false    | Logentries color output
`LOGS_LOGENTRIES_TOKEN`                             | Optional, default is empty    | Logentries.com token
`LOGS_TRANSPORTS`                                   | Optional, default is console  | Logentries type of transport, `[console, file, etc..]`
`POSTGRES_DB`                                       | :heavy_check_mark:            | Database name
`POSTGRES_HOST`                                     | :heavy_check_mark:            | Database host
`POSTGRES_PASSWORD`                                 | :heavy_check_mark:            | Database password
`POSTGRES_USER`                                     | :heavy_check_mark:            | Database user
`POSTGRES_SSL`                                      | Optional, default is false    | Use SSL connection
`RETHINKDB_AUTHKEY`                                 | Optional, default is empty    | Authentication key to the RethinkDB server
`RETHINKDB_BUFFER_SIZE`                             | Optional, default is 50       | The minimum number of connections available in the pool
`RETHINKDB_DATABASE`                                | :heavy_check_mark:            | The default database
`RETHINKDB_HOST`                                    | :heavy_check_mark:            | Host of the RethinkDB server
`RETHINKDB_MAX`                                     | Optional, default is 1000     | The maximum number of connections in the pool
`RETHINKDB_MIN`                                     | Optional, default is 50       | The minimum number of connections in the pool
`RETHINKDB_PORT`                                    | :heavy_check_mark:            | Client port of the RethinkDB server
`RETHINKDB_SSL_CA`                                  | Optional, default is empty    | The app's certificate text (you can copy and paste the contents of the file)
`RETHINKDB_TIMEOUT_ERROR`                           | Optional, default is 1000     | Number of milliseconds before reconnecting in case of an error
`RETHINKDB_TIMEOUT_GB`                              | Optional, default is 3600000  | Number of milliseconds before removing a connection that has not been used
`RETHINKDB_USER_PASSWORD`                           | Optional, default is empty    | Database password
`RETHINKDB_USER`                                    | Optional, default is empty    | Database user


> NOTE: This configuration file will be used on the back-end by the "getconfig";
