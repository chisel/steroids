# Express on Steroids!

Steroids helps building backend solutions with Node.js, Express, and TypeScript by introducing new components that are easy and fast to develop.

Here's a quick list of features Steroids provides:

  - TypeScript enabled
  - Powered by Express
  - Automatic code minification
  - Logic is encapsulated into "Services" and router middlewares are grouped as "Routers"
  - Routes are easily defined using the Router decorator
  - Built-in input validation mechanism with routers (request body, headers, query parameters, etc.)
  - Ability to extend the validation logic with custom validators
  - Dynamic route and service installation
  - Dynamic service injection without circular dependency issues
  - Path alias support for easier imports
  - Unit testing with Mocha and Chai
  - TypeDoc ready

# Installation

```bash
npm install @chisel/steroids -g
```

# Steroids Framework

You can read the [official documentation](./docs/steroids.md) to learn how to use Steroids to develop backend solutions.

# CLI Usage

After installing Steroids globally, the `sd` command will be available with the following options:

  - **sd new &lt;name&gt; [options]**: Creates a new Steroids project. The project name should be in kebab case.  
    Options:
    - **-m, --minimal**: Skips setting up tests and examples.
    - **--skip-examples**: Skips setting up examples.
    - **--skip-tests**: Skips setting up tests.
    - **--skip-npm-install**: Skips installing dependencies.
    - **--skip-git**: Skips initializing git repository.
    - **-v, --verbose**: Verbose logging.
  - **sd add router &lt;name&gt; [options]**: Generates a router component under `src/routers`.  
    Options:
    - **-d, --directory &lt;path&gt;**: A path to override the default location the router is generated at.
    - **--skip-tests**: Skips generating the unit test for router.
  - **sd add service &lt;name&gt; [options]**: Generates a service component under `src/services`.  
    Options:
    - **-d, --directory &lt;path&gt;**: A path to override the default location the service is generated at.
    - **--skip-tests**: Skips generating the unit test for service.
  - **sd path list**: Displays a list of all existing paths.
  - **sd path new &lt;alias&gt; &lt;target&gt;**: Creates a new path (target must be relative to `src`).
  - **sd path delete &lt;alias&gt;**: Deletes a path.
  - **sd build [options]**: Builds the source into `dist`.  
    Options:
    - **-v, --verbose**: Displays all logs.
  - **sd run [options]**: Builds and runs the server.  
    Options:
    - **-p, --port &lt;port_number&gt;**: Overrides the port number.
    - **-w, --watch**: Enables live reloading by watching the source files for changes.
    - **--skip-build**: Skips building the source code before running the server.
    - **-v, --verbose**: Displays all logs.
  - **sd test [options]**: Builds and runs the tests against the last server build.  
    Options:
    - **-v, --verbose**: Displays all logs.
  - **sd docs [options]**: Generates the documentation using TypeDoc inside `docs` directory.  
    Options:
    - **-s, --serve**: Serves the documentation on port 7000.
    - **-p, --port**: Overrides the port number the documentation is being served on.
    - **-d, --directory &lt;path&gt;**: A path relative to project root to override the default documentation directory.
    - **-v, --verbose**: Displays all logs.
  - **sd --version**: Displays Steroids version.
  - **sd --help**: Displays Steroids help. You can also use this option with any commands to view detailed usage information.

## Examples

#### Creating a new project

Create a new project called My Project:
```bash
sd new my-project
```

#### Adding a router

Add a new router called UserAuth at `src/routers/user-auth.router.ts`:
```bash
sd add router user-auth
```

#### Adding a service

Add a new service called Firebase at `src/services/firebase.service.ts`:
```bash
sd add service firebase
```

#### Managing paths

List all TypeScript paths:
```bash
sd path list
```

Add a new path for modular validators at `src/validators`:
```bash
sd path new "@steroids/validator/*" "validators/*.validator"
```

Delete the validators path:
```bash
sd path delete "@steroids/validator/*"
```

#### Building the source code

Build the source into `dist`:
```bash
sd build
```

#### Running the server

Run the server on default port 5000:
```bash
sd run
```

Run the server on port 5003 with live reloading and skip building for the first time:
```bash
sd run --port 5003 --watch --skip-build
```

#### Running the tests

Build and run the tests:
```bash
sd test
```

#### Generating the documentation

Generate the documentation at `docs` and serve on port 5004:
```bash
sd docs -s -p 5004
```
