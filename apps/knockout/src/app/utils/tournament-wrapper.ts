import { Tournament, TournamentState } from "../models";
import { isInTheFutureUnix } from "./time";

const TournamentWrapper = (tournament?: Tournament, address?: string) => {
    const isOwner = () => {
        return !!address && tournament?.config.owner === address;
    }

    const canJoin = () => {
        return !!address && !!tournament && !isOwner() && isInTheFutureUnix(tournament.config.registerEndDate) && !tournament.participating;
    }

    const canClaim = () => {
        return !!address && !tournament?.hasWithdrawn && tournament?.participating && (tournament?.state === TournamentState.CANCELED || (tournament?.state === TournamentState.FINISHED && tournament?.winner === address));
    }

    const canWin = () => {
        return !!address && tournament?.state === TournamentState.STARTED && tournament?.remainingParticipants.includes(address);
    }

    const canStart = () => {
        return !!address && tournament?.state === TournamentState.CREATED && isOwner() && tournament.config.minParticipants <= tournament.playerCount;
    }

    const canChange = () => {
        return !!address && tournament?.state === TournamentState.STARTED && isOwner();
    }

    const canPlaceBet = () => {
        return !!address && !isOwner() && tournament && tournament.state === TournamentState.CREATED && !isInTheFutureUnix(tournament.config.registerEndDate);
    }

    const winner = (): string | undefined => {
        return tournament?.state === TournamentState.FINISHED ? tournament?.winner : undefined;
    }

    return {
        get winner() { return winner() },
        get isOwner() { return isOwner() },
        get canJoin() { return canJoin() },
        get canClaim() { return canClaim() },
        get canWin() { return canWin() },
        get canChange() { return canChange() },
        get canStart() { return canStart() },
        get canPlaceBet() { return canPlaceBet() },
    }
}

export { TournamentWrapper };