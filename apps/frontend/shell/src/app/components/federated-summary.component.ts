import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { loadRemoteModule } from '@angular-architects/module-federation';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-federated-summary',
  template: `
    <div *ngIf="loading" style="padding: 20px;">
      <h2>Loading Executive Summary...</h2>
    </div>
    <div *ngIf="error" style="color: red; padding: 20px;">
      <h3>Error Loading Summary</h3>
      <p>{{ errorMessage }}</p>
    </div>
    <div *ngIf="!loading && !error" class="summary-container">
      <summary-mfe
        style="display: block; width: 100%; height: calc(100vh - 85.98px);"
      ></summary-mfe>
    </div>
  `,
  styles: [
    `
      .summary-container {
        width: 100%;
        overflow: hidden;
        position: relative;
      }
    `,
  ],
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FederatedSummaryComponent implements OnInit {
  loading = true;
  error = false;
  errorMessage = '';

  constructor() {
    console.log('FederatedSummaryComponent initialized');
  }

  async ngOnInit() {
    try {
      this.loading = true;
      console.log('Loading summary web component...');

      // Determine if we're in development or production mode
      const isDev = window.location.hostname === 'localhost';
      const remoteEntryUrl = isDev
        ? 'http://localhost:4203/remoteEntry.js'
        : 'http://localhost:4203/assets/remoteEntry.js';

      console.log('Environment:', isDev ? 'Development' : 'Production');
      console.log('Remote entry URL:', remoteEntryUrl);

      // Load the web component
      const module = await loadRemoteModule({
        type: 'module',
        remoteEntry: remoteEntryUrl,
        exposedModule: './SummaryWC',
      });

      console.log('Module loaded successfully:', module);

      // Check if the custom element is defined
      const isDefined = customElements.get('summary-mfe');
      console.log('Is summary-mfe defined?', !!isDefined);

      this.loading = false;
      console.log('Summary web component loaded successfully');
    } catch (error) {
      this.loading = false;
      this.error = true;
      this.errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to load summary web component:', error);
    }
  }
}
