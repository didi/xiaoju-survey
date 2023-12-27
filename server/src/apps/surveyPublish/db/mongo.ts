import { getConfig } from '../config/index';
import MongoService from '../../../utils/mongoService';

const config = getConfig();

export const mongo = new MongoService({ url: config.mongo.url, dbName: config.mongo.dbName });