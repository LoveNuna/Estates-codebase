# Estates Marketplace

The Estates are looking to build out our marketplace, called The Shopping Mall. 

## Tech Stack

**Client:** React, Recoil, Material UI

**Contract:** Solidity

**Static Smart Contract Analysis:** Securify 2.0, Slither

**Testing:** Mocha

<p align="center">
    <code><img height="40" src="https://github.com/NFTSuits/NFT-Marketplace-DApp/blob/main/NFTSuits%20icons/react-logo.png"></code>
    <code><img height="40" src="https://github.com/NFTSuits/NFT-Marketplace-DApp/blob/main/NFTSuits%20icons/recoil-logo.svg"></code>
    <code><img height="40" src="https://github.com/NFTSuits/NFT-Marketplace-DApp/blob/main/NFTSuits%20icons/materialUI-logo.png"></code>
    <code><img height="40" src="https://github.com/NFTSuits/NFT-Marketplace-DApp/blob/main/NFTSuits%20icons/solidity-logo.jpeg"></code>
    <code><img height="40" src="https://github.com/NFTSuits/NFT-Marketplace-DApp/blob/main/NFTSuits%20icons/ganache-logo.png"></code>
    <code><img height="40" src="https://github.com/NFTSuits/NFT-Marketplace-DApp/blob/main/NFTSuits%20icons/truffle-logo.png"></code>
    <code><img height="40" src="https://github.com/NFTSuits/NFT-Marketplace-DApp/blob/main/NFTSuits%20icons/remix-logo.png"></code>
    <code><img height="40" src="https://github.com/NFTSuits/NFT-Marketplace-DApp/blob/main/NFTSuits%20icons/docker-logo.png"></code>
    <code><img height="40" src="https://github.com/NFTSuits/NFT-Marketplace-DApp/blob/main/NFTSuits%20icons/securify-logo.png"></code>
    <code><img height="40" src="https://github.com/NFTSuits/NFT-Marketplace-DApp/blob/main/NFTSuits%20icons/slither-logo.png"></code>
    <code><img height="40" src="https://github.com/NFTSuits/NFT-Marketplace-DApp/blob/main/NFTSuits%20icons/mocha-logo.svg"></code>
</p>

## Features

### Workflow:
1)	User signs in with wallet
2)	Marketplace reads wallet and detects Estates NFTs present (not sure of best way to do this, will need to be able to look at staked NFTs also. Could get the same wallet connection from the Front-end Dev which does this already on the inventory page on https://app.theestates.io/#/inventory)
3)	User selects items from the store they wish to purchase for $EQUITY
4)	User selects which NFT they will be purchasing on
5)	Transaction is created, when approved $EQUITY is debited/burned and next steps occur
6)	Shopping Mall Database (SMD) with list of NFTs and items that belong to each NFT is updated to reflect purchase and a log of the transaction is created
7)	Access to download purchased items is granted immediately to NFT (not the wallet) through a permission to our S3 database (can be achieved through a smart item numbering system)
8)	User can download items from The Shopping Mall/Blueprints site. 


## Screenshots
<p align="center">
    <h3>Landing Page</h3>
    <img src="https://github.com/LoveNuna/Estates-codebase/blob/main/front-end/images/Landing%20page_1.png"/>
    This is really great as these items change all the time
    <img src="https://github.com/LoveNuna/Estates-codebase/blob/main/front-end/images/Landing%20page_2.png"/>
</p>
<p align="center">
    <h3>Item Page</h3>
    <img src="https://github.com/LoveNuna/Estates-codebase/blob/main/front-end/images/Item_page_1.png"/>
    <img src="https://github.com/LoveNuna/Estates-codebase/blob/main/front-end/images/Item_page_2.png"/>
    <img src="https://github.com/LoveNuna/Estates-codebase/blob/main/front-end/images/Item_page_3.png"/>
    <img src="https://github.com/LoveNuna/Estates-codebase/blob/main/front-end/images/Item_page_4.png"/>
    <img src="https://github.com/LoveNuna/Estates-codebase/blob/main/front-end/images/Item_page_5.png"/>
    <img src="https://github.com/LoveNuna/Estates-codebase/blob/main/front-end/images/Item_page_6.png"/>
</p>
<p align="center">
    <h3>Item Colouring</h3>
    <img src="https://github.com/LoveNuna/Estates-codebase/blob/main/front-end/images/Item_colouring_1.png"/>
    <img src="https://github.com/LoveNuna/Estates-codebase/blob/main/front-end/images/Item_colouring_2.png"/>
    <img src="https://github.com/LoveNuna/Estates-codebase/blob/main/front-end/images/Item_colouring_3.png"/>
</p>
<p align="center">
    <h3>Item Ownership Page</h3>
    <img src="https://github.com/LoveNuna/Estates-codebase/blob/main/front-end/images/Item_Ownership_Page_1.png"/>
</p>
<p align="center">
    <h3>Item Parameters</h3>
    <img src="https://github.com/LoveNuna/Estates-codebase/blob/main/front-end/images/Item_Parameters.png"/>
</p>

## Support and Feedback

Feel free to create an issue to discuss more.

  










