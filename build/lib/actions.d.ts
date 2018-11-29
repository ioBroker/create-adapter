export declare type CheckResult = boolean | "retry";
export declare function checkAdapterExistence(name: string): Promise<CheckResult>;
export declare function checkAuthorName(name: string): Promise<CheckResult>;
export declare function checkEmail(email: string): Promise<CheckResult>;
