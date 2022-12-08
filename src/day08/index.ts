import run from "aocrunner";
import _ from "lodash";
import { Chart, Coordinates } from "../utils/index.js";

const parseInput = (rawInput: string) => new Chart(rawInput);

const getVisibleTrees = (chart: Chart) => {
  let visibleTrees: string[] = [];

  chart.forEachPosition(([x, y]) => {
    const currentTree = chart.get([x, y]);
    const currentKey = chart.keyFrom([x, y]);
    const adjacents = chart.getAdjacents([x, y]);

    if (adjacents.length < 4) {
      // it's an edge
      visibleTrees.push(currentKey);
    } else {
      const visibleFromSomeSide = adjacents.some(([x2, y2]) => {
        let direction: Coordinates = [0, 0];
        if (x2 !== x) {
          direction[0] = x > x2 ? -1 : 1;
        } else if (y2 !== y) {
          direction[1] = y > y2 ? -1 : 1;
        }
        let position: Coordinates = [x2, y2];
        while (true) {
          if (!chart.isInChart(position)) {
            return true;
          }
          if (chart.get(position) >= currentTree) {
            return false;
          }
          position[0] += direction[0];
          position[1] += direction[1];
        }
      });
      if (visibleFromSomeSide) {
        visibleTrees.push(currentKey);
      }
    }
  });

  return visibleTrees;
};

const part1 = (rawInput: string) => {
  const chart = parseInput(rawInput);

  const visibleTrees = getVisibleTrees(chart);

  chart.logChart((coords) => visibleTrees.includes(chart.keyFrom(coords)));

  return visibleTrees.length;
};

const part2 = (rawInput: string) => {
  const chart = parseInput(rawInput);

  const visibleTrees = getVisibleTrees(chart);

  const scenicScores = visibleTrees.map((key) => {
    const [x, y] = chart.coordinateFromKey(key);
    const currentTree = chart.get([x, y]);
    const adjacents = chart.getAdjacents([x, y]);
    if (adjacents.length < 4) return 0;
    return adjacents.reduce((score, [x2, y2]) => {
      let direction: Coordinates = [0, 0];
      if (x2 !== x) {
        direction[0] = x > x2 ? -1 : 1;
      } else if (y2 !== y) {
        direction[1] = y > y2 ? -1 : 1;
      }
      let position: Coordinates = [x2, y2];
      let sideScore = 0;
      while (true) {
        if (!chart.isInChart(position)) {
          return score * sideScore;
        }
        if (chart.get(position) >= currentTree) {
          return score * (sideScore + 1);
        }
        sideScore += 1;
        position[0] += direction[0];
        position[1] += direction[1];
      }
    }, 1);
  });

  return _.max(scenicScores);
};

run({
  part1: {
    tests: [
      {
        input: `
          30373
          25512
          65332
          33549
          35390
        `,
        expected: 21,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          30373
          25512
          65332
          33549
          35390
        `,
        expected: 8,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
