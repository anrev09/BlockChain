const SHA256 = require("crypto-js/sha256");

var currentdate = new Date();

class Block {
    constructor(id,data,previousHash) {
        this.id = id;
        this.previousHash = previousHash;
        this.timestamp = currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/"
                + currentdate.getFullYear() + " @ "
                + currentdate.getHours() + ":"
                + currentdate.getMinutes() + ":"
                + currentdate.getSeconds();
        this.data = data;
        this.hash = this.getHash();
    }

    getHash() {
      return SHA256(this.id + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}


class Blockchain{
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        return new Block(0,"Start", "0");
    }

    getLastBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLastBlock().hash;
        newBlock.hash = newBlock.getHash();
        this.chain.push(newBlock);
    }

    isValid(){
        for(var i=1;i < this.chain.length ; i++){
            if(this.chain[i].hash != this.chain[i].getHash()){
                return false;
            }

            if(this.chain[i].previousHash != this.chain[i-1].hash){
                return false;
            }
            return true;
        }
    }
}

//testing

let bchain = new Blockchain();
bchain.addBlock(new Block(1,{ amount: 1000, sender: "Anthony", receiver: "Sasha"}));
bchain.addBlock(new Block(2,{ amount: 25, sender: "Luis", receiver: "Carlos" }));
console.log(JSON.stringify(bchain,null,3));
console.log("Block Chain Valid (T/F): " + bchain.isValid());


console.log("--------------------------");
console.log("Modifying block 1...");
bchain.chain[1].data.amount = 50000;
console.log(JSON.stringify(bchain.chain[1],null,3));
console.log("Block Chain Valid (T/F): " + bchain.isValid());
