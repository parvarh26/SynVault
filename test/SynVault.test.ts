import { ethers } from "hardhat";
import { expect } from "chai";
import { SynVault } from "../typechain-types";

describe("SynVault", function () {
  let vault: SynVault;
  let owner: any;
  let addr1: any;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    const SynVaultFactory = await ethers.getContractFactory("SynVault");
    vault = (await SynVaultFactory.deploy()) as SynVault;
    await vault.deployed();
  });

  it("Should accept deposits", async function () {
    await vault.connect(addr1).deposit({ value: ethers.utils.parseEther("1") });
    expect(await vault.balanceOf(addr1.address)).to.equal(ethers.utils.parseEther("1"));
  });

  it("Only owner can withdraw", async function () {
    await vault.connect(addr1).deposit({ value: ethers.utils.parseEther("1") });
    await expect(vault.connect(addr1).withdraw()).to.be.revertedWith("Ownable: caller is not the owner");
  });
});
