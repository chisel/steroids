# Welcome to Steroids

This is a Node.js server built with Express on Steroids!

# Learn How to Use Steroids

Read the [Steroids documentation](https://github.com/chisel/steroids/tree/master/docs/steroids.md) to learn how to fully use Steroids components and the [Steroids CLI documentation](https://github.com/chisel/steroids#readme) to learn how to use the Steroids CLI.

# Launching the Server

If launching from the project root, run any of the following:
  - `npm run launch`
  - `npm run start` (builds first)
  - `sd run` (using [Steroids CLI](https://github.com/chisel/steroids))
  - `node dist/@steroids/main`

If running from the dist directory, run `node @steroids/main`

> **NOTE:** If running the server from any other directory where CWD is not dist or project root, path aliases (TypeScript paths defined in tsconfig.json) will fail to resolve.

# Steroids CLI

Here's a quick guide to using Steroids CLI on this project:
  - Build and run: `sd run`
  - Run the tests: `sd test`
  - Add a new router: `sd add router auth`
  - Add a new service: `sd add service database`

Read the [Steroids CLI documentation](https://github.com/chisel/steroids#readme) to learn what more you can do with it on this project.

# NPM Scripts

  - `npm start`: Builds and runs the server.
  - `npm test`: Builds and runs the tests.
  - `npm run build`: Build the server into `dist`.
  - `npm run launch`: Runs the last build.
  - `npm run docs`: Builds the internal documentation.
