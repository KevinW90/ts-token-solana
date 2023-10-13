import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { userKeypair } from "./helpers";
import {
  TokenStandard,
  createFungible,
  createV1,
  mintV1,
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
  "https://raw.githubusercontent.com/KevinW90/ts-token-solana/main/src/metadata.json";
async function getMetadata() {
  const metadataResponse = await fetch(metadataURL);
  const metadata = await metadataResponse.json();

  // console.log("metadataResponse", metadataResponse);
  // console.log("metadata", metadata);
  return metadata;
}

const mint = generateSigner(umi);

(async () => {
  const metadata = await getMetadata();
  console.log("metadata", metadata);

  // Step 2: Create the mint

  const create = await createFungible(umi, {
    mint,
    authority: umi.identity,
    name: metadata.name,
    symbol: metadata.symbol,
    uri: metadata.uri,
    sellerFeeBasisPoints: percentAmount(0),
    decimals: 9,
  }).sendAndConfirm(umi);

  console.log("create", create);
})();
