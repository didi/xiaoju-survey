export function outputCatch({ showErrorStack }: { showErrorStack: boolean }) {
    return async function (ctx, next) {
        try {
            await next()
        } catch (err) {
            const outputData = { ...err }
            if (showErrorStack) {
                outputData.stack = err.stack;
            }
            return ctx.body = outputData
        }
    }
}