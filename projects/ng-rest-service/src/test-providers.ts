import { provideHttpClientTesting } from '@angular/common/http/testing';
import { EnvironmentProviders, Provider } from '@angular/core';
import { provideRouter } from '@angular/router';

const testProviders: (Provider | EnvironmentProviders)[] = [
  provideHttpClientTesting(),
  provideRouter([]),
];

export default testProviders;
