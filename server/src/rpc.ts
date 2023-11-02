export async function rpcInvote<P, R>(appServerName: string, params: P): Promise<R> {
    const appServerNameData = /^(\w+)\.(\w+)$/.exec(appServerName);
    if (!appServerNameData) {
        throw new Error('rpc调用必须按照app.function名方式填写，app和function名称只支持数字字母下划线')
    }
    const appName = appServerNameData[1];
    const serverName = appServerNameData[2];
    const App = require(`./apps/${appName}/index`).default
    const instance = new App()
    return await instance[serverName](params)
}