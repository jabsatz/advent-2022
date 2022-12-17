import run from "aocrunner";
import _ from "lodash";
import { Line2, Polygon2, PolygonEdge, Vector2 } from "../utils/index.js";

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) => {
    const matches = line.match(
      /Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/,
    );
    if (!matches) throw new Error("Bad input");
    const [sensorX, sensorY, beaconX, beaconY] = matches.slice(1).map(Number);
    return {
      sensor: new Vector2(sensorX, sensorY),
      beacon: new Vector2(beaconX, beaconY),
    };
  });

const mergeLines = (_lines: Line2[]) =>
  _lines.reduce((lines, line) => {
    const mergingAreaIndex = lines.findIndex(
      (_line) => _line.contains(line.start) || _line.contains(line.end),
    );
    const mergingArea = lines[mergingAreaIndex];
    if (!mergingArea) {
      return [...lines, line];
    }
    if (mergingArea.contains(line.start) && mergingArea.contains(line.end)) {
      return lines;
    }

    let newArea = Line2.ZERO;
    if (mergingArea.contains(line.start)) {
      newArea = new Line2(mergingArea.start, line.end);
    } else {
      newArea = new Line2(line.start, mergingArea.end);
    }
    return [...lines.filter((area, i) => i !== mergingAreaIndex), newArea];
  }, [] as Line2[]);

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const magicY = 2_000_000;

  const magicLines = input.flatMap(({ sensor, beacon }) => {
    const manhattanDistance = sensor.manhattanDistanceTo(beacon);
    const magicCenter = new Vector2(sensor.x, magicY);
    const distanceToCenter = sensor.manhattanDistanceTo(magicCenter);
    const remainder = manhattanDistance - distanceToCenter;
    if (remainder < 0) {
      return [];
    }
    const start = new Vector2(sensor.x - remainder, magicY);
    const end = new Vector2(sensor.x + remainder, magicY);
    return [new Line2(start, end)];
  });

  const mergedLines = mergeLines(magicLines);

  return _.sum(mergedLines.map((area) => area.length));
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const testPoint = new Vector2(20, 20);
  const finalPoint = new Vector2(4_000_000, 4_000_000);
  const boundingBox = new Line2(Vector2.ZERO, testPoint);

  const sensorPolygons = input.map(({ sensor, beacon }) => {
    const manhattanDistance = sensor.manhattanDistanceTo(beacon);
    const polygon = new Polygon2(
      Vector2.DIRECTIONS.map((direction) =>
        direction.mul(manhattanDistance).add(sensor),
      ),
    );
    return polygon;
  });

  let edgePairs: [PolygonEdge, PolygonEdge][] = [];
  for (let i = 0; i < sensorPolygons.length; i++) {
    const polygon = sensorPolygons[i];
    for (let _polygon of sensorPolygons.slice(i + 1)) {
      polygon.edges.forEach((edge) => {
        _polygon.edges.forEach((_edge) => {
          const isOppositeOrientation =
            edge.insideDirection.angle ===
            (_edge.insideDirection.angle + 180) % 360;

          const isCorrectOrientation =
            (edge.insideDirection.angle === 45 &&
              edge.line.offset - _edge.line.offset === 2) ||
            (edge.insideDirection.angle === 135 &&
              edge.line.offset - _edge.line.offset === 2) ||
            (edge.insideDirection.angle === 225 &&
              edge.line.offset - _edge.line.offset === -2) ||
            (edge.insideDirection.angle === 315 &&
              edge.line.offset - _edge.line.offset === -2);

          if (isOppositeOrientation && isCorrectOrientation) {
            edgePairs.push([edge, _edge]);
          }
        });
      });
    }
  }
  const lines = edgePairs.map(([edge1, edge2]) =>
    Line2.fromCanonical(
      edge1.line.slope,
      edge1.line.offset + (edge1.insideDirection.angle >= 225 ? 1 : -1),
    ),
  );
  if (lines.length !== 2) {
    throw new Error("Flasheaste que se yo");
  }
  const point = lines[0].intersection(lines[1]);
  if (!point) {
    throw new Error("Flasheaste que se yo");
  }

  return point.x * 4_000_000 + point.y;
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
      //   input: `
      //     Sensor at x=2, y=18: closest beacon is at x=-2, y=15
      //     Sensor at x=9, y=16: closest beacon is at x=10, y=16
      //     Sensor at x=13, y=2: closest beacon is at x=15, y=3
      //     Sensor at x=12, y=14: closest beacon is at x=10, y=16
      //     Sensor at x=10, y=20: closest beacon is at x=10, y=16
      //     Sensor at x=14, y=17: closest beacon is at x=10, y=16
      //     Sensor at x=8, y=7: closest beacon is at x=2, y=10
      //     Sensor at x=2, y=0: closest beacon is at x=2, y=10
      //     Sensor at x=0, y=11: closest beacon is at x=2, y=10
      //     Sensor at x=20, y=14: closest beacon is at x=25, y=17
      //     Sensor at x=17, y=20: closest beacon is at x=21, y=22
      //     Sensor at x=16, y=7: closest beacon is at x=15, y=3
      //     Sensor at x=14, y=3: closest beacon is at x=15, y=3
      //     Sensor at x=20, y=1: closest beacon is at x=15, y=3
      //   `,
      //   expected: 56000011,
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
