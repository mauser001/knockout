export enum LogTypes {
    Info,
    Warning,
    Error,
}

export type LogEntry = {
    message: string;
    type: LogTypes;
    ts: number;
    object?: any;
}