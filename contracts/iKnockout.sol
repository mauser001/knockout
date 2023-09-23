// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

enum TournamentState {
    CREATED,
    STARTED,
    FINISHED,
    CANCELED
}
struct TournamentConfig {
    address owner; // Owner of the tournament
    string name; // Name of the tournament
    uint ticketCost; // Participation cost (in Eth)
    uint fee; // Fee in percent of the ticket costs
    uint registerEndDate; // Date until players can register for the tournament
    uint minParticipants; // Minimum number of participants. If min is not reached by the registerEndDate then users can withdraw their cost and tournament cannot be started
    uint createdAt; // Timestamp when it was created
}

struct TournamentInfo {
    TournamentConfig config;
    uint playerCount;
    uint totalAmount;
    uint currentStep;
    TournamentState state;
    address winner;
    bool hasWithdrawn;
    address[] remainingParticipants;
}

interface IKnockout {
    function createTournament(string calldata, uint, uint, uint, uint) external;

    function participate(uint) external payable;

    function nextStep(uint) external;

    function forceNextStep(uint) external;

    function claimVictory(uint) external;

    function setVictory(uint, address, bool) external;

    function claimPrice(uint) external;

    function getTournament(uint) external view returns (TournamentInfo memory);

    function getAllTournaments()
        external
        view
        returns (TournamentInfo[] memory);

    function getState(uint) external view returns (TournamentState);
}
