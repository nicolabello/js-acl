export function removeDuplicates<T>(items: T[]): T[] {
    return items.filter((item, index) => items.indexOf(item) === index);
}
