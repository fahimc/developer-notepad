export interface Note {
  id: string;
  title: string;
  content: string;
  raw: string;
  created: number;
}
export function sortByKey(array: any[], key: string) {
  return array.sort((a, b) => {
    const x = a[key];
    const y = b[key];
    // eslint-disable-next-line no-nested-ternary
    return x > y ? -1 : x < y ? 1 : 0;
  });
}
