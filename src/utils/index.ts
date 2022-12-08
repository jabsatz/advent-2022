/**
 * Root for your util libraries.
 *
 * You can import them in the src/template/index.ts,
 * or in the specific file.
 *
 * Note that this repo uses ES Modules, so you have to explicitly specify
 * .js extension (yes, .js not .ts - even for TypeScript files)
 * for imports that are not imported from node_modules.
 *
 * For example:
 *
 *   correct:
 *
 *     import _ from 'lodash'
 *     import myLib from '../utils/myLib.js'
 *     import { myUtil } from '../utils/index.js'
 *
 *   incorrect:
 *
 *     import _ from 'lodash'
 *     import myLib from '../utils/myLib.ts'
 *     import { myUtil } from '../utils/index.ts'
 *
 *   also incorrect:
 *
 *     import _ from 'lodash'
 *     import myLib from '../utils/myLib'
 *     import { myUtil } from '../utils'
 *
 */
import _ from "lodash";
import chalk from "chalk";

export type Coordinates = [number, number];

export class Chart {
  rawChart: number[][];
  boundaries: Coordinates;

  constructor(input: string) {
    this.rawChart = input.split("\n").map((line) => line.split("").map(Number));
    this.boundaries = [this.rawChart[0].length - 1, this.rawChart.length - 1];
  }

  keyFrom = ([x, y]: Coordinates) => `${x}, ${y}`;
  coordinateFromKey = (key: string) =>
    key.split(", ").map((n) => Number(n)) as Coordinates;

  get = (pos: Coordinates | string) => {
    let x, y;
    if (_.isArray(pos)) {
      [x, y] = pos;
    } else if (_.isString(pos)) {
      [x, y] = pos.split(", ").map(Number);
    }
    if (_.isUndefined(x) || _.isUndefined(y)) {
      throw new Error(`Could not parse position ${pos}`);
    }
    return this.rawChart[y][x];
  };

  set = ([x, y]: Coordinates, value: number) => {
    this.rawChart[y][x] = value;
  };

  isInChart = ([x, y]: Coordinates) =>
    x >= 0 && x <= this.boundaries[0] && y >= 0 && y <= this.boundaries[1];

  getAdjacents = ([x, y]: Coordinates) =>
    [
      [x - 1, y] as Coordinates,
      [x + 1, y] as Coordinates,
      [x, y - 1] as Coordinates,
      [x, y + 1] as Coordinates,
    ].filter((coords) => this.isInChart(coords));

  getDistance = ([x1, y1]: Coordinates, [x2, y2]: Coordinates) =>
    Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);

  forEachPosition(predicate: (coords: Coordinates) => any) {
    for (let y = 0; y < this.rawChart.length; y++) {
      for (let x = 0; x < this.rawChart[y].length; x++) {
        predicate([x, y]);
      }
    }
  }

  everyPosition(predicate: (coords: Coordinates) => boolean) {
    for (let y = 0; y < this.rawChart.length; y++) {
      for (let x = 0; x < this.rawChart[y].length; x++) {
        if (!predicate([x, y])) return false;
      }
    }
    return true;
  }

  logChart = (predicate: (coords: Coordinates) => boolean = () => false) => {
    this.forEachPosition((pos) => {
      if (pos[0] === 0) process.stdout.write("\n");
      if (predicate(pos))
        process.stdout.write(chalk.bgGreen(chalk.black(`${this.get(pos)}`)));
      else process.stdout.write(`${this.get(pos)}`);
    });
  };
}
