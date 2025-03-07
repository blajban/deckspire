export function setIntersection<T>(...sets: Set<T>[]): Set<T> {
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

export function setUnion<T>(...sets: Set<T>[]): Set<T> {
  const result = new Set<T>();
  sets.forEach((set) => {
    set.forEach((val) => {
      result.add(val);
    });
  });
  return result;
}

export function setDifference<T>(a: Set<T>, b: Set<T>): Set<T> {
  const result = new Set<T>();
  a.forEach((val) => {
    if (!b.has(val)) {
      result.add(val);
    }
  });
  return result;
}

export function setDifferenceInPlace<T>(a: Set<T>, b: Set<T>): Set<T> {
  a.forEach((val) => {
    if (b.has(val)) {
      a.delete(val);
    }
  });
  return a;
}
