# curelo backend

The backend is a NestJS based application. It uses PostgreSQL as a database and Prisma as an ORM.

## Getting started

### Prerequisites

- **Node.js** installed
- **pnpm** installed
- **PostgreSQL** up and running on your machine on port `5432`. If you change this, or you are using a different database, you will need to change the connection string in the `.env` file.
- Port `4200` should be free. This will be used by the backend to run the server.
- **AWS S3 bucket** for storing the images. This is optional, but if you want to use the image upload feature, you will need to fill in the required values in the `.env` file.
- **nest cli** installed globally. If not, you can install it by running `pnpm i -g @nestjs/cli`
- **Docker** installed. This is optional, but if you want to run the database in a container, or you will need to run the E2E tests, you will need to have Docker installed.

### Installation

1. Clone the repository

   ```sh
   git clone https://github.com/eronka/culero
   ```

2. Head into the `backend` folder

   ```sh
   cd backend
   ```

3. Install the dependencies

   ```sh
   pnpm install
   ```

4. Make sure your database is running. If you would like to use docker, run the following command:

   ```sh
   docker run --name culero-psql --network host -e POSTGRES_PASSWORD=password -d postgres
   ```

5. For Prisma to work properly, generate the types

   ```sh
   pnpm db:generate-types
   ```

6. Deploy the migrations

   ```sh
   pnpm db:deploy-migrations
   ```

7. Start the server

   ```sh
   pnpm start:dev
   ```

This will get your prerequisites ready and the backend up and running.

### Environment Variables

All the environmental variables required by the backend are present in the `.env` file. You can copy the `.env.example` file and fill in the required values.

```sh
cp .env.example .env
```

### Developing

You would need a PostgreSQL database to be up and running. If you don't have it installed, you can run it in a container using the following command:

```sh
docker run --name culero-psql --network host -e POSTGRES_PASSWORD=password -d postgres
```

Any changes that you make to the code will automatically show up since live reload is enabled. If you make any changes to the database file (`schema.prisma`), you will need to re-generate the migration files and deploy them. A side note, generate and deploy the migrations only when you feel that the changes are ready to be deployed.

```sh
pnpm db:generate-types
pnpm db:generate-migrations
pnpm db:deploy-migrations
```

Apart from database changes, in case you feel you need to add another module, simply do `nest g module <module_name>`

### Testing

#### Writing tests

Any updates that you make to the code, or for features that you create, you will need to add proper tests for those features. Our repository currently employs unit and e2e tests. These are the usages:

- You create unit tests when you have created some util function. Do keep the default test file that is created when you create a new file using nest cli.
- You create e2e tests when you have created a new module or a new feature. There won't be a default file for this, so lets say you have created a new module named `project`, then inside the `project` module, you will be creating a `project.e2e.spec.ts` file.

#### Running the tests

Before you make a PR, or push the code, do ensure that your code passes the existing tests. Note that, the E2E test tries to set up a local database using `docker compose` on port `5432`. If you have a database running on that port, you will need to stop it before running the tests.

You will need to run both the E2E and unit tests.

```sh
pnpm test
```

If you want to run the tests individually, you can do so by running the following commands:

```sh
pnpm test:unit
pnpm test:e2e
```

Once you ensure that the tests are passing, you can push your code.

### OAuth Configuration

Currently, the backend supports 4 OAuth providers:

- Google
- Facebook
- LinkedIn
- Apple

By default, all of them will be disabled. To enable them, all you need to do is fill in the required values in the `.env` file.

## Organization of the code

The code is organized in a modular way. Each module has its own folder and contains the following files:

- `<module>.controller.ts`: The REST controller file for the module. Exposes the REST endpoints.
- `<module>.service.ts`: The service file for the module. Contains the business logic.
- `<module>.module.ts`: The module file for the module. Contains the module definition and the imports.

## Authentication and Authorization

### Authenticating to the application

Currently, the only way to log into the application is via the 4 OAuth providers:

- Google: `/api/auth/google`
- Facebook: `/api/auth/facebook`
- LinkedIn: `/api/auth/linkedin`
- Apple: `/api/auth/apple`

Once you log in, you will receive a JWT token which you can use to authenticate yourself to the application. You will need to pass this token in the `Authorization` header of the request.

```yaml
Authorization: Bearer <token>
```

### Authorization flow

All endpoints that require authorization are guarded by the [`AuthGuard`](./src/auth/guard/auth/auth.guard.ts) from NestJS. This means that you will need to pass the JWT token in the `Authorization` header of the request.

For endpoints that can be accessed publicly, annotate them with the [`@Public()`](./src/decorators/public.decorator.ts) decorator.

If any endpoint would be accessed only after authentication, you can access the user's information from the request object. The user's information is present in the `req.user` object. You can use the [`@CurrentUser()`](./src/decorators/current-user.decorator.ts) decorator to access the user's information. Usage of this decorator can be found in the user controller.
