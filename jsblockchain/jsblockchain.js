const SHA256=require('crypto-js/sha256');

class transaction{
    constructor(fromAddress,toAddress,amount){
        this.fromAddress=fromAddress;
        this.toAddress=toAddress;
        this.amount=amount;
    }
}

class Block{
    constructor(timestamp,transactions,previousHash=' '){
        this.timestamp=timestamp;
        this.transactions = transactions;
        this.previousHash=previousHash;
        this.hash=this.calculateHash();  
        this.nonce=0;      
    }

    calculateHash(){
        return SHA256(this.timestamp + this.previousHash + JSON.stringify(this.transaction)+this.nonce).toString();
    }

    mineNewBlock(difficulty){
        while(this.hash.substring(0,difficulty)!==Array(difficulty+1).join("0")){
            this.nonce++;
            this.hash=this.calculateHash();
        }
        console.log("A new block was mined with hash "+this.hash);
        
    }
}

class BlockChain{
    constructor(){
        this.chain=[this.createGenesisBlock()];
        this.difficulty=2;
        this.pendingTransactions=[];
        this.miningReward=10;
    }

    createGenesisBlock(){
        return new Block("01/01/2018","This is the genesis block","0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }

    //Previous method to add a block
    // addBlock(newBlock){
    //     newBlock.previousHash=this.getLatestBlock().hash;  
    //     newBlock.mineNewBlock(this.difficulty);      
    //     this.chain.push(newBlock);
    // }

    minePendingTransactions(miningRewardAddress){
        let block=new Block(Date.now(),this.pendingTransactions,this.getLatestBlock().hash);
        block.mineNewBlock(this.difficulty);
        console.log("Block mined successfully");
        this.chain.push(block);
        this.pendingTransactions=[
            new transaction(null,miningRewardAddress,this.miningReward)
        ];        
    }

    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }

    getBalanceofAddress(address){
        let balance=0;
        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress===address){
                    balance=balance-trans.amount;
                }

                if(trans.toAddress===(address)){
                    balance=balance+trans.amount;
                }
            }
        }
        return balance;
    }

    checkValidBlockChainValid(){
        for(var i=1;i<this.chain.length;i++){
            const curentBlock=this.chain[i];
            const previousBlock=this.chain[i-1];
            if(curentBlock.hash!==curentBlock.calculateHash()){
                
                return false;
            }
            
            if(curentBlock.previousHash!==previousBlock.hash){
                 
                console.log("aman2");
                return false;
            }
        }

        return true;
    }
}


let bittyCoin = new BlockChain();

transaction1=new transaction("Tom","Jerry",100);
bittyCoin.createTransaction(transaction1);

console.log("Started mining by miner");
bittyCoin.minePendingTransactions("Donald");

transaction2=new transaction("Jerry","Tom",30);
bittyCoin.createTransaction(transaction2);

console.log("Started mining by miner");
bittyCoin.minePendingTransactions("Donald");

console.log("Balance for Tom is "+bittyCoin.getBalanceofAddress("Tom"));
console.log("Balance for Jerry is " + bittyCoin.getBalanceofAddress("Jerry"));
console.log("Balance for miner is " + bittyCoin.getBalanceofAddress("Donald"));

console.log("Started mining by miner");
bittyCoin.minePendingTransactions("Donald");
console.log("Balance for miner is " + bittyCoin.getBalanceofAddress("Donald"));

console.log(JSON.stringify(bittyCoin,null,4));


