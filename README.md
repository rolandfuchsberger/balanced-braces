# Balanced Braces

## Requirements
- Validates if an expression has balanced braces - i.e. every opened braces is closed in the inverse order (e.g. `{test()}` is balanced whereas `{test(})` is unbalanced)
- Utilizes a backend service for computing if the expression has balanced braces
- Has a serverless/backendless configuration to allow development without the need of a running backend service
- Use different concepts to implement the requirements with the angular framework
- Extraction of API endpoint configuration to allow modification without the need of a rebuild
- High unit test test coverage
- E2E tests for main use cases
- CI/CD pipeline for automatic lint, test and deployment
- Docker build image

## Special features
- 100% unit test coverage
- CI/CD pipeline with travis
- Deployment to github page (https://rolandfuchsberger.github.io/balanced-braces/)

## Environments

The setting for the environments are split up in two different files:
- environments/environment.*ts: These configurations hold build-time configuration options.
- environments/*/env.js: These files hold configurations that are modifyable after the build (for the idea, see: https://www.jvandemo.com/how-to-use-environment-variables-to-configure-your-angular-application-without-a-rebuild/). 

There are 4 different configs defined for the build process (see angular.json):

- __default__: Used for production builds. Uses environment.prod.ts and environments/prod/env.js. Default config for ng build.
- __local__: Used for testing with a local backend. Uses environment.ts and environments/local/env.js. Similar to config used for ng test.
- __serverless__: Used for serverless / backendless development. All api requests are intercepted and fake responses are returned. Uses environment.serverless.ts and environments/local/env.js. Default config for ng serve. 
- __e2e__: Used for e2e testing. Basically this config uses the same settings as `serverless`, but removes the fake repsonse delay to speed up e2e tests. Uses environment.e2e.ts and environments/local/env.js.

These configurations can be used both for ng server and ng build.

## Further Optimizations
- Speed up builds by using cached docker images (see http://rundef.com/fast-travis-ci-docker-build) and possibly reduce parallelization.
- Build docker image in CI/CD and push to repo
- XSRF headers

## Key Concepts Included
- Validators
- Reactive forms
- Directives
- ngModel / two way data binding
- Pipes (async pipe)
- RxJS + debouncing
- HttpClient + HttpInterceptor
- Dependency injection (especially for testing)
- Jasmine unit testing w/ spys, fakeAsync
- E2E testing using Protractor
- CI/CD pipeline
- Docker build image (including multistage builds)

## Other Key Concepts not Included
- Router + lazy loding
- Service Worker / PWA
- SSR
- Authorization
- Dynamic components / forms
- Other unit test frameworks (namely Jest)

---

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
