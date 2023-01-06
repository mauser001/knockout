import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from 'hardhat'
import '@nomiclabs/hardhat-ethers'

describe("Bet", function () {
  async function deployOneYearLockFixture() {

    // Contracts are deployed using the first signer/account by default
    const [owner, user1, user2, user3, user4, user5] = await ethers.getSigners();

    const Knockout = await ethers.getContractFactory("Knockout");
    const knockout = await Knockout.deploy();


    const Bet = await ethers.getContractFactory("Bet");
    const bet = await Bet.deploy(knockout.address);

    return { knockout, bet, owner, user1, user2, user3, user4, user5 };
  }

  describe("Bet on tournament", function () {
    it("It should be able to bet on a tournament and claim rewards", async function () {
      const { knockout, bet, user1, user2, user3, user4 } = await loadFixture(deployOneYearLockFixture);
      knockout.connect(user1);
      const blockTime = await time.latest();
      const oneDayInTheFuture = blockTime + time.duration.days(1);
      await knockout.connect(user1).createTournament('First', 1, 5, oneDayInTheFuture, 2);
      const id = "1";
      await knockout.connect(user2).participate(id, { value: ethers.utils.parseEther('1') });
      await knockout.connect(user3).participate(id, { value: ethers.utils.parseEther('1') });

      await time.increase(time.duration.days(2));

      await bet.connect(user2).placeABet(id, user2.address, { value: ethers.utils.parseEther('1') });
      await bet.connect(user3).placeABet(id, user2.address, { value: ethers.utils.parseEther('3') });
      await bet.connect(user4).placeABet(id, user3.address, { value: ethers.utils.parseEther('4') });

      await knockout.connect(user1).nextStep(id);
      await knockout.connect(user2).claimVictory(id);
      await knockout.connect(user1).nextStep(id);

      const before2 = await ethers.provider.getBalance(user2.address);
      const before3 = await ethers.provider.getBalance(user3.address);
      await bet.connect(user2).claimPrice(id);
      await bet.connect(user3).claimPrice(id);
      //await bet.connect(user2).claimPrice(id);
      const after2 = await ethers.provider.getBalance(user2.address);
      const after3 = await ethers.provider.getBalance(user3.address);
      //User 2 should get 1/4 of the price
      expect(parseFloat(ethers.utils.formatEther(after2.sub(before2))).toFixed(1)).to.be.eq("2.0");
      //User 3 should get 3/4 of the price
      expect(parseFloat(ethers.utils.formatEther(after3.sub(before3))).toFixed(1)).to.be.eq("6.0");
    });
  });
  describe("Error and special case handling", function () {
    it("Cannot place bet if tournement has wrong state", async function () {
      const { knockout, bet, user1, user2, user3 } = await loadFixture(deployOneYearLockFixture);

      const id = "1";
      await expect(bet.connect(user2).placeABet(id, user2.address, { value: ethers.utils.parseEther('1') })).to.be.revertedWith("Invalid tournament Id");

      const blockTime = await time.latest();
      const oneDayInTheFuture = blockTime + time.duration.days(1);
      await knockout.connect(user1).createTournament('First', 1, 5, oneDayInTheFuture, 2);
      await knockout.connect(user1).participate(id, { value: ethers.utils.parseEther('1') });
      await knockout.connect(user2).participate(id, { value: ethers.utils.parseEther('1') });
      await expect(bet.connect(user2).placeABet(id, user2.address, { value: ethers.utils.parseEther('1') })).to.be.revertedWith("Registration is still open");

      await time.increase(time.duration.days(2));

      await expect(bet.connect(user3).placeABet(id, user2.address)).to.be.revertedWith("No value");
      await expect(bet.connect(user1).placeABet(id, user2.address, { value: ethers.utils.parseEther('1') })).to.be.revertedWith("Tournament owner is not allowed to bet");
      await expect(bet.connect(user2).placeABet(id, user3.address, { value: ethers.utils.parseEther('1') })).to.be.revertedWith("Address not found");

      await knockout.connect(user1).nextStep(id);
      await expect(bet.connect(user2).placeABet(id, user2.address, { value: ethers.utils.parseEther('1') })).to.be.revertedWith("Invalid tournament state");

    });


    it("Cannot claim price if not allowed", async function () {
      const { knockout, bet, user1, user2, user3 } = await loadFixture(deployOneYearLockFixture);

      const id = "1";
      await expect(bet.connect(user2).claimPrice(id)).to.be.revertedWith("Invalid tournament Id");

      const blockTime = await time.latest();
      const oneDayInTheFuture = blockTime + time.duration.days(1);
      await knockout.connect(user1).createTournament('First', 1, 5, oneDayInTheFuture, 2);

      await expect(bet.connect(user2).claimPrice(id)).to.be.revertedWith("Nothing to withdraw");
      await knockout.connect(user3).participate(id, { value: ethers.utils.parseEther('1') });
      await knockout.connect(user2).participate(id, { value: ethers.utils.parseEther('1') });

      await time.increase(time.duration.days(2));


      await bet.connect(user2).placeABet(id, user2.address, { value: ethers.utils.parseEther('1') });
      await bet.connect(user3).placeABet(id, user3.address, { value: ethers.utils.parseEther('3') });

      await expect(bet.connect(user2).claimPrice(id)).to.be.revertedWith("Nothing to withdraw");

      await knockout.connect(user1).nextStep(id);

      await expect(bet.connect(user2).claimPrice(id)).to.be.revertedWith("Nothing to withdraw");
      await knockout.connect(user2).claimVictory(id);
      await expect(bet.connect(user2).claimPrice(id)).to.be.revertedWith("Nothing to withdraw");

      await knockout.connect(user1).nextStep(id);

      await expect(bet.connect(user3).claimPrice(id)).to.be.revertedWith("Bet on the wrong player");
      await bet.connect(user2).claimPrice(id);
      await expect(bet.connect(user2).claimPrice(id)).to.be.revertedWith("Already withdrawn");
    });


    it("Withdraw from canceld tournament", async function () {
      const { knockout, bet, user1, user2, user3 } = await loadFixture(deployOneYearLockFixture);

      const id = "1";
      const blockTime = await time.latest();
      const oneDayInTheFuture = blockTime + time.duration.days(1);
      await knockout.connect(user1).createTournament('First', 1, 5, oneDayInTheFuture, 2);

      await knockout.connect(user3).participate(id, { value: ethers.utils.parseEther('1') });
      await knockout.connect(user2).participate(id, { value: ethers.utils.parseEther('1') });

      await time.increase(time.duration.days(2));
      await bet.connect(user2).placeABet(id, user2.address, { value: ethers.utils.parseEther('1') });
      await bet.connect(user3).placeABet(id, user3.address, { value: ethers.utils.parseEther('3') });

      await knockout.connect(user1).nextStep(id);

      // finsh event without a winner
      await knockout.connect(user1).forceNextStep(id);

      const before2 = await ethers.provider.getBalance(user2.address);
      const before3 = await ethers.provider.getBalance(user3.address);
      await bet.connect(user2).claimPrice(id);
      await bet.connect(user3).claimPrice(id);
      //await bet.connect(user2).claimPrice(id);
      const after2 = await ethers.provider.getBalance(user2.address);
      const after3 = await ethers.provider.getBalance(user3.address);
      //User 2 should get his bet back
      expect(parseFloat(ethers.utils.formatEther(after2.sub(before2))).toFixed(0)).to.be.eq("1");
      //User 3 should get his bet back
      expect(parseFloat(ethers.utils.formatEther(after3.sub(before3))).toFixed(0)).to.be.eq("3");
    });


    it("Withdraw after one year", async function () {
      const { knockout, bet, user1, user2, user3 } = await loadFixture(deployOneYearLockFixture);

      const id = "1";
      const blockTime = await time.latest();
      const oneDayInTheFuture = blockTime + time.duration.days(1);
      await knockout.connect(user1).createTournament('First', 1, 5, oneDayInTheFuture, 2);

      await knockout.connect(user3).participate(id, { value: ethers.utils.parseEther('1') });
      await knockout.connect(user2).participate(id, { value: ethers.utils.parseEther('1') });

      await time.increase(time.duration.days(2));
      await bet.connect(user2).placeABet(id, user2.address, { value: ethers.utils.parseEther('1') });
      await bet.connect(user3).placeABet(id, user3.address, { value: ethers.utils.parseEther('3') });


      await expect(bet.connect(user2).claimPrice(id)).to.be.revertedWith("Nothing to withdraw");
      await expect(bet.connect(user3).claimPrice(id)).to.be.revertedWith("Nothing to withdraw");

      await knockout.connect(user1).nextStep(id);

      await expect(bet.connect(user2).claimPrice(id)).to.be.revertedWith("Nothing to withdraw");
      await expect(bet.connect(user3).claimPrice(id)).to.be.revertedWith("Nothing to withdraw");

      await time.increase(time.duration.days(366));

      await bet.connect(user2).claimPrice(id);
      await bet.connect(user3).claimPrice(id);
    });
  });
});
