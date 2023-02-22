# Challenge 2 - Solana
Solana - Transactions and Fees
## How to run
### Generate wallet
if didn't yet created a wallet, you just need to run the following in CLI:
```bash
    node generateWallet
```
then, you will get the following output:
```bash
    Public Key of the generated keypair {string}
    Secret Key (hex) of the generated keypair {string}
```
### Check wallet balance and airdrop Sol
run the following in CLI:
```bash
    node airDropSol publicKey={string}
```
By default, the default amount of SOL to be Airdrop is 2 but you can set the amount of sol as an argument. As shown in example below
```bash
    node airDropSol publicKey={string} sol-amount=4
```
then, you will find the following line below as a part of the output when it is successful
```bash
    Wallet balance: {sol-amount} SOL
```
### Transfer Sol from wallet to other wallet
In the code, there are secretKeys (in hex) that are set as default in the code
```bash
    const DEFAULT_FROM_SECRETKEY = '9eeae4baaf215b0c8198fb97071d2e4da4cae9d7904af1cd80f6aa965d6948eba07290fa0c94bee885ba206f22af693a4911bd701d1388e90739064c147d3368'
    const DEFAULT_TO_SECRETKEY = '6e8a8bbab312f8bb415c831ef88825e9ee7cf13c0f524fe765a4f8a95bcc100a851cb78c3e7da8e2ac95c4dd40ae7e8105f7251fdf1c6caab225d40b0656864b'
```
and also by default, the deduction percentage is also set as 50
then, if you want to transfer sol using the default wallets and deduction percentage, you just need to run the following in CLI:
```bash
    node index
```
But if you want to specify wallets and percentage of amount to be deducted in CLI, you need to specify them as arguments as shown below
```bash
    node index from-secretkey={secretKey} to-secretkey={secretKey} ded-percent={percentage}
```
Below is an example of the CLI output upon running the code:
```bash
    Checking initial balance for the sender wallet
    Wallet balance for key BoKZAvA2raHtMw9DxPowqdp6YBjNHxEbPvphwuxwrsuq: 2 SOL
    Checking initial balance for the receiver wallet
    Wallet balance for key 9xcd2syugyJSDwcjVMd1tP4Q6fdELvcqg8JpZYaUXR6A: 0 SOL
    Sending 0.4999975 from sender wallet
    Signature is ifbQcFpzz24Hgsdstu1RKk4dvgoLbsU333Q2CgMDruNbFU5x1kG2S5FcZtJVcNKwsnrmgFVsmpmZrnSv1hfheHJ
    Checking new balance for the sender wallet
    Wallet balance for key BoKZAvA2raHtMw9DxPowqdp6YBjNHxEbPvphwuxwrsuq: 0.999995 SOL
    Checking new balance for the receiver wallet
    Wallet balance for key 9xcd2syugyJSDwcjVMd1tP4Q6fdELvcqg8JpZYaUXR6A: 1 SOL
```