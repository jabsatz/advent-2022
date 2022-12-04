import run from "aocrunner";
import lodash from "lodash";

const parseInput = (rawInput: string) => rawInput.split("\n");

const letterToPriority = (letter: string) => {
  const charCode = letter.charCodeAt(0);
  // esto mueve los caracteres lowercase de 97 a 1 y los uppercase de 65 a 27
  return charCode >= 97 ? charCode - 96 : charCode - 38;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const repeatedItems = input.map((backpack) => {
    const firstHalf = backpack.substring(0, backpack.length / 2);
    const secondHalf = backpack.substring(backpack.length / 2);
    for (let char of firstHalf) {
      if (secondHalf.includes(char)) {
        return letterToPriority(char);
      }
    }
  });

  return lodash.sum(repeatedItems);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const groups = lodash.chunk(input, 3);
  const repeatedItems = groups.map((group) => {
    for (let char of group[0]) {
      if (group[1].includes(char) && group[2].includes(char)) {
        return letterToPriority(char);
      }
    }
  });
  return lodash.sum(repeatedItems);
};

run({
  part1: {
    tests: [
      {
        input: `
          vJrwpWtwJgWrhcsFMMfFFhFp
          jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
          PmmdzqPrVvPwwTWBwg
          wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
          ttgJtRGJQctTZtZT
          CrZsJsPPZsGzwwsLwLmpwMDw
        `,
        expected: 157,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          vJrwpWtwJgWrhcsFMMfFFhFp
          jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
          PmmdzqPrVvPwwTWBwg
          wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
          ttgJtRGJQctTZtZT
          CrZsJsPPZsGzwwsLwLmpwMDw
        `,
        expected: 70,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
