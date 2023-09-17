export function toJSTimeStamp(big: bigint): number {
    return big ? parseInt(big.toString()) * 1000 : 0;
}

export function isInTheFutureUnix(big: bigint): boolean {
    return isInTheFuture(toJSTimeStamp(big));
}

export function isInTheFuture(ts: number): boolean {
    return ts > Date.now();
}

export function dateToUnixString(date: Date): string {
    return Math.floor(date.getTime() / 1000).toString();
}