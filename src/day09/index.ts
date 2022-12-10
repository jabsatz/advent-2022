import run from "aocrunner";
import _, { tail } from "lodash";
import { Vector2, Chart2 } from "../utils/index.js";

type Direction = "U" | "R" | "D" | "L";

const directionMap: Record<Direction, Vector2> = {
  U: Vector2.UP,
  R: Vector2.RIGHT,
  D: Vector2.DOWN,
  L: Vector2.LEFT,
};

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) => {
    const [dir, n] = line.split(" ") as [Direction, number];
    return [directionMap[dir], n] as [Vector2, number];
  });

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let tailPosition = Vector2.ZERO;
  let headPosition = Vector2.ZERO;
  let visited = { [Vector2.ZERO.key]: true };

  input.forEach(([direction, steps]) => {
    for (let i = 0; i < steps; i++) {
      const prevHeadPosition = headPosition.clone();
      headPosition = headPosition.add(direction);
      if (tailPosition.distanceTo(headPosition) >= 2) {
        tailPosition = prevHeadPosition;
        visited[tailPosition.key] = true;
      }
    }
  });

  return Object.values(visited).length;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let headPosition = Vector2.ZERO;
  let rope = _.range(9).map(() => Vector2.ZERO);
  let visited = { [Vector2.ZERO.key]: true };

  input.forEach(([direction, steps]) => {
    for (let i = 0; i < steps; i++) {
      headPosition = headPosition.add(direction);

      let newRope: Vector2[] = [];

      rope.forEach((knotPosition, i) => {
        const nextKnotPosition = i === 0 ? headPosition : newRope[i - 1];
        let newPosition = knotPosition.clone();
        if (knotPosition.distanceTo(nextKnotPosition) >= 2) {
          if (nextKnotPosition.x > knotPosition.x) {
            newPosition = newPosition.add(Vector2.RIGHT);
          }
          if (nextKnotPosition.x < knotPosition.x) {
            newPosition = newPosition.add(Vector2.LEFT);
          }
          if (nextKnotPosition.y > knotPosition.y) {
            newPosition = newPosition.add(Vector2.DOWN);
          }
          if (nextKnotPosition.y < knotPosition.y) {
            newPosition = newPosition.add(Vector2.UP);
          }
        }
        newRope[i] = newPosition;
      });

      rope = newRope;
      const tail = _.last(rope);
      if (tail) {
        visited[tail.key] = true;
      }
    }
  });

  return Object.values(visited).length;
};

run({
  part1: {
    tests: [
      {
        input: `
          R 4
          U 4
          L 3
          D 1
          R 4
          D 1
          L 5
          R 2
        `,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          R 4
          U 4
          L 3
          D 1
          R 4
          D 1
          L 5
          R 2
        `,
        expected: 1,
      },
      {
        input: `
          R 5
          U 8
          L 8
          D 3
          R 17
          D 10
          L 25
          U 20
        `,
        expected: 36,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
