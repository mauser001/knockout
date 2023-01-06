# Smart Contract for bettomg oncomunity knockout tournaments

The bet contract is open source and created for the comunity when its deployed it gets linked to a specific tournament contract.

Players can bet on the winner of a knockout tournament hosted via the linked tournament contract. 

Disclaimer: I tried my best to make it as bullet proof as possible, but I do not take any responsability if something breaks. Please use at your own risk. 

Here is how it works:
- You can only bet on tournaments when:
  - They have not started
  - There are enought players participating
  - The register period for the tournament is over
- You can place bet with any amount on the participants of a specific a tournament. 
- The tournament owner is not allowed to place a bet
- When the tournament is over and we have a winner then everybody who placed a bet on this player will get the respective share of the whole price pool. 

Users can withdraw their bet if:
-  A tournament is canceled
-  We don't have a winner after one year
-  Nobody bet on the correct winner

You can find a test version of this contract on Polygon-Mumbai: https://mumbai.polygonscan.com/address/0x15b89915B6E6b31D8D09993c0D8F955FaEe06798