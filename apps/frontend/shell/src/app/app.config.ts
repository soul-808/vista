import {
  ApplicationConfig,
  provideZoneChangeDetection,
  APP_INITIALIZER,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { ConfigService } from './config.service';
import { authInterceptor } from './auth/auth.interceptor';
import { FederatedComplianceComponent } from './components/federated-compliance.component';
import { FederatedSummaryComponent } from './components/federated-summary.component';
import { FederatedInfrastructureComponent } from './components/federated-infrastructure.component';

export function loadConfigFactory(configService: ConfigService) {
  return () => configService.loadConfig();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideClientHydration(withEventReplay()),
    ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfigFactory,
      deps: [ConfigService],
      multi: true,
    },
  ],
};
