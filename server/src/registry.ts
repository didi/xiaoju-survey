class AppRegistry {
  private apps: Record<string, unknown>;

  constructor() {
    this.apps = {};
  }

  registerApp(name: string, service: unknown) {
    if (!this.apps[name]) {
      this.apps[name] = service;
    }
  }

  getApp(name: string) {
    return this.apps[name];
  }
}

const appRegistry = new AppRegistry();

export default appRegistry;
