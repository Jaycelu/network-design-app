// src/types/electron.d.ts

/**
 * Extends the global Window interface with the APIs
 * exposed from the Electron preload script.
 */
export declare global {
  interface Window {
    electronAPI: {
      openFolderDialog: () => Promise<string | null>;
      getNetworkInterfaces: () => Promise<any[]>; // You can define a stricter type for interfaces
    };
  }
}
