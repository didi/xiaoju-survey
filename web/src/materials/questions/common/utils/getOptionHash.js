function getRandom(len) {
  return Math.random()
    .toString()
    .slice(len && typeof len === 'number' ? 0 - len : -6);
}
export default class GetHash {
  constructor() {
    this.hashMap = {};
  }

  getHash(len) {
    let random = getRandom(len);
    while (random in this.hashMap) {
      random = getRandom(len);
    }
    this.hashMap[random] = true;
    return random;
  }
}

const hashGen = new GetHash();

export { hashGen };
