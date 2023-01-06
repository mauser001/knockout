# Smart Contract for comunity knockout tournaments

The knockout contract is open source and created for the comunity. Once the contract is deployed the deployer has no more access to the contract. 

Players can compete in a knockout tournament to win the price pool. 

Disclaimer: I tried my best to make it as bullet proof as possible, but I do not take any responsability if something breaks. Please use at your own risk. 

Feel free to create a nice Frontend for it ;-)

Here is how it works:
- Everybody can create tournaments with the knockout contract. 
- When you create a tournament you become the owner (aka admin) of that tournament (refered as 'owner' in the rest of the doc). 
- You can set the following base parameters when you create a tournament:
  - name: Name/Title of the tournament
  - ticket costs: How much does it cost to participate 
  - fee: Percent of the price pool the tournament owner gets,after a successfull tournament. Between 0 and 10 percent. 
  - registration end date: Time stamp in the future until when the registration is open
  - min participants: Minimum number of participants (at least 2) for a tournament
- Everybod can join the tournament (by paying the ticket costs) if the tournament was not already started or the registration end date is not reached.
- The owner is responsible to move the tournament from stage to stage.
  - When the owner moves to stage 1 the participants are randomly mixed together. 
  - At every stage (after the first one) you can get remainingParticipants that have to fight at the current stage.
    - It is an array of addresses where you where every pair of two players have to fight each other. (Example: [addr1, addr3, addr7, addr9] -> addr1 has to fight addr3 and addr7 has to fight addr9 in this round)
  - When a stage is finished and the owner moves to the next stage only the winners will proceed to the next round. When there is only one Player left we have a winner. 
  - The owner should make sure that everybody has claimed their victory before moving to the next round or at least communicate clearly when he plans to do that. 
- When two players finished their game the winner has to 'claim victory' in the smart contract. 

Claiming the price:
Once there is only one player left in the tournament we have a winner and he can claim the price. When he does the fee will be sent to the owner. 

Error / Problem handling:
- If two players fight each other and both claim victory the owner must is responsible for resolving the isse before he can proceed to the next round. 
- If there are not enough players until the registration end then the tournament can not be startet. Everybody can claim their ticket cost back. 
- If the tournament for whatever reason cannot be finished then the owner has to option to force the tournament to the last round without a winner. In that case the players can also get their ticket costs back. 
- If the owner disappears or looses his keys their is a hard fallback where users can withdraw their ticket costs after one year if the tournament was not finished.

Sidenote: The owner can modify the results of the current round (as he needs to resolve conflicts and so on). If he does there is a message sent via the blockchain so it is traceable and the a malitious behavior could be proven. In general I think that the owner wants to build up a good reputation in the community and he will get the fee if erything runs correctly so I think this should be no problem. 


You can find a test version of this contract on Polygon-Mumbai: https://mumbai.polygonscan.com/address/0x9bFae58A8f394CbD2E0a6448cD103818577aFF29