import _ from "lodash";
import chalk from "chalk";
import util from "util";

export const radiansToDegrees = (radians: number) =>
  (360 + (180 * radians) / Math.PI) % 360;
export const degreesToRadians = (degrees: number) => -degrees * (Math.PI / 180);

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

  get angle() {
    return radiansToDegrees(Math.atan2(this.y, this.x));
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

  rotated = (degrees: number) => {
    const radians = degreesToRadians(degrees);
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    return new Vector2(
      this.x * cos - this.y * sin,
      this.x * sin + this.y * cos,
    );
  };

  [util.inspect.custom]() {
    return chalk.whiteBright(`[${this.key}]`);
  }
}
