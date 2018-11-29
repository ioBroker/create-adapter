/// <reference types="node" />
export interface ExecuteCommandOptions {
    /** Whether the executed command should be logged to the stdout. Default: false */
    logCommandExecution: boolean;
    /** The directory to execute the command in */
    cwd: string;
    /** Where to redirect the stdin. Default: process.stdin */
    stdin: NodeJS.ReadStream;
    /** A write stream to redirect the stdout, "ignore" to ignore it or "pipe" to return it as a string. Default: process.stdout */
    stdout: NodeJS.WriteStream | "pipe" | "ignore";
    /** A write stream to redirect the stderr, "ignore" to ignore it or "pipe" to return it as a string. Default: process.stderr */
    stderr: NodeJS.WriteStream | "pipe" | "ignore";
}
export interface ExecuteCommandResult {
    /** The exit code of the spawned process */
    exitCode: number;
    /** The signal the process received before termination */
    signal?: string;
    /** If options.stdout was set to "buffer", this contains the stdout of the spawned process */
    stdout?: string;
    /** If options.stderr was set to "buffer", this contains the stderr of the spawned process */
    stderr?: string;
}
export declare function executeCommand(command: string, options?: Partial<ExecuteCommandOptions>): Promise<ExecuteCommandResult>;
/**
 * Executes a command and returns the exit code and (if requested) the stdout
 * @param command The command to execute
 * @param args The command line arguments for the command
 * @param options (optional) Some options for the command execution
 */
export declare function executeCommand(command: string, args: string[], options?: Partial<ExecuteCommandOptions>): Promise<ExecuteCommandResult>;
