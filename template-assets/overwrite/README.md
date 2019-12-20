# Welcome to Steroids

This is a Node.js server built on Express and Steroids.

# Learn How to Use Steroids

Read the [Steroids documentation](https://github.com/chisel/steroids/tree/master/docs/steroids.md) to learn how to fully use Steroids components and the [Steroids CLI documentation](https://github.com/chisel/steroids#readme) to learn how to use the Steroids CLI.

# NPM Scripts

  - `npm start`: Builds and runs the server.
  - `npm test`: Builds and runs the tests.
  - `npm run build`: Build the server into `dist`.
  - `npm run launch`: Runs the last build.
  - `npm run docs`: Builds the internal documentation.

# Launching the Server

If launching from the project root, run any of the following:
  - `npm run launch`
  - `npm run start` (builds first)
  - `sd run` (using [Steroids CLI](https://github.com/chisel/steroids))
  - `node dist/@steroids/main`

If running from the dist directory, run `node @steroids/main`

> **NOTE:** If running the server from any other directory where CWD is not dist or project root, path aliases (TypeScript paths defined in tsconfig.json) will fail to resolve.
