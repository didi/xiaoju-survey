export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // mongo
      XIAOJU_SURVEY_MONGO_URL: string;
      XIAOJU_SURVER_MONGO_DBNAME: string;

      // session
      XIAOJU_SURVEY_SESSION_EXPIRE_TIME: string;

      // encrypt
      XIAOJU_SURVEY_ENCRYPT_TYPE: string;
      XIAOJU_SURVEY_ENCRYPT_SECRET_KEY: string;
      XIAOJU_SURVEY_ENCRYPT_TYPE_LEN: string;

      // jwt
      XIAOJU_SURVEY_JWT_SECRET: string;
      XIAOJU_SURVEY_JWT_EXPIRES_IN: string;
    }
  }
}
