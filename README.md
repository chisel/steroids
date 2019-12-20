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
  - **sd add &lt;component&gt; &lt;name&gt; [options]**: Generates a router or service component under `src/routers` and `src/services` respectively. The component name should be in kebab case. If tests are setup, a test suite is also generated at `test/src/routers` or `test/src/services`.  
    Options:
    - **-d, --directory &lt;path&gt;**: A path relative to `src` to override the default component path.
    - **--skip-tests**: Skips generating test suite for the component.
  - **sd path &lt;operation&gt; [alias] [target]**: Manages TypeScript paths.  
    Operations:
    - **list**: Displays a list of all existing paths.
    - **new &lt;alias&gt; &lt;target&gt;**: Creates a new path (target must be relative to `src`).
    - **delete &lt;alias&gt;**: Deletes a path.
  - **sd build**: Builds the source into `dist`.
  - **sd run [options]**: Builds and runs the server.  
    Options:
    - **-p, --port &lt;port_number&gt;**: Overrides the port number.
    - **-w, --watch**: Enables live reloading by watching the source files for changes.
  - **sd test**: Builds and runs the tests against the last server build.
  - **sd docs [options]**: Generates the documentation using TypeDoc.  
    Options:
    - **-s, --serve [port_number]**: Serves the documentation on port 7000 or the given port number.
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
sd path new @steroids/validator/* validators/*.validator
```

Delete the models path:
```bash
sd path delete @steroids/models
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

Run the server on port 5003 with live reloading:
```bash
sd run --port 5003 --watch
```

#### Running the tests

Build and run the tests:
```bash
sd test
```

#### Generating the documentation

Generate the documentation at `docs` and serve on port 5004 with live reloading:
```bash
sd docs -p 5004 -w
```
