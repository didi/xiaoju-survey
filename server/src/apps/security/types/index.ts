export enum DICT_TYPE {
    danger = "danger",
    secret = "secret",
}

export class CommonError extends Error {
    code: number
    errmsg: number
    constructor(msg, code = 500) {
        super(msg)
        this.errmsg = msg;
        this.code = code;
    }
}
