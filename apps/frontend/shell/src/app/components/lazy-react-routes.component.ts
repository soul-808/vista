import {
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
  AfterViewInit,
} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/module-federation';
import { createRoot } from 'react-dom/client';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lazy-react-routes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div *ngIf="loading" style="padding: 20px;">
      <h2>Loading Compliance Dashboard...</h2>
    </div>
    <div
      *ngIf="error"
      style="color: red; padding: 20px; border: 1px solid red;"
    >
      <h3>Error Loading Dashboard</h3>
      <p>{{ errorMessage }}</p>
      <pre>{{ errorDetails }}</pre>
    </div>
    <!-- React container - always present in DOM but may be hidden -->
    <div
      #reactContainer
      style="height: 100%; width: 100%; display: none;"
    ></div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class LazyReactRoutesComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('reactContainer', { static: true })
  containerRef!: ElementRef;

  loading = true;
  error = false;
  errorMessage = '';
  errorDetails = '';
  private appComponent: any;
  private routeSub?: Subscription;
  private root?: any;

  constructor(private route: ActivatedRoute, private router: Router) {}

  async ngOnInit() {
    try {
      this.loading = true;
      console.log('LazyReactRoutesComponent initialized');

      // Fetch remotes.json at runtime
      const response = await fetch('/assets/remotes.json');
      const remotes = await response.json();
      const remoteEntryUrl = remotes['compliance'];

      // Load the remote App component from MFE
      const remoteModule = await loadRemoteModule({
        type: 'module',
        remoteEntry: remoteEntryUrl,
        exposedModule: './App',
      });

      console.log('Remote module loaded:', remoteModule);

      // Get the App component - handle both default export formats
      this.appComponent = remoteModule.default || remoteModule;

      console.log(
        'Remote module loaded successfully. AppComponent:',
        this.appComponent
      );

      if (!this.appComponent) {
        throw new Error(
          'AppComponent is undefined. Default export may be missing from App.tsx'
        );
      }

      // We'll render in ngAfterViewInit when the container is guaranteed to be available
    } catch (error) {
      this.loading = false;
      this.error = true;

      // Detailed error handling
      if (error instanceof Error) {
        this.errorMessage = error.message;
        this.errorDetails = error.stack || '';
      } else {
        this.errorMessage = 'Unknown error loading React app';
        this.errorDetails = JSON.stringify(error, null, 2);
      }

      console.error('Error loading remote React routes:', error);
    }
  }

  ngAfterViewInit() {
    if (this.error || !this.appComponent) {
      console.error('Cannot render: error or missing appComponent', {
        error: this.error,
        appComponent: !!this.appComponent,
      });
      return;
    }

    try {
      console.log('Container ref:', this.containerRef);
      console.log('Container element:', this.containerRef.nativeElement);

      if (!this.containerRef) {
        throw new Error('Container reference is not available');
      }

      // Make the container visible
      this.containerRef.nativeElement.style.display = 'block';
      console.log('Set container to visible');

      // Get the current route path
      const fullPath = this.router.url;
      const relativePath = fullPath.startsWith('/compliance/')
        ? fullPath.substring('/compliance'.length)
        : '/';

      console.log('Initializing React app with path:', relativePath);

      // Create the root and render the app
      this.root = createRoot(this.containerRef.nativeElement);
      console.log('Created React root');

      // Actually render the component
      console.log('About to render React app with props:', {
        initialPath: relativePath,
        standalone: false,
      });
      this.root.render(
        this.appComponent({ initialPath: relativePath, standalone: false })
      );
      console.log('React app rendered');

      // Subscribe to route changes to update the React app
      this.routeSub = this.router.events.subscribe(() => {
        if (!this.root) return;

        const currentUrl = this.router.url;
        if (currentUrl.startsWith('/compliance')) {
          const newPath = currentUrl.startsWith('/compliance/')
            ? currentUrl.substring('/compliance'.length)
            : '/';

          console.log('Route changed, updating React app with path:', newPath);
          this.root.render(
            this.appComponent({ initialPath: newPath, standalone: false })
          );
        }
      });

      this.loading = false;
    } catch (error) {
      this.loading = false;
      this.error = true;

      // Detailed error handling
      if (error instanceof Error) {
        this.errorMessage = error.message;
        this.errorDetails = error.stack || '';
      } else {
        this.errorMessage = 'Unknown error loading React app';
        this.errorDetails = JSON.stringify(error, null, 2);
      }

      console.error('Error in ngAfterViewInit:', error);
    }
  }

  ngOnDestroy() {
    // Clean up subscriptions
    this.routeSub?.unsubscribe();

    // Unmount React component if root exists
    if (this.root) {
      this.root.unmount();
    }
  }
}
