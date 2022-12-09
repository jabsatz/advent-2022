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

export class Vector2 {
  x: number;
  y: number;

  constructor(input: string | [number, number]) {
    let x, y;
    if (typeof input === "string") {
      [x, y] = input.split(", ").map((n) => Number(n));
    } else {
      [x, y] = input;
    }
    this.x = x;
    this.y = y;
  }

  static ZERO = new Vector2([0, 0]);
  static RIGHT = new Vector2([1, 0]);
  static LEFT = new Vector2([-1, 0]);
  static DOWN = new Vector2([0, 1]);
  static UP = new Vector2([0, -1]);

  get key() {
    return `${this.x}, ${this.y}`;
  }

  get length() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  clone = () => new Vector2([this.x, this.y]);

  add = (_vector2: Vector2) =>
    new Vector2([this.x + _vector2.x, this.y + _vector2.y]);

  sub = (_vector2: Vector2) => this.add(_vector2.mul(-1));

  mul = (n: number) => new Vector2([this.x * n, this.y * n]);

  distanceTo = (_vector2: Vector2) => this.sub(_vector2).length;

  normalized = () => new Vector2([this.x / this.length, this.y / this.length]);

  print = () => console.log(`[${this.key}]`);
}

export class Chart {
  rawChart: number[][];
  boundaries: Vector2;

  constructor(input: string) {
    this.rawChart = input.split("\n").map((line) => line.split("").map(Number));
    this.boundaries = new Vector2([
      this.rawChart[0].length - 1,
      this.rawChart.length - 1,
    ]);
  }

  get = (pos: Vector2) => {
    if (!this.isInChart(pos)) {
      throw new Error(`position [${pos.key}] is not in chart`);
    }
    return this.rawChart[pos.y][pos.x];
  };

  set = (pos: Vector2, value: number) => {
    this.rawChart[pos.y][pos.x] = value;
  };

  isInChart = (pos: Vector2) =>
    pos.x >= 0 &&
    pos.x <= this.boundaries.x &&
    pos.y >= 0 &&
    pos.y <= this.boundaries.y;

  getAdjacents = (pos: Vector2) =>
    [
      new Vector2([pos.x - 1, pos.y]),
      new Vector2([pos.x + 1, pos.y]),
      new Vector2([pos.x, pos.y - 1]),
      new Vector2([pos.x, pos.y + 1]),
    ].filter((coords) => this.isInChart(coords));

  forEachPosition(predicate: (coords: Vector2) => any) {
    for (let y = 0; y < this.rawChart.length; y++) {
      for (let x = 0; x < this.rawChart[y].length; x++) {
        predicate(new Vector2([x, y]));
      }
    }
  }

  everyPosition(predicate: (coords: Vector2) => boolean) {
    for (let y = 0; y < this.rawChart.length; y++) {
      for (let x = 0; x < this.rawChart[y].length; x++) {
        if (!predicate(new Vector2([x, y]))) return false;
      }
    }
    return true;
  }

  logChart = (predicate: (coords: Vector2) => boolean = () => false) => {
    this.forEachPosition((pos) => {
      if (pos.x === 0) process.stdout.write("\n");
      if (predicate(pos))
        process.stdout.write(chalk.bgGreen(chalk.black(`${this.get(pos)}`)));
      else process.stdout.write(`${this.get(pos)}`);
    });
    process.stdout.write("\n");
  };
}
