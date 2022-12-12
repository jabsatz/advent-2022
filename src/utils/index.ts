import _ from "lodash";
import chalk from "chalk";

export class Vector2 {
  readonly x: number;
  readonly y: number;

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
  static DIRECTIONS = [this.UP, this.RIGHT, this.DOWN, this.LEFT];

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

  log = () => console.log(`[${this.key}]`);
}

export class Chart2 {
  rawChart: string[][];
  boundaries: Vector2;

  constructor(input: string) {
    this.rawChart = input.split("\n").map((line) => line.split(""));
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

  set = (pos: Vector2, value: string) => {
    this.rawChart[pos.y][pos.x] = value;
  };

  isInChart = (pos: Vector2) =>
    pos.x >= 0 &&
    pos.x <= this.boundaries.x &&
    pos.y >= 0 &&
    pos.y <= this.boundaries.y;

  getAdjacents = (pos: Vector2) =>
    Vector2.DIRECTIONS.map((direction) => pos.add(direction)).filter((coords) =>
      this.isInChart(coords),
    );

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

  log = (predicate: (coords: Vector2) => boolean = () => false) => {
    this.forEachPosition((pos) => {
      if (pos.x === 0) process.stdout.write("\n");
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
