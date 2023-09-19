export type BetDetails = {
    totalAmount: bigint;
    players: Array<{ address: string; total: bigint; byUser: bigint }>;
    hasWithdrawn: boolean;
}