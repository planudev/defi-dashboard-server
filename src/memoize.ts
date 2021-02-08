import { F } from "lodash/fp";

export const memoize = (fn: any) => {
    const cache: any = {};

    return (...args: any[]) => {
        const argStr = JSON.stringify(args);
        cache[argStr] = cache[argStr] || fn(...args);
        return cache[argStr];
    }
};