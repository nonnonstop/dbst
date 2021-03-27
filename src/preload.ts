import {contextBridge, ipcRenderer} from 'electron';

contextBridge.exposeInMainWorld(
    'dbst',
    {
      getData: async (): Promise<DbstData> => {
        return ipcRenderer.invoke('get-data', null);
      },
    },
);
