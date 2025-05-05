const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

/**
 * This function creates a dynamic import promise for each remote based on the URL.
 * It's used instead of a direct URL to support runtime configuration of remotes.
 */
function createRemoteUrlHandler(remoteName) {
  return `promise new Promise(resolve => {
    // Check if remoteConfig is available in window
    if (window.remoteConfig && window.remoteConfig['${remoteName}Remote']) {
      const remoteUrl = window.remoteConfig['${remoteName}Remote'];
      const script = document.createElement('script');
      script.src = remoteUrl;
      script.onload = () => {
        // Once the script is loaded, resolve with the global[remoteName] which should be the remote's container
        const remote = window['${remoteName}'];
        resolve(remote);
      };
      script.onerror = (error) => {
        console.error('Error loading remote ${remoteName}:', error);
        resolve(null); // Resolve with null on error to prevent blocking the application
      };
      document.head.appendChild(script);
    } else {
      // Fallback to environment or dev defaults if remoteConfig is not available
      console.warn('Remote config not found for ${remoteName}, using fallback URL');
      const fallbackUrl = 'http://localhost:420' + 
        (remoteName === 'compliance' ? '2' : remoteName === 'infrastructure' ? '3' : '4') + 
        '/remoteEntry.js';
      const script = document.createElement('script');
      script.src = fallbackUrl;
      script.onload = () => {
        const remote = window['${remoteName}'];
        resolve(remote);
      };
      script.onerror = () => {
        console.error('Failed to load remote ${remoteName} from fallback URL');
        resolve(null);
      };
      document.head.appendChild(script);
    }
  })`;
}

module.exports = {
  output: {
    publicPath: "auto",
  },
  optimization: {
    runtimeChunk: false,
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "shell",
      remotes: {
        compliance: createRemoteUrlHandler('compliance'),
        infrastructure: createRemoteUrlHandler('infrastructure'),
        summary: createRemoteUrlHandler('summary'),
      },
      shared: {
        "@angular/core": { singleton: true, strictVersion: true },
        "@angular/common": { singleton: true, strictVersion: true },
        "@angular/router": { singleton: true, strictVersion: true },
        "@angular/forms": { singleton: true, strictVersion: true },
        rxjs: { singleton: true, strictVersion: true },
      },
    }),
  ],
};
