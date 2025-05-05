import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { loadRemoteModule } from '@angular-architects/module-federation';

@Component({
  selector: 'app-federated-compliance',
  template: '<compliance-mfe></compliance-mfe>',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FederatedComplianceComponent {
  constructor() {
    loadRemoteModule({
      type: 'module',
      remoteEntry: 'http://localhost:4202/assets/remoteEntry.js',
      exposedModule: './ComplianceWC',
    });
  }
}
