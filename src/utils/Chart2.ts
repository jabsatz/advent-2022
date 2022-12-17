import _ from "lodash";
import chalk from "chalk";
import util from "util";
import { Vector2 } from "./Vector2.js";

export class Chart2 {
  chartKeys: Record<string, any>;
  startBoundaries: Vector2;
  endBoundaries: Vector2;
  emptyToken = " ";

  constructor(input?: string) {
    this.chartKeys = {};
    this.startBoundaries = new Vector2([0, 0]);
    this.endBoundaries = new Vector2([0, 0]);
    if (input) {
      let maxX = 0;
      let maxY = 0;
      input.split("\n").forEach((line, y) => {
        if (y > maxY) maxY = y;
        line.split("").forEach((char, x) => {
          if (x > maxX) maxX = x;
          this.chartKeys[new Vector2([x, y]).key] = char;
        });
      });
      this.startBoundaries = new Vector2([0, 0]);
      this.endBoundaries = new Vector2([maxX, maxY]);
    }
  }

  clone = () => {
    const clonedChart = new Chart2();
    this.forEachPosition((pos) => {
      clonedChart.set(pos, this.get(pos));
    });
    return clonedChart;
  };

  get = (pos: Vector2) => {
    if (!this.isInChart(pos)) {
      throw new Error(`position [${pos.key}] is not in chart`);
    }
    if (this.isEmpty(pos)) {
      return this.emptyToken;
    }
    return this.chartKeys[pos.key];
  };

  set = (pos: Vector2, value: string) => {
    if (Object.values(this.chartKeys).length === 0) {
      this.startBoundaries = pos.clone();
    }
    if (this.endBoundaries.x < pos.x) {
      this.endBoundaries = new Vector2([pos.x, this.endBoundaries.y]);
    }
    if (this.endBoundaries.y < pos.y) {
      this.endBoundaries = new Vector2([this.endBoundaries.x, pos.y]);
    }
    if (this.startBoundaries.x > pos.x) {
      this.startBoundaries = new Vector2([pos.x, this.startBoundaries.y]);
    }
    if (this.startBoundaries.y > pos.y) {
      this.startBoundaries = new Vector2([this.startBoundaries.x, pos.y]);
    }
    this.chartKeys[pos.key] = value;
  };

  isInChart = (pos: Vector2) =>
    pos.x >= this.startBoundaries.x &&
    pos.x <= this.endBoundaries.x &&
    pos.y >= this.startBoundaries.y &&
    pos.y <= this.endBoundaries.y;

  isEmpty = (pos: Vector2) => _.isUndefined(this.chartKeys[pos.key]);

  getAdjacents = (pos: Vector2) =>
    Vector2.DIRECTIONS.map((direction) => pos.add(direction)).filter((coords) =>
      this.isInChart(coords),
    );

  everyPosition(predicate: (coords: Vector2) => boolean) {
    for (let y = this.startBoundaries.y; y <= this.endBoundaries.y; y++) {
      for (let x = this.startBoundaries.x; x <= this.endBoundaries.x; x++) {
        if (!predicate(new Vector2([x, y]))) return false;
      }
    }
    return true;
  }

  forEachPosition(predicate: (coords: Vector2) => any) {
    this.everyPosition((pos) => {
      predicate(pos);
      return true;
    });
  }

  log = (predicate: (coords: Vector2) => boolean = () => false) => {
    this.forEachPosition((pos) => {
      if (pos.x === this.startBoundaries.x) process.stdout.write("\n");
      if (predicate(pos))
        process.stdout.write(chalk.bgGreen(chalk.black(`${this.get(pos)}`)));
      else process.stdout.write(`${this.get(pos)}`);
    });
    process.stdout.write("\n");
  };
}
