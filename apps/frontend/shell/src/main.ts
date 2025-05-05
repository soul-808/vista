// Fetch remote configuration before bootstrapping the app
fetch('/assets/remotes.json')
  .then(response => response.json())
  .then(remotes => {
    // Store remotes in a global window property for access in the federation configuration
    // Using 'any' type cast to bypass TypeScript errors
    (window as any).remoteConfig = remotes;
    
    // Now import the bootstrap file to start the Angular app
    import('./bootstrap').catch(err => console.error('Bootstrap failed:', err));
  })
  .catch(error => {
    console.error('Failed to fetch remote configuration:', error);
    // Fall back to environment values or proceed with bootstrapping anyway
    import('./bootstrap').catch(err => console.error('Bootstrap failed:', err));
  });
