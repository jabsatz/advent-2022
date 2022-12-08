import run from "aocrunner";
import _ from "lodash";

const findMarker = (input: string, size: number) => {
  let currentMarker = input.substring(0, size).split("");
  for (let i = size; i < input.length; i++) {
    if (_.uniq(currentMarker).length === currentMarker.length) {
      return i;
    }
    currentMarker = [...currentMarker.slice(1), input[i]];
  }

  throw new Error("Could not find start");
};

const part1 = (input: string) => {
  return findMarker(input, 4);
};

const part2 = (input: string) => {
  return findMarker(input, 14);
};

run({
  part1: {
    tests: [
      {
        input: `mjqjpqmgbljsphdztnvjfqwrcgsmlb`,
        expected: 7,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `mjqjpqmgbljsphdztnvjfqwrcgsmlb`,
        expected: 19,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
