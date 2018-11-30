/// <reference types="node" />
export declare function error(message: string): void;
export declare const isWindows: boolean;
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
/**
 * Recursively enumerates all files in the given directory
 * @param dir The directory to scan
 * @param predicate An optional predicate to apply to every found file system entry
 * @returns A list of all files found
 */
export declare function enumFilesRecursiveSync(dir: string, predicate?: (name: string) => boolean): string[];
/**
 * Recursively copies all files from the source to the target directory
 * @param sourceDir The directory to scan
 * @param targetDir The directory to copy to
 * @param predicate An optional predicate to apply to every found file system entry
 */
export declare function copyFilesRecursiveSync(sourceDir: string, targetDir: string, predicate?: (name: string) => boolean): void;
