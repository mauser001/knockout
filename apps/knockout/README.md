License: MIT

# Knockout

All code is open source.

This webiste and it's releated smart contracts are in beta state. Use at your own risk!

For detailed explanation on how the tournaments and betting work, please visit the related readme files in the repository root directory.

Testnet version is deployed on the Polygon Mumbai network: https://tournament.maushammer.at/mumbai/

____________________________________________________

TODO List:
Open:
- Components
  - Improve loading states
- Improve error handling

Finished:
- Services
  - Load betting inforamtions for tournament
  - Load detailed information for a tournament
  - Place bets
  - Claim won bets
  - Proceed to the next round (for tournament admin)
  - Wrapper for WalletConnect
  - Load tournaments from smart contract
  - Create tournament
  - Join tournament
  - Claim price
  - Claim winner
    - Individual User
  - Set Winner
    - Tournament Admin
- Components
  - Connect button
  - Tournament list
  - Create tournament form
  - Join tournament button
  - Claim price button
  - Detailed tournament screen
    - Proceed to next round
    - List of participants
    - Current round
    - Claim winner
    - Betting
      - Display current bets
      - Add a new bet
      - Claim won bets
  - Disclaimer
- Pipes
  - format ether
  - register until
  - tournament state
- Improve layout
  - Add images