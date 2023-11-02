export enum SURVEY_STATUS {
    new = "new",
    editing = "editing",
    pausing = "pausing",
    published = "published",
    removed = "removed",
}

export enum QUESTION_TYPE {
    enps = "enps",
    nps = "nps",
    question = "question", //通用问卷
    register = "register", //报名
    vote = "vote", //投票
}

export enum HISTORY_TYPE {
    dailyHis = "dailyHis", //保存历史
    publishHis = "publishHis", //发布历史
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