export const searchFunction = (a, b) =>
  a.filter((aa) =>
    JSON.stringify(Object.values(aa)).toLowerCase().includes(b.toLowerCase())
  );
