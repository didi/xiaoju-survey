export enum SURVEY_STATUS {
    new = "new",
    editing = "editing",
    pausing = "pausing",
    published = "published",
    removed = "removed",
}

export class CommonError extends Error {
    code:number
    errmsg:string
    constructor(msg,code=500) {
        super(msg)
        this.code = code;
        this.errmsg = msg;
    }
}