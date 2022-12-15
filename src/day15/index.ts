import run from "aocrunner";
import _ from "lodash";
import { Line2, Polygon2, Vector2 } from "../utils/index.js";

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

  let sensorPolygons = input.map(({ sensor, beacon }) => {
    const manhattanDistance = sensor.manhattanDistanceTo(beacon);
    const polygon = new Polygon2(
      Vector2.DIRECTIONS.map((direction) =>
        direction.mul(manhattanDistance).add(sensor),
      ),
    );
    console.log(manhattanDistance);
    sensor.log();
    return polygon;
  });

  // while(sensorPolygons.length > 0)

  // magicAreas.forEach((corners) => corners.forEach((corner) => corner.log()));

  return;
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
      {
        input: `
          Sensor at x=2, y=18: closest beacon is at x=-2, y=15
          Sensor at x=9, y=16: closest beacon is at x=10, y=16
          Sensor at x=13, y=2: closest beacon is at x=15, y=3
          Sensor at x=12, y=14: closest beacon is at x=10, y=16
          Sensor at x=10, y=20: closest beacon is at x=10, y=16
          Sensor at x=14, y=17: closest beacon is at x=10, y=16
          Sensor at x=8, y=7: closest beacon is at x=2, y=10
          Sensor at x=2, y=0: closest beacon is at x=2, y=10
          Sensor at x=0, y=11: closest beacon is at x=2, y=10
          Sensor at x=20, y=14: closest beacon is at x=25, y=17
          Sensor at x=17, y=20: closest beacon is at x=21, y=22
          Sensor at x=16, y=7: closest beacon is at x=15, y=3
          Sensor at x=14, y=3: closest beacon is at x=15, y=3
          Sensor at x=20, y=1: closest beacon is at x=15, y=3
        `,
        expected: 56000011,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});
