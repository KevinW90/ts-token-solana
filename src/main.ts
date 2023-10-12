import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { userKeypair } from "./helpers";
import {
  TokenStandard,
  createV1,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  generateSigner,
  keypairIdentity,
  percentAmount,
} from "@metaplex-foundation/umi";

const umi = createUmi("https://api.devnet.solana.com");

// register our keypair to be used as the default signer when making any and all transactions
const keypair = umi.eddsa.createKeypairFromSecretKey(userKeypair.secretKey);
umi.use(keypairIdentity(keypair)).use(mplTokenMetadata());

// MINTING PROCESS
//1. Uploading our asset metadata to an off-chain or centralised storage provider. We will not be carrying out this process and shall be using this [uri]* that we uploaded earlier. Check out our storage providers module to see how you can accomplish this step (link at the end of this tutorial!)
//2. Creating the on-chain metadata account that will hold our asset data such as the off-chain uri, mint, symbol …
//3. Finally, we mint our token with the associated accounts.

// Step 1: Create the metadata account
// GitHub will store the metadata
const metadataURL =
  "https://github.com/KevinW90/ts-token-solana/main/src/metadata.json";
let metadata: any;
async function getMetadata() {
  fetch(metadataURL)
    .then((response) => response.json())
    .then((data) => {
      metadata = data;
    });
}
getMetadata();

const mint = generateSigner(umi);
async function createMetadataDetails() {
  await createV1(umi, {
    mint,
    authority: umi.identity,
    name: metadata.name,
    symbol: metadata.symbol,
    uri: metadata.uri,
    sellerFeeBasisPoints: percentAmount(0),
    decimals: 9,
    tokenStandard: TokenStandard.Fungible,
  }).sendAndConfirm(umi);
}
