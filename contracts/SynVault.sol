// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/// @title SynVault
/// @notice Simple DAO treasury vault for hackathon MVP.
///         Anyone can deposit ETH. Only the owner (deployer) can withdraw.
///         Emits Deposit/Withdraw events for frontend activity feed.
contract SynVault is Ownable, ReentrancyGuard {
    event Deposit(address indexed from, uint256 amount, uint256 timestamp);
    event Withdraw(address indexed to, uint256 amount, uint256 timestamp);

    /// @notice Accept plain ETH transfers as deposits
    receive() external payable {
        require(msg.value > 0, "No ETH sent");
        emit Deposit(msg.sender, msg.value, block.timestamp);
    }

    /// @notice Explicit deposit function (same as sending ETH)
    function deposit() external payable nonReentrant {
        require(msg.value > 0, "No ETH sent");
        emit Deposit(msg.sender, msg.value, block.timestamp);
    }

    /// @notice Owner withdraws `amount` (wei) to owner()
    function withdraw(uint256 amount) external onlyOwner nonReentrant {
        require(address(this).balance >= amount, "Not enough funds");
        (bool ok, ) = payable(owner()).call{value: amount}("");
        require(ok, "Transfer failed");
        emit Withdraw(owner(), amount, block.timestamp);
    }

    /// @notice Owner withdraws `amount` to a specific address `to`
    function withdrawTo(address to, uint256 amount) external onlyOwner nonReentrant {
        require(address(this).balance >= amount, "Not enough funds");
        (bool ok, ) = payable(to).call{value: amount}("");
        require(ok, "Transfer failed");
        emit Withdraw(to, amount, block.timestamp);
    }

    /// @notice Returns total ETH held by the vault (in wei)
    function getTreasuryBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
