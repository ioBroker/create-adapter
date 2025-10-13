declare module "yargs" {
import type { YargsFactory } from "yargs/browser";
const Yargs: ReturnType<typeof YargsFactory>;
export default Yargs;
}

declare module "yargs/helpers" {
export function hideBin(args: string[]): string[];
}
