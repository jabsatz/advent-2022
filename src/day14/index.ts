import run from "aocrunner";
import _ from "lodash";
import { Chart2, Vector2 } from "../utils/index.js";

const parseInput = (rawInput: string) =>
  rawInput
    .split("\n")
    .map((line) => line.split(" -> ").map((coord) => new Vector2(coord)));

const buildChart = (rawInput: string) => {
  const input = parseInput(rawInput);
  const chart = new Chart2();
  input.forEach((blockCoords) => {
    blockCoords.slice(0, -1).forEach((lineStart, i) => {
      const lineEnd = blockCoords[i + 1];
      const direction = lineEnd.sub(lineStart).normalized();
      const pointEnd = lineEnd.add(direction);
      for (
        let point = lineStart;
        point.key !== pointEnd.key;
        point = point.add(direction)
      ) {
        chart.set(point, "#");
      }
    });
  });
  return chart;
};

const processSand = (chart: Chart2) => {
  const sandOrigin = new Vector2(500, 0);
  const sandDirections = [
    Vector2.DOWN,
    Vector2.LEFT.add(Vector2.DOWN),
    Vector2.RIGHT.add(Vector2.DOWN),
  ];
  while (chart.isEmpty(sandOrigin)) {
    let sandPos = sandOrigin.clone();
    if (Object.values(chart.chartKeys).length % 500 === 0) {
      chart.log();
    }
    while (chart.isEmpty(sandPos)) {
      const direction = sandDirections.find((direction) =>
        chart.isEmpty(sandPos.add(direction)),
      );
      if (sandPos.y > chart.endBoundaries.y) {
        return chart;
      }
      if (!direction) {
        chart.set(sandPos, "o");
      } else {
        sandPos = sandPos.add(direction);
      }
    }
  }
};

const part1 = (rawInput: string) => {
  const chart = buildChart(rawInput);
  processSand(chart);
  chart.log();
  let result = 0;
  chart.forEachPosition((pos) => {
    if (chart.get(pos) === "o") result++;
  });
  return result;
};

const part2 = (rawInput: string) => {
  const chart = buildChart(rawInput);
  const lowerLimitY = 0;
  const upperLimitY = chart.endBoundaries.y + 2;
  const lowerLimitX = 500 - upperLimitY;
  const upperLimitX = 500 + upperLimitY + 1;
  chart.startBoundaries = new Vector2(lowerLimitX, lowerLimitY);
  chart.endBoundaries = new Vector2(upperLimitX, upperLimitY);
  for (
    let point = new Vector2(chart.startBoundaries.x, chart.endBoundaries.y);
    point.key !== chart.endBoundaries.key;
    point = point.add(Vector2.RIGHT)
  ) {
    chart.set(point, "#");
  }
  processSand(chart);
  chart.log();
  let result = 0;
  chart.forEachPosition((pos) => {
    if (chart.get(pos) === "o") result++;
  });
  return result;
};

run({
  part1: {
    tests: [
      {
        input: `
          498,4 -> 498,6 -> 496,6
          503,4 -> 502,4 -> 502,9 -> 494,9
        `,
        expected: 24,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          498,4 -> 498,6 -> 496,6
          503,4 -> 502,4 -> 502,9 -> 494,9
        `,
        expected: 93,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
