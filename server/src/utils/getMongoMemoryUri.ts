import { MongoMemoryServer } from 'mongodb-memory-server'

let mongoMemeryInstance
export async function getMongoMemoryUri () {
  if (!mongoMemeryInstance) {
    mongoMemeryInstance =  await MongoMemoryServer.create()
  }
  
  return mongoMemeryInstance.getUri()
}