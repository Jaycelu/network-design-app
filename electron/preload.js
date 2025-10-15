const { contextBridge, ipcRenderer } = require('electron');

/**
 * The `contextBridge` is used to securely expose Node.js/Electron APIs
 * to the renderer process (your React app).
 * Only the APIs defined here will be accessible from the frontend.
 */
contextBridge.exposeInMainWorld('electronAPI', {
  /**
   * Invokes an IPC channel to open the system's folder selection dialog.
   * @returns {Promise<string | null>} A promise that resolves with the selected
   * folder path, or null if no folder was selected.
   */
  openFolderDialog: () => ipcRenderer.invoke('dialog:openFolder'),

  /**
   * Example of another API that was already in main.js
   * We can expose it here as well for the frontend to use.
   */
  getNetworkInterfaces: () => ipcRenderer.invoke('get-network-interfaces'),
});
