import run from "aocrunner";
import _ from "lodash";
import { Chart2, Vector2 } from "../utils/index.js";

const parseInput = (rawInput: string) => new Chart2(rawInput);

const getVisibleTrees = (chart: Chart2) => {
  let visibleTrees: string[] = [];

  chart.forEachPosition((pos) => {
    const currentTree = chart.get(pos);
    const currentKey = pos.key;
    const adjacents = chart.getAdjacents(pos);

    if (adjacents.length < 4) {
      // it's an edge
      visibleTrees.push(currentKey);
    } else {
      const visibleFromSomeSide = adjacents.some((pos2) => {
        const direction = pos2.sub(pos);
        let position = pos2.clone();
        while (true) {
          if (!chart.isInChart(position)) {
            return true;
          }
          if (chart.get(position) >= currentTree) {
            return false;
          }
          position = position.add(direction);
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

  return visibleTrees.length;
};

const part2 = (rawInput: string) => {
  const chart = parseInput(rawInput);

  const visibleTrees = getVisibleTrees(chart);

  const scenicScores = visibleTrees.map((key) => {
    const pos = new Vector2(key);
    const currentTree = chart.get(pos);
    const adjacents = chart.getAdjacents(pos);
    if (adjacents.length < 4) return 0;
    return adjacents.reduce((score, pos2) => {
      const direction = pos2.sub(pos);
      let position = pos2.clone();
      let sideScore = 0;
      while (true) {
        if (!chart.isInChart(position)) {
          return score * sideScore;
        }
        if (chart.get(position) >= currentTree) {
          return score * (sideScore + 1);
        }
        sideScore += 1;
        position = position.add(direction);
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
