// Import Solana web3 functinalities
const {
    Connection,
    PublicKey,
    clusterApiUrl,
    LAMPORTS_PER_SOL,
    Transaction,
    SystemProgram,
    sendAndConfirmTransaction,
    Keypair
} = require("@solana/web3.js")

const TO_SECRETKEYARGS = 'to-secretkey'
const FROM_SECRETKEYARGS = 'from-secretkey'
const DEDUCT_PERCENTAGEARGS = 'ded-percent'

const DEFAULT_FROM_SECRETKEY = '9eeae4baaf215b0c8198fb97071d2e4da4cae9d7904af1cd80f6aa965d6948eba07290fa0c94bee885ba206f22af693a4911bd701d1388e90739064c147d3368'
const DEFAULT_TO_SECRETKEY = '6e8a8bbab312f8bb415c831ef88825e9ee7cf13c0f524fe765a4f8a95bcc100a851cb78c3e7da8e2ac95c4dd40ae7e8105f7251fdf1c6caab225d40b0656864b'
const DEFAULT_DEDUCT_PERCENTAGE = 50

var fromSecretKey = DEFAULT_FROM_SECRETKEY
var toSecretKey = DEFAULT_TO_SECRETKEY
var dedPercent = DEFAULT_DEDUCT_PERCENTAGE

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

// Get the wallet balance from a given private key
const getWalletBalance = async (publicKey, connection) => {
    let balance = 0

    try {
        // Validate Public Key from the param
        if (publicKey == null || publicKey == '') {
            console.log("Invalid Public Key")
            return 0
        }

        // Validate connection from the param
        if (connection == null) {
            console.log("Invalid Connection object")
            return 0
        }
        
        const walletBalance = await connection.getBalance(
            new PublicKey(publicKey)
        )
        
        balance = parseInt(walletBalance) / LAMPORTS_PER_SOL

        console.log(`Wallet balance for key ${publicKey}: ${balance} SOL`)

    } catch (err) {
        console.log(err)
    }

    return balance;
}

const transferSol = async(connection, fromWallet, toWallet, transferSolAmount) => {
    // Validate connection from the param
    if (connection == null) {
        console.log("Invalid Connection object")
        return
    }

    // Send money from "from" wallet and into "to" wallet
    var transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: fromWallet.publicKey,
            toPubkey: toWallet.publicKey,
            lamports: transferSolAmount * LAMPORTS_PER_SOL
        })
    )

    // Sign transaction
    var signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [fromWallet]
    )

    console.log('Signature is', signature)
}

const fetchValuesFromArgs = () => {
    let fromSecretKeyFromArgs = getValueFromArgs(FROM_SECRETKEYARGS)
    if (fromSecretKeyFromArgs != '') {
        fromSecretKey = fromSecretKeyFromArgs
    }

    let toSecretKeyFromArgs = getValueFromArgs(TO_SECRETKEYARGS)
    if (toSecretKeyFromArgs != '') {
        toSecretKey = toSecretKeyFromArgs
    }


    let dedPercentFromArgs = getValueFromArgs(DEDUCT_PERCENTAGEARGS)
    if (dedPercentFromArgs != '') {
        dedPercent = parseInt(dedPercentFromArgs)
    }
}

const createConnection = () => new Connection(clusterApiUrl("devnet"), "confirmed");

const connectToWallet = (secretKey) => Keypair.fromSecretKey(Uint8Array.from(Buffer.from(secretKey, 'hex')))

const mainFunction = async () => {
    fetchValuesFromArgs()

    // Connect to the Devnet
    const fromConnection = createConnection()
    console.log("Sender Connection object is:", fromConnection)
    const toConnection = createConnection()
    console.log("Receiver Connection object is:", toConnection)

    // Connect to wallets
    let fromWallet = connectToWallet(fromSecretKey)
    let toWallet = connectToWallet(toSecretKey)

    // Check the initial wallet balance for both sender and reciever
    console.log(`Checking initial balance for the sender wallet`)
    let fromBalance = await getWalletBalance(fromWallet.publicKey, fromConnection)

    console.log(`Checking initial balance for the receiver wallet`)
    await getWalletBalance(toWallet.publicKey, toConnection)

    // if balance is 0, then no SOL transfer to be done
    if (fromBalance == 0) {
        console.log(`Unable to transfer SOL. Sender's wallet balance is insufficient`)
        return
    }

    // Take the 50% or half of the sender wallet balance
    let partialBalanceAmount = (dedPercent / 100) * fromBalance
    console.log(`Sending ${partialBalanceAmount} from sender wallet`)
    
    await transferSol(fromConnection, fromWallet, toWallet, partialBalanceAmount)

    // Check the new wallet balance for both sender and reciever
    console.log(`Checking new balance for the sender wallet`)
    await getWalletBalance(fromWallet.publicKey, fromConnection)

    console.log(`Checking new balance for the receiver wallet`)
    await getWalletBalance(toWallet.publicKey, toConnection)
}

mainFunction()