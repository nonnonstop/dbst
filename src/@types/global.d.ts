declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    dbst: ContextBridgeApi;
  }
}

export interface ContextBridgeApi {
  getData: () => Promise<DbstData>;
}
