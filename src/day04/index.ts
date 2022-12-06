import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput
    .split("\n")
    .map(
      (line) =>
        line
          .split(",")
          .map((range) => range.split("-").map((n) => Number(n))) as [
          [number, number],
          [number, number],
        ],
    );

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let total = 0;
  input.forEach((pair) => {
    const firstContainsSecond =
      pair[0][0] <= pair[1][0] && pair[0][1] >= pair[1][1];
    const secondContainsFirst =
      pair[1][0] <= pair[0][0] && pair[1][1] >= pair[0][1];
    if (firstContainsSecond || secondContainsFirst) {
      total++;
    }
  });

  return total;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let total = 0;

  input.forEach((pair) => {
    const firstContainsSecond =
      pair[0][0] <= pair[1][0] && pair[0][1] >= pair[1][1];
    const secondContainsFirst =
      pair[1][0] <= pair[0][0] && pair[1][1] >= pair[0][1];
    const hasOverlap =
      (pair[0][0] >= pair[1][0] && pair[0][0] <= pair[1][1]) ||
      (pair[0][1] <= pair[1][1] && pair[0][1] >= pair[1][0]) ||
      firstContainsSecond ||
      secondContainsFirst;
    if (hasOverlap) {
      total++;
    }
  });

  return total;
};

run({
  part1: {
    tests: [
      {
        input: `
          2-4,6-8
          2-3,4-5
          5-7,7-9
          2-8,3-7
          6-6,4-6
          2-6,4-8
        `,
        expected: 2,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          2-4,6-8
          2-3,4-5
          5-7,7-9
          2-8,3-7
          6-6,4-6
          2-6,4-8
        `,
        expected: 4,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
