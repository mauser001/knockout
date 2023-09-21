export enum TournamentState {
    CREATED,
    STARTED,
    FINISHED,
    CANCELED
}

type TournamentConfig = {
    owner: string;
    name: string;
    ticketCost: bigint;
    fee: bigint;
    registerEndDate: bigint;
    minParticipants: bigint;
    createdAt: bigint;
}

export type Tournament = {
    id: number;
    config: TournamentConfig;
    playerCount: bigint;
    totalAmount: bigint;
    currentStep: bigint;
    state: TournamentState;
    winner: string;
    remainingParticipants: Array<string>;
    participants?: Array<string>;
    participating: boolean;
    hasWithdrawn: boolean;
}
