import run from "aocrunner";
import chalk from "chalk";
import _ from "lodash";

type Item = number | Item[];
enum ORDER {
  RIGHT,
  WRONG,
  UNDEFINED,
}

const parseInput = (rawInput: string) =>
  rawInput
    .split("\n\n")
    .map(
      (block) =>
        block.split("\n").map((line) => JSON.parse(line) as Item) as [
          Item,
          Item,
        ],
    );

const compare = (a: Item, b: Item, depth = 0): ORDER => {
  console.log(
    `${_.range(depth)
      .map((a) => "  ")
      .join("")}Compare ${JSON.stringify(a)} vs ${JSON.stringify(b)}`,
  );
  if (_.isNumber(a) && _.isNumber(b)) {
    if (a === b) {
      return ORDER.UNDEFINED;
    }
    return a < b ? ORDER.RIGHT : ORDER.WRONG;
  }
  if (_.isArray(a) && _.isArray(b)) {
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
      if (a[i] === undefined) return ORDER.RIGHT;
      if (b[i] === undefined) return ORDER.WRONG;
      const comparison = compare(a[i], b[i], depth + 1);
      if (comparison !== ORDER.UNDEFINED) {
        return comparison;
      }
    }
    return ORDER.UNDEFINED;
  }
  if (_.isNumber(a) && _.isArray(b)) {
    return compare([a], b, depth + 1);
  }
  if (_.isArray(a) && _.isNumber(b)) {
    return compare(a, [b], depth + 1);
  }
  throw new Error("No valid comparison");
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const result = input.map((pair, i) => {
    console.log("");
    const comparison = compare(pair[0], pair[1]);
    if (comparison === ORDER.RIGHT) {
      console.log(chalk.bgGreen("Right order!"));
      return true;
    } else if (comparison === ORDER.WRONG) {
      console.log(chalk.bgRed("Wrong order!"));
      return false;
    } else {
      throw new Error(
        `Comparison between ${JSON.stringify(pair[0])} and ${JSON.stringify(
          pair[1],
        )} was undefined!!`,
      );
    }
  });
  console.log(result.map((a) => (a ? 1 : 0)).join(""));
  return result.reduce((sum, curr, i) => sum + (curr ? i + 1 : 0), 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const fullInput = [...input.flatMap((pair) => pair), [[2]], [[6]]];

  fullInput.sort((a, b) => {
    const comparison = compare(a, b);
    if (comparison === ORDER.RIGHT) return -1;
    if (comparison === ORDER.WRONG) return 1;
    return 0;
  });

  const a = fullInput.findIndex((val) => JSON.stringify(val) === "[[2]]");
  const b = fullInput.findIndex((val) => JSON.stringify(val) === "[[6]]");

  return (a + 1) * (b + 1);
};

run({
  part1: {
    tests: [
      // {
      //   input: `
      //     [1,1,3,1,1]
      //     [1,1,5,1,1]
      //     [[1],[2,3,4]]
      //     [[1],4]
      //     [9]
      //     [[8,7,6]]
      //     [[4,4],4,4]
      //     [[4,4],4,4,4]
      //     [7,7,7,7]
      //     [7,7,7]
      //     []
      //     [3]
      //     [[[]]]
      //     [[]]
      //     [1,[2,[3,[4,[5,6,7]]]],8,9]
      //     [1,[2,[3,[4,[5,6,0]]]],8,9]
      //   `,
      //   expected: 13,
      // },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          [1,1,3,1,1]
          [1,1,5,1,1]

          [[1],[2,3,4]]
          [[1],4]

          [9]
          [[8,7,6]]

          [[4,4],4,4]
          [[4,4],4,4,4]

          [7,7,7,7]
          [7,7,7]

          []
          [3]

          [[[]]]
          [[]]

          [1,[2,[3,[4,[5,6,7]]]],8,9]
          [1,[2,[3,[4,[5,6,0]]]],8,9]
        `,
        expected: 140,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
