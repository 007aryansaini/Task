const { expect } = require("chai");

describe("chat Contract", function () {
  let Chat;
  let HardhatChat;
  let owner;
  let addr1;
  let addr2;
  let addrs;
  beforeEach(async function () {
    Chat = await ethers.getContractFactory("chat");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    HardhatChat = await Chat.deploy();
  });

  describe("Registration of user", function () {
    it("Is Registering the User or not", async function () {
      await HardhatChat.register();
      expect(await HardhatChat.registered(owner.address)).to.equal(true);
    });

    it("Check for the address which is not registered", async function () {
      expect(await HardhatChat.registered(addr1.address)).to.equal(false);
    });
  });

  describe("Sending a message to a user", function () {
    it("Cannot send message to a 0 address", async function () {
      await HardhatChat.register();

      await expect(
        await HardhatChat.connect(addr2).sendMessage(
          "0x0000000000000000000000000000000000000000",
          "Heyy"
        )
      ).to.be.revertedWith("Enter a Valid Address");
    });

    it("You cannot message yourself", async function () {
      await expect(
        await HardhatChat.sendMessage(owner.address, "Heyy")
      ).to.be.revertedWith("You cannot message to yourself");
    });

    it("Person who is registered can message", async function () {
      await expect(
        await HardhatChat.connect(addr2).sendMessage(owner.address, "Heyy")
      ).to.be.revertedWith("You are not registered");
    });

    it("Message can be sent to a registered User", async function () {
      await HardhatChat.register();
      await expect(
        await HardhatChat.sendMessage(addr2.address, "Heyy")
      ).to.be.revertedWith(
        "The person you are trying to message is not registered"
      );
    });

    it("Message can be sent to a registered User", async function () {
      await HardhatChat.connect(addr1).register();
      await HardhatChat.connect(owner).register();
      await expect(
        await HardhatChat.sendMessage(addr1.address, "")
      ).to.be.revertedWith("Enter a Valid message");
    });

    describe("Getting all", function () {
      it("Invalid user", async function () {
        expect(
          await HardhatChat.getAllMessages(addr2.address)
        ).to.be.revertedWith("User is not registered");
      });

      it("Getting all messages", async function () {
        await HardhatChat.register();
        await HardhatChat.connect(addr1).register();

        await HardhatChat.sendMessage(addr1.address, "Heyy");

        expect(await HardhatChat.getAllMessages(owner.address)).to.equal([
          "Heyy",
        ]);
      });
    });
  });
});
