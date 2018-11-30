export declare type CheckResult = boolean | "retry";
export declare function checkMinSelections(category: string, min: number, answers: any[]): Promise<CheckResult>;
export declare function checkAdapterExistence(name: string): Promise<CheckResult>;
export declare function checkAuthorName(name: string): Promise<CheckResult>;
export declare function checkEmail(email: string): Promise<CheckResult>;
export declare function transformAdapterName(name: string): string;
