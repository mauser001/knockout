export function addItemToList(item: string, list: string[]) {
    if (!list.includes(item)) {
        list.push(item);
    }
}

export function removeItemFromList(item: string, list: string[]) {
    if (list.includes(item)) {
        list.splice(list.indexOf(item), 1);
    }
}

export function mergeLists(list1: string[], list2: string[]): string[] {
    return [...new Set([...list1, ...list2])];
}