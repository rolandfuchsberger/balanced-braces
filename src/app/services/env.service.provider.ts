import { EnvService } from './env.service';

export const EnvServiceFactory = () => {
  // Create env
  const env = new EnvService();

  // Read environment variables from browser window
  const browserWindow: any = window;

  if (browserWindow && browserWindow.__env) {
    const browserWindowEnv = browserWindow.__env;

    // Assign environment variables from browser window to env
    // In the current implementation, properties from env.js overwrite defaults from the EnvService.
    // If needed, a deep merge can be performed here to merge properties instead of overwriting them.
    Object.keys(browserWindowEnv).forEach( key => {
      if (env.hasOwnProperty(key)) {
        env[key] = browserWindowEnv[key];
      }
    });
  }

  return env;
};

export const EnvServiceProvider = {
  provide: EnvService,
  useFactory: EnvServiceFactory,
  deps: [],
};
