// Installation Control utility for LocalYodis
// Prevents PWA installation and redirects to Google Play Store

export class InstallationController {
  private static instance: InstallationController;
  private installPromptEvent: any = null;
  private readonly playStoreUrl = 'https://play.google.com/store/apps/details?id=app.vercel.localyodis.twa';

  private constructor() {
    this.initializeInstallationControl();
  }

  public static getInstance(): InstallationController {
    if (!InstallationController.instance) {
      InstallationController.instance = new InstallationController();
    }
    return InstallationController.instance;
  }

  private initializeInstallationControl() {
    // Prevent the default PWA install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('PWA install prompt prevented - redirecting to Play Store');
      
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      
      // Store the event for potential future use
      this.installPromptEvent = e;
      
      // Show custom message or redirect to Play Store
      this.showPlayStoreRedirection();
    });

    // Listen for successful app installation
    window.addEventListener('appinstalled', () => {
      console.log('App was installed from Play Store');
      this.installPromptEvent = null;
    });
  }

  private showPlayStoreRedirection() {
    // Create a subtle notification to redirect users to Play Store
    const notification = this.createPlayStoreNotification();
    document.body.appendChild(notification);

    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 10000);
  }

  private createPlayStoreNotification(): HTMLElement {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4285f4;
      color: white;
      padding: 16px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 10000;
      max-width: 300px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      line-height: 1.4;
      animation: slideIn 0.3s ease-out;
    `;

    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px;">
        <div style="flex: 1;">
          <div style="font-weight: 600; margin-bottom: 4px;">
            Instalar LocalYodis
          </div>
          <div style="opacity: 0.9; font-size: 12px;">
            Descarga la aplicación desde Google Play Store para la mejor experiencia
          </div>
        </div>
        <button onclick="window.open('${this.playStoreUrl}', '_blank')" 
                style="background: white; color: #4285f4; border: none; padding: 8px 12px; border-radius: 4px; font-weight: 600; cursor: pointer; font-size: 12px;">
          Abrir
        </button>
        <button onclick="this.parentNode.parentNode.remove()" 
                style="background: transparent; color: white; border: none; font-size: 18px; cursor: pointer; padding: 4px; line-height: 1;">
          ×
        </button>
      </div>
    `;

    // Add the animation keyframes to the document if not already added
    if (!document.querySelector('#slideInAnimation')) {
      const style = document.createElement('style');
      style.id = 'slideInAnimation';
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }

    return notification;
  }

  // Method to manually trigger Play Store redirection
  public redirectToPlayStore(): void {
    window.open(this.playStoreUrl, '_blank');
  }

  // Check if app is running as PWA (to show different UI)
  public isRunningAsPWA(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches || 
           (window.navigator as any).standalone === true ||
           document.referrer.includes('android-app://');
  }

  // Check if app is running inside TWA
  public isRunningAsTWA(): boolean {
    return document.referrer.includes('android-app://');
  }

  // Get installation context
  public getInstallationContext(): string {
    if (this.isRunningAsTWA()) {
      return 'twa'; // Trusted Web Activity (from Play Store)
    } else if (this.isRunningAsPWA()) {
      return 'pwa'; // Progressive Web App
    } else {
      return 'browser'; // Regular browser
    }
  }

  // Method to show different UI based on installation context
  public shouldShowInstallPrompt(): boolean {
    const context = this.getInstallationContext();
    
    // Only show install prompts if running in browser (not PWA or TWA)
    return context === 'browser';
  }

  // Block PWA installation programmatically
  public blockPWAInstallation(): void {
    // Cancel any stored install prompt
    if (this.installPromptEvent) {
      this.installPromptEvent = null;
    }

    // Override any potential install methods
    if ('serviceWorker' in navigator) {
      // Prevent registration of install prompts through service worker
      const originalRegister = navigator.serviceWorker.register;
      navigator.serviceWorker.register = function(...args) {
        console.log('Service worker registration intercepted');
        return originalRegister.apply(this, args);
      };
    }
  }

  // Utility to track installation source
  public trackInstallationAttempt(source: 'browser' | 'play_store' | 'other'): void {
    const event = {
      type: 'installation_attempt',
      source,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      context: this.getInstallationContext()
    };

    // Store in localStorage for analytics
    const attempts = JSON.parse(localStorage.getItem('installation_attempts') || '[]');
    attempts.push(event);
    
    // Keep only last 10 attempts
    if (attempts.length > 10) {
      attempts.splice(0, attempts.length - 10);
    }
    
    localStorage.setItem('installation_attempts', JSON.stringify(attempts));
    
    console.log('Installation attempt tracked:', event);
  }
}

// Export singleton instance
export const installationController = InstallationController.getInstance();

// Hook for React components
export function useInstallationControl() {
  const [context] = React.useState(() => installationController.getInstallationContext());
  const [isPWA] = React.useState(() => installationController.isRunningAsPWA());
  const [isTWA] = React.useState(() => installationController.isRunningAsTWA());

  return {
    context,
    isPWA,
    isTWA,
    redirectToPlayStore: installationController.redirectToPlayStore.bind(installationController),
    shouldShowInstallPrompt: installationController.shouldShowInstallPrompt(),
    trackInstallationAttempt: installationController.trackInstallationAttempt.bind(installationController)
  };
}

// Add React import for the hook
import React from 'react';
