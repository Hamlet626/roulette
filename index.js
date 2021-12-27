const web3 = require("@solana/web3.js");
const { getReturnAmount, totalAmtToBePaid, randomNumber } = require('./helper');
const {getWalletBalance,transferSOL,airDropSol}=require("./solana");

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});

const getInput = (q) => {
    return new Promise((resolve, reject) => {
        readline.question(q, async (input) => {
            resolve(input);});});
};

const userWallet=web3.Keypair.generate();
console.log(userWallet);
const adminWallet=web3.Keypair.generate();
// const userWallet=web3.Keypair.fromSecretKey(Uint8Array.from(userSecretKey));


runGame=async()=>{
    await airDropSol(userWallet.publicKey,2);
    let continu=true;
    while (continu){
        console.log("the max bidding amount is 2.5 sole here");
        let a=10;
        while (a>2.5){
            a=await getInput("what is the amount of sol you want to stake?");
            a=Number.parseFloat(a);
        }
        let r=await getInput("what is the ratio of your staking?");
        r=Number.parseFloat(r.substr(2));
        let pa=totalAmtToBePaid(a,r);
        let usrB=await getWalletBalance(userWallet.publicKey);
        if(pa>usrB){
            console.log("insufficient coin, game end");
            continu=false;
            break;
        }
        let ra=getReturnAmount(a,r);
        let adminB=await getWalletBalance(adminWallet.publicKey);
        while (adminB<ra){
            await airDropSol(adminWallet.publicKey,2);
            adminB=await getWalletBalance(adminWallet.publicKey);
        }
        console.log(`you will get ${ra} if guessing the number correctly`);
        let n=await getInput("Guess a number from 1-5?");
        n=Number.parseInt(n);
        let gnrN=randomNumber(1,5);
        if(n===gnrN){
            console.log("your guessing is correct");
            await transferSOL(adminWallet,userWallet,ra);}
        else{
            console.log(`your guessing is incorrect,should be ${gnrN}`);
            await transferSOL(userWallet,adminWallet,pa);}
    }};

runGame();