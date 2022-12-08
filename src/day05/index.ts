import run from "aocrunner";
import _ from "lodash";

type Status = Record<number, string[]>;

const parseInput = (rawInput: string) => {
  const [rawStatus, rawInstructions] = rawInput.split("\n\n");

  const status: Status = {};
  _.forEachRight(rawStatus.split("\n"), (line) => {
    if (line.match(/\d/)) {
      [...line.matchAll(/\d/g)].forEach((match) => {
        status[Number(match[0])] = [];
      });
    } else {
      Object.keys(status).forEach((pos) => {
        const stringIndex = Number(pos) * 4 - 3;
        if (line[stringIndex] != " ") {
          status[Number(pos)].push(line[stringIndex]);
        }
      });
    }
  });

  const instructions = rawInstructions.split("\n").map((line) => {
    const [amount, from, to] = [...line.matchAll(/\d+/g)].map((match) =>
      Number(match[0]),
    );
    return { amount, from, to };
  });

  return { status, instructions };
};

const part1 = (rawInput: string) => {
  const { status, instructions } = parseInput(rawInput);

  const finalStatus = instructions.reduce((prevStatus, instruction, i) => {
    const newStatus: Status = { ...prevStatus };

    const partToMove = newStatus[instruction.from]
      .splice(
        newStatus[instruction.from].length - instruction.amount,
        newStatus[instruction.from].length,
      )
      .reverse();
    newStatus[instruction.to] = [...newStatus[instruction.to], ...partToMove];

    return newStatus;
  }, status);

  return Object.values(finalStatus)
    .map((column) => _.last(column))
    .join("");
};

const part2 = (rawInput: string) => {
  const { status, instructions } = parseInput(rawInput);

  const finalStatus = instructions.reduce((prevStatus, instruction, i) => {
    const newStatus: Status = { ...prevStatus };

    const partToMove = newStatus[instruction.from].splice(
      newStatus[instruction.from].length - instruction.amount,
      newStatus[instruction.from].length,
    );
    newStatus[instruction.to] = [...newStatus[instruction.to], ...partToMove];

    return newStatus;
  }, status);

  return Object.values(finalStatus)
    .map((column) => _.last(column))
    .join("");
};

run({
  part1: {
    tests: [
      {
        input: `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`,
        expected: "CMZ",
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`,
        expected: "MCD",
      },
    ],
    solution: part2,
  },
  trimTestInputs: false,
  onlyTests: false,
});
