import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { loadRemoteModule } from '@angular-architects/module-federation';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-federated-compliance',
  template: `
    <div *ngIf="loading" style="padding: 20px;">
      <h2>Loading Compliance Dashboard...</h2>
    </div>
    <div *ngIf="error" style="color: red; padding: 20px;">
      <h3>Error Loading Dashboard</h3>
      <p>{{ errorMessage }}</p>
    </div>
    <div *ngIf="!loading && !error">
      <p>Web component should appear below:</p>
      <compliance-mfe
        style="display: block; width: 100%; height: 800px;"
      ></compliance-mfe>
    </div>
  `,
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FederatedComplianceComponent implements OnInit {
  loading = true;
  error = false;
  errorMessage = '';

  constructor() {
    console.log('FederatedComplianceComponent initialized');
  }

  async ngOnInit() {
    try {
      this.loading = true;
      console.log('Loading compliance web component...');
      console.log(
        'Remote entry URL:',
        'http://localhost:4202/assets/remoteEntry.js'
      );

      // Load the web component
      const module = await loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4202/assets/remoteEntry.js',
        exposedModule: './ComplianceWC',
      });

      console.log('Module loaded successfully:', module);

      // Check if the custom element is defined
      const isDefined = customElements.get('compliance-mfe');
      console.log('Is compliance-mfe defined?', !!isDefined);

      this.loading = false;
      console.log('Compliance web component loaded successfully');
    } catch (error) {
      this.loading = false;
      this.error = true;
      this.errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to load compliance web component:', error);
    }
  }
}
