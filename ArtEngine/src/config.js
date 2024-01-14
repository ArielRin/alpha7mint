const basePath = process.cwd();
const { MODE } = require(`${basePath}/constants/blend_mode.js`);
const { NETWORK } = require(`${basePath}/constants/network.js`);

const network = NETWORK.eth;

// General metadata for Ethereum
const namePrefix = "Alpha Dawgz NFT Collection";
const description = "Welcome to Alpha7 token the first step in the System7 eco system. We are pleased to inform everyone of our new Nft collection Alpha Dawgz! 777 total nfts with 50 different stunning layouts! Alpha Dawg NFTs are set to be released prior to the launch of the Alpha7 token. The funds raised from these sales will contribute to the initial liquidity pool (LP) and the NFT Holder rewards pool. Holders of these NFTs will receive benefits like Alpha7 Airdrops and reflections for each NFT they own. This setup is designed to quickly offset the initial cost of the NFTs. Moreover, holders of Alpha Dawg NFTs will enjoy an additional 3% reflection from Alpha7 token to the NFT rewards pool, which will be distributed to holders on a weekly basis.";
const baseUri = "https://raw.githubusercontent.com/ArielRin/alpha7mint/master/NFTDATA/Metadata";

const solanaMetadata = {
  symbol: "ALPHADAWG",
  seller_fee_basis_points: 300, // Define how much % you want from secondary market sales 1000 = 10%
  external_url: "https://alpha.system7.io/",
  creators: [
    {
      address: "0xc690fE0d47803ed50E1EA7109a9750360117aa22", //Ger0 provided
      share: 100,
    },
  ],
};
//modify to have clear layers to 200 creating metadata and rarities as requested
const layerConfigurations = [
  {
    growEditionSizeTo: 777,
    layersOrder: [
      { name: "Background" },
      { name: "Logo" },
      { name: "Dawg" },
      { name: "Edition" },
      { name: "Image" },
      { name: "Type1" },
      { name: "Type2" },
      { name: "Type3" },
      { name: "Type4" },
      { name: "Type5" },
      { name: "Type6" },
      { name: "Type7" },
    ],
  },
];

const shuffleLayerConfigurations = false;

const debugLogs = false;

const format = {
  width: 512,
  height: 512,
  smoothing: false,
};

const gif = {
  export: false,
  repeat: 0,
  quality: 100,
  delay: 500,
};

const text = {
  only: false,
  color: "#ffffff",
  size: 20,
  xGap: 40,
  yGap: 40,
  align: "left",
  baseline: "top",
  weight: "regular",
  family: "Courier",
  spacer: " => ",
};

const pixelFormat = {
  ratio: 2 / 128,
};

const background = {
  generate: true,
  brightness: "80%",
  static: false,
  default: "#000000",
};

const extraMetadata = {};

const rarityDelimiter = "#";

const uniqueDnaTorrance = 10000;

const preview = {
  thumbPerRow: 5,
  thumbWidth: 50,
  imageRatio: format.height / format.width,
  imageName: "preview.png",
};

const preview_gif = {
  numberOfImages: 5,
  order: "ASC", // ASC, DESC, MIXED
  repeat: 0,
  quality: 100,
  delay: 500,
  imageName: "preview.gif",
};

module.exports = {
  format,
  baseUri,
  description,
  background,
  uniqueDnaTorrance,
  layerConfigurations,
  rarityDelimiter,
  preview,
  shuffleLayerConfigurations,
  debugLogs,
  extraMetadata,
  pixelFormat,
  text,
  namePrefix,
  network,
  solanaMetadata,
  gif,
  preview_gif,
};
