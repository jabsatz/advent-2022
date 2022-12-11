import run from "aocrunner";
import _ from "lodash";

type Monkey = {
  id: number;
  items: number[];
  operation: (item: number) => number;
  modulo: number;
  targetIfTrue: number;
  targetIfFalse: number;
  inspections: number;
};

const parseInput = (rawInput: string) =>
  rawInput.split("\n\n").map((block) => {
    const [id, items, operation, test, ifTrue, ifFalse] = block.split("\n");
    const modulo = Number(test.match(/\d+/)?.[0]);
    return {
      id: Number(id.match(/\d+/)?.[0]),
      items: items
        .match(/(\d+(, )?)+/)?.[0]
        .split(", ")
        .map(Number),
      operation: (item: number) => {
        const operator = operation.match(/\+|\*/)?.[0] as "+" | "*";
        const operands = (operation.match(/(?<=\=).*$/)?.[0] ?? "")
          .split(operator)
          .map((str) => {
            const rawOperand = str.trim();
            if (rawOperand === "old") return item;
            return Number(rawOperand);
          }) as [number, number];
        if (operator === "+") {
          return _.sum(operands);
        } else if (operator === "*") {
          return _.multiply(...operands);
        }
      },
      modulo,
      targetIfTrue: Number(ifTrue.match(/\d+/)?.[0]),
      targetIfFalse: Number(ifFalse.match(/\d+/)?.[0]),
      inspections: 0,
    } as Monkey;
  });

const part1 = (rawInput: string) => {
  let monkeys = parseInput(rawInput);
  for (let i = 0; i < 20; i++) {
    monkeys.forEach((monkey) => {
      monkey.items.forEach((item) => {
        const newWorryLevel = Math.floor(monkey.operation(item) / 3);
        const target =
          newWorryLevel % monkey.modulo === 0
            ? monkey.targetIfTrue
            : monkey.targetIfFalse;
        monkeys[target].items.push(newWorryLevel);
        monkey.inspections++;
      });
      monkey.items = [];
    });
  }

  return _.multiply(
    ...(monkeys
      .map((monkey) => monkey.inspections)
      .sort((a, b) => (a < b ? 1 : -1))
      .slice(0, 2) as [number, number]),
  );
};

const part2 = (rawInput: string) => {
  let monkeys = parseInput(rawInput);
  const greatModulo = monkeys.reduce((prev, curr) => prev * curr.modulo, 1);
  for (let i = 0; i < 10000; i++) {
    monkeys.forEach((monkey) => {
      monkey.items.forEach((item) => {
        const newWorryLevel = monkey.operation(item) % greatModulo;
        const target =
          newWorryLevel % monkey.modulo === 0
            ? monkey.targetIfTrue
            : monkey.targetIfFalse;
        monkeys[target].items.push(newWorryLevel);
        monkey.inspections++;
      });
      monkey.items = [];
    });
  }

  return _.multiply(
    ...(monkeys
      .map((monkey) => monkey.inspections)
      .sort((a, b) => (a < b ? 1 : -1))
      .slice(0, 2) as [number, number]),
  );
};

run({
  part1: {
    tests: [
      {
        input: `Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1`,
        expected: 10605,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1`,
        expected: 2713310158,
      },
    ],
    solution: part2,
  },
  trimTestInputs: false,
  onlyTests: false,
});
