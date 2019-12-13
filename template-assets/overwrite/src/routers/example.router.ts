// You can import routers in this directory with path alias @steroids/router/*
import {
  Router,
  OnInjection,
  OnConfig,
  ServerConfig,
  ServerError,
  RouteMethod,
  query,
  header,
  body,
  type,
  len,
  and
} from '@steroids/core';

import { Request, Response, NextFunction } from 'express';

@Router({
  name: 'example',
  priority: 100,
  routes: [
    // Global middleware with query verification
    { path: '*', handler: 'authHandler', validate: [
      query(['token'])
    ]},
    // Protected route with header and body verification
    { path: 'protected-route', method: RouteMethod.GET, handler: 'endpointHandler', validate: [
      header({
        'content-type': 'application/json'
      }),
      body({
        prop1: and(type.string, len.min(1)),
        prop2: type.array(type.number, len.range(1, 10))
      })
    ]}
  ]
})
export class ExampleRouter implements OnInjection, OnConfig {

  private config: ServerConfig;

  onInjection(services: any) {

    // Inject other services (e.g. this.auth = services.auth)

  }

  onConfig(config: ServerConfig) {

    // Inject config
    this.config = config;

  }

  // Authentication middleware
  authHandler(req: Request, res: Response, next: NextFunction) {

    // Do authentication...
    // if ( ! auth ) return res.status(401).json(new ServerError('Authentication failed!', 'AUTH_FAIL'));
    next();

  }

  // Endpoint handler
  endpointHandler(req: Request, res: Response) {

    // Already authenticated
    // Body already validated
    res.send('OK');

  }

}
