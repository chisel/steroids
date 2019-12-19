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

#### Creating a new project

Creates a new Steroid project:
```bash
sd new <name>
```

Creates a new Steroid project without examples:
```bash
sd new <name> --minimal
```

Creates a new Steroid project and skips installing dependencies with NPM:
```bash
sd new <name> --skip-npm-install
```

#### Adding a router

Adds a new router in the default `src/routers` directory:
```bash
sd add router <name>
```

Adds a new router in a specific directory (relative to `src`):
```bash
sd add router <name> --directory <path>
```

#### Adding a service

Adds a new service in the default `src/services` directory:
```bash
sd add service <name>
```

Adds a new service in a specific directory (relative to `src`):
```bash
sd add service <name> --directory <path>
```

#### Listing all path aliases

Displays a list of all path aliases defined in tsconfig.json:
```bash
sd path list
```

#### Creating a new path alias

Defines a new path alias in tsconfig.json that will be resolved automatically upon running the project (target must be relative to `src`):
```bash
sd path new <alias> <target>
```

#### Deleting a path alias

Deletes a path alias from tsconfig.json:
```bash
sd path delete <alias>
```

#### Generating the documentation

Generates the TypeDoc developer documentation at `/docs`:
```bash
sd docs
```

Generated the TypeDoc developer documentation at `/docs` and serves it on the specified port (defaults to 7000):
```bash
sd docs --serve [port_number]
```

#### Building the source code

Builds the source into `/dist`:
```bash
sd build
```

#### Running the server

Runs the server on default port 5000:
```bash
sd run
```

Runs the server on a specific port with live reloading:
```bash
sd run --port <port_number> --watch
```
