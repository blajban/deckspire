export function set_intersection<T>(...sets: Set<T>[]): Set<T> {
  const result = new Set<T>();
  if (sets.length !== 0) {
    sets.sort((a, b) => a.size - b.size);
    for (const val of sets.shift()!) {
      if (sets.every((set) => set.has(val))) {
        result.add(val);
      }
    }
  }
  return result;
}
