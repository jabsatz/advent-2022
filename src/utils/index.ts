import _ from "lodash";
import chalk from "chalk";

export class Vector2 {
  readonly x: number;
  readonly y: number;

  constructor(...args: [string] | [[number, number]] | [number, number]) {
    let x, y;
    if (typeof args[0] === "string") {
      [x, y] = args[0].split(",").map((n) => Number(n.trim()));
    } else if (typeof args[0] === "number") {
      [x, y] = [args[0], args[1]] as [number, number];
    } else {
      [x, y] = args[0];
    }
    this.x = x;
    this.y = y;
  }

  static ZERO = new Vector2([0, 0]);
  static RIGHT = new Vector2([1, 0]);
  static LEFT = new Vector2([-1, 0]);
  static DOWN = new Vector2([0, 1]);
  static UP = new Vector2([0, -1]);
  static DIRECTIONS = [this.UP, this.RIGHT, this.DOWN, this.LEFT];

  get key() {
    return `${this.x}, ${this.y}`;
  }

  get length() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  get manhattanLength() {
    return Math.abs(this.x) + Math.abs(this.y);
  }

  get slope() {
    return this.y / this.x;
  }

  equals = (_vector2: Vector2) =>
    this.x === _vector2.x && this.y === _vector2.y;

  clone = () => new Vector2([this.x, this.y]);

  add = (_vector2: Vector2) =>
    new Vector2([this.x + _vector2.x, this.y + _vector2.y]);

  sub = (_vector2: Vector2) => this.add(_vector2.mul(-1));

  mul = (n: number) => new Vector2([this.x * n, this.y * n]);

  manhattanDistanceTo = (_vector2: Vector2) =>
    this.sub(_vector2).manhattanLength;

  distanceTo = (_vector2: Vector2) => this.sub(_vector2).length;

  normalized = () => new Vector2([this.x / this.length, this.y / this.length]);

  angle = () => (180 * Math.atan2(this.y, this.x)) / Math.PI;

  log = () => console.log(`[${this.key}]`);
}

export class Line2 {
  start: Vector2;
  end: Vector2;

  constructor(start: Vector2, end: Vector2) {
    this.start = start;
    this.end = end;
  }

  static ZERO = new Line2(Vector2.ZERO, Vector2.ZERO);

  get length() {
    return this.start.distanceTo(this.end);
  }

  get direction() {
    return this.start.sub(this.end).normalized();
  }

  get slope() {
    return this.direction.slope;
  }

  get offset() {
    return this.start.y - this.slope * this.start.x;
  }

  contains = (_vector2: Vector2) => {
    const directionFromStart = this.start.sub(_vector2).normalized();
    const directionFromEnd = this.end.sub(_vector2).normalized();
    return (
      this.direction.equals(directionFromStart) &&
      this.direction.mul(-1).equals(directionFromEnd)
    );
  };

  intersection = (_line2: Line2) => {
    const pointX = (_line2.offset - this.offset) / (this.slope - _line2.slope);
    const pointY = pointX * this.slope + this.offset;
    const point = new Vector2(pointX, pointY);
    if (this.contains(point)) {
      return point;
    }
  };

  log = () => {
    const slopeText =
      this.slope === 1 ? "" : this.slope === -1 ? "-" : this.slope;
    console.log(
      `f(x) = ${slopeText}x + ${this.offset}; From [${this.start.key}] to [${this.end.key}]`,
    );
  };
}

export class Polygon2 {
  points: Vector2[];

  constructor(points: Vector2[] = []) {
    this.points = points;
  }

  get lines() {
    return this.points.map((corner, i, arr) => {
      const nextCorner = arr[(i + 1) % arr.length];
      return new Line2(corner, nextCorner);
    });
  }

  overlaps = (_polygon2: Polygon2) => {
    _polygon2.lines.some((_line) =>
      this.lines.some((line) => line.intersection(_line)),
    );
  };

  join = (_polygon2: Polygon2) => {};
}

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

export type Edge = {
  from: string;
  to: string;
  weight: number;
};

export type Node = {
  key: string;
  edges: Edge[];
};

export class DirectedNodeGraph {
  nodes: Record<string, Node>;

  constructor() {
    this.nodes = {};
  }

  addNode(key: string) {
    this.nodes[key] = { key, edges: [] };
  }

  addEdge(from: string, to: string, weight = 1) {
    if (!this.nodes[from]) {
      this.addNode(from);
    }
    if (!this.nodes[to]) {
      this.addNode(to);
    }
    this.nodes[from].edges.push({ from: from, to: to, weight });
  }
}

export class BidirectedNodeGraph {
  nodes: Record<string, Node>;

  constructor() {
    this.nodes = {};
  }

  addNode(key: string) {
    this.nodes[key] = { key, edges: [] };
  }

  addEdge(node1: string, node2: string, weight = 1) {
    if (!this.nodes[node1]) {
      this.addNode(node1);
    }
    if (!this.nodes[node2]) {
      this.addNode(node2);
    }
    this.nodes[node1].edges.push({ from: node1, to: node2, weight });
    this.nodes[node2].edges.push({ from: node2, to: node1, weight });
  }
}
