// You can import services in this directory with path alias @steroids/service/*
import { Service, OnInjection, OnConfig, ServerConfig } from '@steroids/core';

@Service({
  name: 'example'
})
export class ExampleService implements OnInjection, OnConfig {

  private config: ServerConfig;

  onInjection(services: any) {

    // Inject other services (e.g. this.auth = services.auth)

  }

  onConfig(config: ServerConfig) {

    // Inject config
    this.config = config;

  }

}
