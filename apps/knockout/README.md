License: MIT

# Knockout

All code is open source.

WIP - This is not finished, I just started building a UI for the knockout and betting smart contract.


TODO List:
- Services
  - Load betting inforamtions for tournament
  - Load detailed information for a tournament
  - Place bets
  - Claim won bets
- Components
  - Detailed tournament screen
    - Proceed to next round
    - Betting
      - Display current bets
      - Add a new bet
      - Claim won bets
  - Disclaimer
  - Improve layout
    - Add images
    - Check on mobile
    - General layout optimistaions (currently only basic styles applied, focusing on the functionality) 
  - Animations
  - Improve loading states
- Improve error handling

Finished:
- Services
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
    - List of participants
    - Current round
    - Claim winner
- Pipes
  - format ether
  - register until
  - tournament state