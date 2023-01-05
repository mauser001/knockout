import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from 'hardhat'
import '@nomiclabs/hardhat-ethers'

enum TournamentState {
  CREATED,
  STARTED,
  FINISHED,
  CANCELED
}

describe("Knockout", function () {
  async function deployOneYearLockFixture() {

    // Contracts are deployed using the first signer/account by default
    const [owner, user1, user2, user3, user4, user5] = await ethers.getSigners();

    const Knockout = await ethers.getContractFactory("Knockout");
    const knockout = await Knockout.deploy();

    return { knockout, owner, user1, user2, user3, user4, user5 };
  }

  describe("Create tournament", function () {
    it("It should create and run a complete tournament", async function () {
      const { knockout, user1, user2, user3, user4 } = await loadFixture(deployOneYearLockFixture);
      knockout.connect(user1);
      const blockTime = await time.latest();
      const oneDayInTheFuture = blockTime + time.duration.days(1);
      await knockout.connect(user1).createTournament('First', 2, 5, oneDayInTheFuture, 3);
      const id = "1";
      expect((await knockout.lastTournamentIndex()).toString()).to.equal(id);
      expect(await knockout.getState(id)).to.equal(TournamentState.CREATED);

      let info = await knockout.getTournament(id);
      expect(info.playerCount.toString()).to.equal('0');
      await knockout.connect(user2).participate(id, { value: ethers.utils.parseEther('2') });
      info = await knockout.getTournament(id);
      expect(info.playerCount.toString()).to.equal('1');
      expect(info.totalAmount.toString()).to.equal(ethers.utils.parseEther('2').toString());

      await knockout.connect(user3).participate(id, { value: ethers.utils.parseEther('2') });
      await knockout.connect(user4).participate(id, { value: ethers.utils.parseEther('2') });
      info = await knockout.getTournament(id);
      expect(info.playerCount.toString()).to.equal('3');
      expect(info.currentStep.toString()).to.equal('0');

      await knockout.connect(user1).nextStep(id);
      info = await knockout.getTournament(id);
      expect(info.remainingParticipants.length).to.equal(4);
      expect(info.currentStep.toString()).to.equal('1');
      expect(await knockout.getState(id)).to.equal(TournamentState.STARTED);


      await knockout.connect(user2).claimVictory(id);
      const playerIndex = info.remainingParticipants.indexOf(user2.address);
      const secondWinner = playerIndex < 2 ? info.remainingParticipants[2] : info.remainingParticipants[0];
      await knockout.connect(user1).setVictory(id, secondWinner, true);

      await knockout.connect(user1).nextStep(id);
      info = await knockout.getTournament(id);
      expect(info.remainingParticipants.length).to.equal(2);
      expect(info.currentStep.toString()).to.equal('2');

      await knockout.connect(user2).claimVictory(id);
      await knockout.connect(user1).nextStep(id);

      expect(await knockout.getState(id)).to.equal(TournamentState.FINISHED);
      info = await knockout.getTournament(id);
      expect(info.winner).to.equal(user2.address);

      const before1 = await ethers.provider.getBalance(user1.address);
      const before2 = await ethers.provider.getBalance(user2.address);
      await knockout.connect(user2).claimPrice(id);
      const after1 = await ethers.provider.getBalance(user1.address);
      const after2 = await ethers.provider.getBalance(user2.address);
      //check if fee was payed
      expect(parseFloat(ethers.utils.formatEther(after1.sub(before1))).toFixed(1)).to.be.eq("0.3");
      //check if winner got his price money (reduced by fee)
      expect(parseFloat(ethers.utils.formatEther(after2.sub(before2))).toFixed(1)).to.be.eq("5.7");

    });
  });
  describe("Error and special case handling", function () {
    it("Create with invalid informations", async function () {
      const { knockout, user1 } = await loadFixture(deployOneYearLockFixture);
      knockout.connect(user1);
      const blockTime = await time.latest();
      await expect(knockout.connect(user1).createTournament('First', 2, 5, blockTime, 3)).to.be.revertedWith("Register end date must be in the future");

      const oneDayInTheFuture = blockTime + time.duration.days(1);
      await expect(knockout.connect(user1).createTournament('First', 0, 5, oneDayInTheFuture, 3)).to.be.revertedWith("Ticket cost must be greater then 0");

      await expect(knockout.connect(user1).createTournament('First', 1, 11, oneDayInTheFuture, 3)).to.be.revertedWith("Max fee is 10 percent");

      await expect(knockout.connect(user1).createTournament('First', 1, 5, oneDayInTheFuture, 1)).to.be.revertedWith("Minimum perticipants must be >= 2");
    });

    it("Invalid participation", async function () {
      const { knockout, user1, user2, user3, user4 } = await loadFixture(deployOneYearLockFixture);
      knockout.connect(user1);
      const blockTime = await time.latest();
      const oneDayInTheFuture = blockTime + time.duration.days(1);
      await knockout.connect(user1).createTournament('First', 2, 5, oneDayInTheFuture, 2);
      const id = "1";
      await expect(knockout.connect(user2).participate('2', { value: ethers.utils.parseEther('2') })).to.be.revertedWith("Invalid tournament Id");

      await expect(knockout.connect(user2).participate(id, { value: ethers.utils.parseEther('1') })).to.be.revertedWith("Payed wrong amount");

      await knockout.connect(user2).participate(id, { value: ethers.utils.parseEther('2') });

      await expect(knockout.connect(user2).participate(id, { value: ethers.utils.parseEther('2') })).to.be.revertedWith("Already participating");

      await knockout.connect(user3).participate(id, { value: ethers.utils.parseEther('2') });
      await knockout.connect(user1).nextStep(id);

      await expect(knockout.connect(user4).participate(id, { value: ethers.utils.parseEther('2') })).to.be.revertedWith("Tournament has already started");

      await time.increase(time.duration.days(2));
      await expect(knockout.connect(user4).participate(id, { value: ethers.utils.parseEther('2') })).to.be.revertedWith("Registration is already over");

    });

    it("Next step handling", async function () {
      const { knockout, user1, user2, user3, user4 } = await loadFixture(deployOneYearLockFixture);
      knockout.connect(user1);
      const blockTime = await time.latest();
      const oneDayInTheFuture = blockTime + time.duration.days(1);
      await knockout.connect(user1).createTournament('First', 2, 5, oneDayInTheFuture, 2);
      await expect(knockout.connect(user1).nextStep("2")).to.be.revertedWith("Invalid tournament Id");
      const id = "1";
      await expect(knockout.connect(user2).nextStep(id)).to.be.revertedWith("Not the owner of this tournament");
      await knockout.connect(user2).participate(id, { value: ethers.utils.parseEther('2') });
      await expect(knockout.connect(user1).nextStep(id)).to.be.revertedWith("Min participants not reached");

      await knockout.connect(user3).participate(id, { value: ethers.utils.parseEther('2') });
      await knockout.connect(user1).nextStep("1");
      await expect(knockout.connect(user1).nextStep("1")).to.be.revertedWith("We need at least one winner to proceed to the next step");


      await expect(knockout.connect(user2).forceNextStep(id)).to.be.revertedWith("Not the owner of this tournament");

      await knockout.connect(user1).forceNextStep("1");
      await expect(knockout.connect(user1).nextStep("1")).to.be.revertedWith("We already have a winner");

    });

    it("Conflict resolution", async function () {
      const { knockout, user1, user2, user3, user4 } = await loadFixture(deployOneYearLockFixture);
      knockout.connect(user1);
      const blockTime = await time.latest();
      const oneDayInTheFuture = blockTime + time.duration.days(1);
      await knockout.connect(user1).createTournament('First', 2, 5, oneDayInTheFuture, 2);
      const id = "1";
      await knockout.connect(user2).participate(id, { value: ethers.utils.parseEther('2') });
      await knockout.connect(user3).participate(id, { value: ethers.utils.parseEther('2') });
      await knockout.connect(user1).nextStep(id);

      await knockout.connect(user2).claimVictory(id);
      await knockout.connect(user3).claimVictory(id);

      await expect(knockout.connect(user1).nextStep(id)).to.be.revertedWith("Player won conflict");
      await expect(knockout.connect(user3).setVictory(id, user2.address, false)).to.be.revertedWith("Not the owner of this tournament");

      await knockout.connect(user1).setVictory(id, user3.address, false);
      await knockout.connect(user1).nextStep(id);
      await knockout.connect(user2).claimPrice(id);
    });


    it("Claim price", async function () {
      const { knockout, user1, user2, user3, user4 } = await loadFixture(deployOneYearLockFixture);
      knockout.connect(user1);
      const blockTime = await time.latest();
      const oneDayInTheFuture = blockTime + time.duration.days(1);
      await knockout.connect(user1).createTournament('First', 2, 5, oneDayInTheFuture, 2);
      const id = "1";
      await knockout.connect(user2).participate(id, { value: ethers.utils.parseEther('2') });
      await knockout.connect(user3).participate(id, { value: ethers.utils.parseEther('2') });

      await expect(knockout.connect(user2).claimPrice(id)).to.be.revertedWith("Nothing to withdraw");
      await knockout.connect(user1).nextStep(id);
      await knockout.connect(user2).claimVictory(id);
      await expect(knockout.connect(user2).claimPrice(id)).to.be.revertedWith("Nothing to withdraw");
      await knockout.connect(user1).nextStep(id);

      await expect(knockout.connect(user3).claimPrice(id)).to.be.revertedWith("Nothing to withdraw");

      await knockout.connect(user2).claimPrice(id);

      await expect(knockout.connect(user2).claimPrice(id)).to.be.revertedWith("Already withdrawn");
    });

    it("Withdraw funds it not enough participants", async function () {
      const { knockout, user1, user2, user3, user4 } = await loadFixture(deployOneYearLockFixture);
      knockout.connect(user1);
      const blockTime = await time.latest();
      const oneDayInTheFuture = blockTime + time.duration.days(1);
      await knockout.connect(user1).createTournament('First', 2, 5, oneDayInTheFuture, 2);
      const id = "1";
      await knockout.connect(user2).participate(id, { value: ethers.utils.parseEther('2') });

      await expect(knockout.connect(user2).claimPrice(id)).to.be.revertedWith("Nothing to withdraw");
      await time.increase(time.duration.days(2));

      expect(await knockout.getState(id)).to.equal(TournamentState.CANCELED);
      await knockout.connect(user2).claimPrice(id);
    });



    it("Withdraw funds tournament ended without winner", async function () {
      const { knockout, user1, user2, user3, user4 } = await loadFixture(deployOneYearLockFixture);
      knockout.connect(user1);
      const blockTime = await time.latest();
      const oneDayInTheFuture = blockTime + time.duration.days(1);
      await knockout.connect(user1).createTournament('First', 2, 5, oneDayInTheFuture, 2);
      const id = "1";
      await expect(knockout.connect(user2).claimPrice(id)).to.be.revertedWith("Nothing to withdraw");
      await knockout.connect(user2).participate(id, { value: ethers.utils.parseEther('2') });
      await knockout.connect(user3).participate(id, { value: ethers.utils.parseEther('2') });
      await knockout.connect(user1).nextStep(id);
      await expect(knockout.connect(user2).claimPrice(id)).to.be.revertedWith("Nothing to withdraw");

      await knockout.connect(user1).forceNextStep(id);
      expect(await knockout.getState(id)).to.equal(TournamentState.CANCELED);

      await knockout.connect(user2).claimPrice(id);
      await knockout.connect(user3).claimPrice(id);
    });

    it("Withdraw funds of unfinished tournament after one year", async function () {
      const { knockout, user1, user2, user3, user4 } = await loadFixture(deployOneYearLockFixture);
      knockout.connect(user1);
      const blockTime = await time.latest();
      const oneDayInTheFuture = blockTime + time.duration.days(1);
      await knockout.connect(user1).createTournament('First', 2, 5, oneDayInTheFuture, 2);
      const id = "1";
      await expect(knockout.connect(user2).claimPrice(id)).to.be.revertedWith("Nothing to withdraw");
      await knockout.connect(user2).participate(id, { value: ethers.utils.parseEther('2') });
      await knockout.connect(user3).participate(id, { value: ethers.utils.parseEther('2') });
      await knockout.connect(user1).nextStep(id);

      await expect(knockout.connect(user2).claimPrice(id)).to.be.revertedWith("Nothing to withdraw");
      await time.increase(time.duration.days(366));

      await knockout.connect(user2).claimPrice(id);
      await knockout.connect(user3).claimPrice(id);
    });
  });
});
