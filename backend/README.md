# curelo backend

The backend is a NestJS based application. It uses PostgreSQL as a database and Prisma as an ORM.

## Getting started

### Prerequisites

- **Node.js** installed
- **pnpm** installed
- **PostgreSQL** up and running on your machine on port `5432`. If you change this, or you are using a different database, you will need to change the connection string in the `.env` file.
- Port `4200` should be free. This will be used by the backend to run the server.

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

4. Make sure your database is running

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

Any changes that you make to the code will automatically show up since live reload is enabled. If you make any changes to the database file (`schema.prisma`), you will need to re-generate the migration files and deploy them. A side note, generate and deploy the migrations only when you feel that the changes are ready to be deployed.

```sh
pnpm db:generate-types
pnpm db:generate-migrations
pnpm db:deploy-migrations
```

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
