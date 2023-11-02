const base58KeysObject = {
    "1":0,"2":1,"3":2,"4":3,"5":4,"6":5,"7":6,"8":7,"9":8,
    "A":9,"B":10,"C":11,"D":12,"E":13,"F":14,"G":15,"H":16,"J":17,
    "K":18,"L":19,"M":20,"N":21,"P":22,"Q":23,"R":24,"S":25,"T":26,
    "U":27,"V":28,"W":29,"X":30,"Y":31,"Z":32,
    "a":33,"b":34,"c":35,"d":36,"e":37,"f":38,"g":39,"h":40,"i":41,"j":42,
    "k":43,"m":44,"n":45,"o":46,"p":47,"q":48,"r":49,"s":50,"t":51,
    "u":52,"v":53,"w":54,"x":55,"y":56,"z":57
};
const base58Keys = Object.keys(base58KeysObject);
const base58Len = 58n;

export function hex2Base58(hexNum:string):string
{
    let base58NumArray =[];
    let bigHexNumber = BigInt(`0x${hexNum}`);
    while (bigHexNumber>=58n)
    {
        base58NumArray.unshift(base58Keys[(bigHexNumber % base58Len).toString()]);
        bigHexNumber = bigHexNumber / base58Len;
    }
    base58NumArray.unshift(base58Keys[bigHexNumber.toString()]);
    return base58NumArray.join('');
}

export function base582Hex(base58Num:string):string
{
    let base58NumArray =base58Num.split('');
    let big58Number = 0n;
    let len = base58NumArray.length;
    for(let i = 1;i<=len;i++)
    {
        let big58NumberTemp = BigInt(base58KeysObject[base58NumArray[len-i]])*(base58Len** BigInt(i-1));
        big58Number += big58NumberTemp;
    }
    return big58Number.toString(16);
}