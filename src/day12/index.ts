import run from "aocrunner";
import _ from "lodash";
import { Chart2, Vector2, DirectedNodeGraph } from "../utils/index.js";

const parseInput = (rawInput: string) => {
  const startIndex = rawInput.indexOf("S");
  const endIndex = rawInput.indexOf("E");
  const newLineIndex = rawInput.indexOf("\n");
  const chart = new Chart2(rawInput.replace("E", "z").replace("S", "a"));
  return {
    chart,
    startPosition: new Vector2([
      (startIndex % newLineIndex) - Math.floor(startIndex / newLineIndex),
      Math.floor(startIndex / newLineIndex),
    ]),
    endPosition: new Vector2([
      (endIndex % newLineIndex) - Math.floor(startIndex / newLineIndex),
      Math.floor(endIndex / newLineIndex),
    ]),
  };
};

const buildGraph = (chart: Chart2) => {
  const nodeGraph = new DirectedNodeGraph();
  chart.forEachPosition((pos) => {
    const posLetter = chart.get(pos);
    chart.getAdjacents(pos).forEach((adjacent) => {
      const adjacentLetter = chart.get(adjacent);
      if (posLetter.charCodeAt(0) >= adjacentLetter.charCodeAt(0) - 1) {
        nodeGraph.addEdge(pos.key, adjacent.key);
      }
    });
  });
  return nodeGraph;
};

const breadthFirstSearch = (
  chart: Chart2,
  nodeGraph: DirectedNodeGraph,
  startPosition: Vector2,
  endPosition: Vector2,
) => {
  type QueueItem = { key: string; distance: number; path: string[] };

  const queue: QueueItem[] = [
    { key: startPosition.key, distance: 0, path: [] },
  ];
  const visited: Record<string, any> = {};
  let result: QueueItem = {
    key: endPosition.key,
    distance: Infinity,
    path: [],
  };
  while (queue.length > 0) {
    const head = queue.shift() as QueueItem;
    const node = nodeGraph.nodes[head.key];
    if (node.key === endPosition.key && head.distance < result.distance) {
      result = head;
    }
    if (!visited[node.key]) {
      visited[node.key] = true;
      node.edges.forEach((edge) => {
        queue.push({
          key: edge.to,
          distance: head.distance + edge.weight,
          path: [...head.path, node.key],
        });
      });
    }
  }
  return result;
};

const part1 = (rawInput: string) => {
  const { chart, endPosition, startPosition } = parseInput(rawInput);
  const nodeGraph = buildGraph(chart);
  const result = breadthFirstSearch(
    chart,
    nodeGraph,
    startPosition,
    endPosition,
  );
  chart.log(
    (pos) => result.path.includes(pos.key) || pos.key === endPosition.key,
  );
  return result.distance;
};

const part2 = (rawInput: string) => {
  const { chart, endPosition, startPosition } = parseInput(rawInput);
  const nodeGraph = buildGraph(chart);
  const result = breadthFirstSearch(
    chart,
    nodeGraph,
    new Vector2([0, 27]),
    endPosition,
  );
  chart.log(
    (pos) => result.path.includes(pos.key) || pos.key === endPosition.key,
  );
  return result.distance;
};

run({
  part1: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
