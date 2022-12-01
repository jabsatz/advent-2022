import run from "aocrunner";

const parseInput = (rawInput: string): number[][] =>
  rawInput
    .split("\n\n")
    .map((elfInventory) => elfInventory.split("\n").map((n) => Number(n)));

const part1 = (rawInput: string) => {
  const elfInventories = parseInput(rawInput);

  let biggest = 0;
  elfInventories.forEach((elfInventory) => {
    const total = elfInventory.reduce((prev, curr) => prev + curr, 0);
    if (total > biggest) {
      biggest = total;
    }
  });

  return biggest;
};

const part2 = (rawInput: string) => {
  const elfInventories = parseInput(rawInput);

  let biggest: number[] = [];
  elfInventories.forEach((elfInventory) => {
    const total = elfInventory.reduce((prev, curr) => prev + curr, 0);
    if (biggest.length < 3) {
      biggest.push(total);
    } else if (biggest[0] < total) {
      biggest[0] = total;
    }
    biggest = biggest.sort((a, b) => (a > b ? 1 : -1));
  });

  return biggest.reduce((prev, curr) => prev + curr, 0);
};

run({
  part1: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`,
        expected: 45000,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
