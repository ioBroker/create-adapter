import { prompt } from "enquirer";
import { CheckResult } from "./actionsAndTransformers";
declare type PromptOptions = Exclude<Parameters<typeof prompt>[0], Function | any[]>;
declare type QuestionAction<T> = (value: T) => Promise<CheckResult>;
export declare type AnswerValue = string | boolean | number;
export declare type Condition = {
    name: string;
} & ({
    value: AnswerValue | AnswerValue[];
} | {
    contains: AnswerValue;
});
interface QuestionMeta {
    condition?: Condition;
    resultTransform?: (val: AnswerValue | AnswerValue[]) => AnswerValue | AnswerValue[];
    action?: QuestionAction<AnswerValue | AnswerValue[]>;
}
declare type Question = PromptOptions & QuestionMeta;
export declare const questions: (Question | string)[];
export {};
