import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private config: any;
  private configLoaded = false;

  constructor(private http: HttpClient) {
    console.log('\n\nConfigService initialized');
  }

  async loadConfig(): Promise<void> {
    if (this.configLoaded) {
      console.log('\n\nConfig already loaded');
      return;
    }

    try {
      // Add cache busting parameter
      const timestamp = new Date().getTime();
      const configUrl = `/assets/config.json?t=${timestamp}`;
      
      console.log('\n\n%c Attempting to load config from ' + configUrl, 'color: red; font-weight: bold');
      const response = await firstValueFrom(this.http.get(configUrl));
      console.log('\n\n%c Raw config response:', 'color: green', response);
      
      this.config = response;
      this.configLoaded = true;
      
      if (!this.config?.apiUrl) {
        console.error('\n\nAPI URL not found in config. Config object:', this.config);
        throw new Error('API URL not found in config');
      }
      
      console.log('\n\n%c Config loaded successfully with API URL:', 'color: green; font-weight: bold', this.config.apiUrl);
      
      // Check if there's also a manually hardcoded URL
      if (this.config?.apiUrl2) {
        console.warn('\n\n%c Found secondary API URL in config:', 'color: orange; font-weight: bold', this.config.apiUrl2);
      }
    } catch (error) {
      console.error('\n\nError loading config:', error);
      throw error;
    }
  }

  get apiUrl(): string {
    if (!this.configLoaded) {
      console.error('\n\nConfig not loaded yet');
      throw new Error('Config not loaded yet');
    }
    
    if (!this.config?.apiUrl) {
      console.error('\n\nAPI URL not available in config');
      throw new Error('API URL not available in config');
    }
    
    console.log('\n\n%c Using API URL from config:', 'color: green', this.config.apiUrl);
    return this.config.apiUrl;
  }
} 