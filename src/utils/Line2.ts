import _ from "lodash";
import chalk from "chalk";
import util from "util";
import { Vector2 } from "./Vector2.js";

export class Line2 {
  start: Vector2;
  end: Vector2;

  constructor(start: Vector2, end: Vector2) {
    this.start = start;
    this.end = end;
  }

  static fromCanonical = (slope: number, offset: number) => {
    const start = new Vector2(0, offset);
    const end = new Vector2(1, slope + offset);
    return new Line2(start, end);
  };
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

  get key() {
    return `from ${this.start.key} to ${this.end.key}`;
  }

  contains = (_vector2?: Vector2) => {
    if (!_vector2) return false;
    const angleFromStart = this.start.sub(_vector2).angle;
    const angleFromEnd = this.end.sub(_vector2).angle;
    return (
      this.direction.angle === angleFromStart &&
      this.direction.mul(-1).angle === angleFromEnd
    );
  };

  // intersection may be outside limits
  intersection = (_line2: Line2) => {
    if (this.slope === _line2.slope) return undefined;
    const pointX = (_line2.offset - this.offset) / (this.slope - _line2.slope);
    const pointY = pointX * this.slope + this.offset;
    const point = new Vector2(pointX, pointY);
    return point;
  };

  [util.inspect.custom]() {
    const slopeText =
      this.slope === 1 ? "" : this.slope === -1 ? "-" : this.slope;
    return chalk.blue(
      `f(x) = ${slopeText}x + ${this.offset}; From [${this.start.key}] to [${this.end.key}]`,
    );
  }
}
