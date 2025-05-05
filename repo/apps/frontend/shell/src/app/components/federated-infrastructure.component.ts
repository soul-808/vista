import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { loadRemoteModule } from '@angular-architects/module-federation';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-federated-infrastructure',
  template: `
    <div *ngIf="loading" style="padding: 20px;">
      <h2>Loading Infrastructure Dashboard...</h2>
    </div>
    <div *ngIf="error" style="color: red; padding: 20px;">
      <h3>Error Loading Dashboard</h3>
      <p>{{ errorMessage }}</p>
    </div>
    <div *ngIf="!loading && !error" class="infrastructure-container">
      <infrastructure-mfe
        style="display: block; width: 100%; height: 800px;"
      ></infrastructure-mfe>
    </div>
  `,
  styles: [
    `
      .infrastructure-container {
        width: 100%;
        position: relative;
      }
    `,
  ],
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FederatedInfrastructureComponent implements OnInit {
  loading = true;
  error = false;
  errorMessage = '';

  constructor() {
    console.log('FederatedInfrastructureComponent initialized');
  }

  async ngOnInit() {
    try {
      this.loading = true;
      console.log('Loading infrastructure web component...');

      // Determine if we're in development or production mode
      const isDev = window.location.hostname === 'localhost';
      const remoteEntryUrl = isDev
        ? 'http://localhost:4204/remoteEntry.js'
        : 'http://localhost:4204/assets/remoteEntry.js';

      console.log('Environment:', isDev ? 'Development' : 'Production');
      console.log('Remote entry URL:', remoteEntryUrl);

      // Load the web component
      const module = await loadRemoteModule({
        type: 'module',
        remoteEntry: remoteEntryUrl,
        exposedModule: './InfrastructureWC',
      });

      console.log('Module loaded successfully:', module);

      // Check if the custom element is defined
      const isDefined = customElements.get('infrastructure-mfe');
      console.log('Is infrastructure-mfe defined?', !!isDefined);

      this.loading = false;
      console.log('Infrastructure web component loaded successfully');
    } catch (error) {
      this.loading = false;
      this.error = true;
      this.errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to load infrastructure web component:', error);
    }
  }
}
