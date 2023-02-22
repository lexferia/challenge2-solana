// Import Solana web3 functinalities
const {
    Connection,
    PublicKey,
    clusterApiUrl,
    LAMPORTS_PER_SOL
} = require("@solana/web3.js");

// for e.g. publicKey: BoKZAvA2raHtMw9DxPowqdp6YBjNHxEbPvphwuxwrsuq

const PUBLICKEYARGS = 'publickey'
const SOL_AMOUNTARGS = 'sol-amount'

const DEFAULT_SOL_AMOUNT = 2

var publicKey = null
var solAmount = DEFAULT_SOL_AMOUNT

const getValueFromArgs = (argKey) => {
    keyValuePair = ''

    process.argv.forEach(pair => {
        if (pair.toLocaleLowerCase().includes(`${argKey.toLocaleLowerCase()}=`)) {
            keyValuePair = pair
        }
    })
    
    if (keyValuePair == '') {
        console.log(`Argument ${argKey} not found.`)
        return keyValuePair
    }
    
    return keyValuePair.split("=")[1]
}

const fetchPublicKeyFromArgs = () => {
    publicKey = getValueFromArgs(PUBLICKEYARGS)
}

const fetchSOLAmountFromArgs = () => {
    let solAmountFromArgs = getValueFromArgs(SOL_AMOUNTARGS)
    if (solAmountFromArgs != '') {
        solAmount = parseInt(solAmountFromArgs)
    }
}

const airDropSol = async (publicKey) => {
    try {
        // Connect to the Devnet and make a wallet from privateKey
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

        // Request airdrop of 2 SOL to the wallet
        console.log(`Airdropping ${solAmount} SOL to wallet ${publicKey}!`);
        const fromAirDropSignature = await connection.requestAirdrop(
            new PublicKey(publicKey),
            solAmount * LAMPORTS_PER_SOL
        );
        
        // Latest blockhash (unique identifer of the block) of the cluster
        let latestBlockHash = await connection.getLatestBlockhash();

        // Confirm transaction using the last valid block height (refers to its time)
        // to check for transaction expiration
        await connection.confirmTransaction({
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            signature: fromAirDropSignature
        });

        console.log("Airdrop completed for the Sender account");
    } catch (err) {
        console.log(err);
    }
};

// Show the wallet balance before and after airdropping SOL
const mainFunction = async () => {
    fetchPublicKeyFromArgs()
    fetchSOLAmountFromArgs()
    
    // Validate Public Key from the param
    if (publicKey == null || publicKey == '') {
        console.log("Invalid Public Key");
        return
    }

    await airDropSol(publicKey);
}

mainFunction();