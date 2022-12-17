import _ from "lodash";
import chalk from "chalk";
import util from "util";
import { Vector2 } from "./Vector2.js";
import { Line2 } from "./Line2.js";

export type PolygonEdge = {
  line: Line2;
  insideDirection: Vector2;
};

export class Polygon2 {
  points: Vector2[];
  edges: PolygonEdge[];

  constructor(points: Vector2[] = []) {
    this.points = points;
    const lines = this.points.map((corner, i, arr) => {
      const nextCorner = arr[(i + 1) % arr.length];
      return new Line2(corner, nextCorner);
    });
    this.edges = lines.map((line) => {
      const possibleInsideDirections = [
        line.direction.rotated(90),
        line.direction.rotated(-90),
      ];
      const midPoint = new Vector2(
        line.end.x - line.start.x,
        line.end.y - line.start.y,
      );
      const insideDirection = possibleInsideDirections.find(
        (possibleInsideDirection) => {
          const lineForCast = new Line2(
            midPoint,
            midPoint.add(possibleInsideDirection),
          );
          const intersectingLines = lines.filter((line) => {
            const intersection = line.intersection(lineForCast);
            return line.contains(intersection);
          });
          return intersectingLines.length % 2 === 0;
        },
      );
      if (!insideDirection) {
        console.log(possibleInsideDirections, midPoint, line);
        throw new Error("Cannot find inside direction of line above;");
      }
      return { line, insideDirection };
    });
  }

  overlaps = (_polygon2: Polygon2) => {
    _polygon2.edges.some((_edge) =>
      this.edges.some((edge) => {
        const intersection = edge.line.intersection(_edge.line);
        return (
          edge.line.contains(intersection) && _edge.line.contains(intersection)
        );
      }),
    );
  };

  join = (_polygon2: Polygon2) => {};

  [util.inspect.custom]() {
    return this.edges.map((edge) => [edge.line, edge.insideDirection.angle]);
  }
}
