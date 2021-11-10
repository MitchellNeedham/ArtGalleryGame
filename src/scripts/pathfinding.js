const INTERSECTION_LINE_LENGTH = 20;

class Point {
  constructor(x, y, oldPoint) {
    this._x = oldPoint?.x ?? x;
    this._y = oldPoint?.y ?? y;
    this._prev = oldPoint?.prev ?? null;
    this._next = oldPoint?.next ?? null;
    this._connections = oldPoint?.connections ?? [];
  }

  get x() { return this._x; }

  get y() { return this._y; }

  get next() { return this._next }

  get prev() { return this._prev }

  get connections() { return this._connections }

  set next(next) { this._next = next }

  set prev(prev) { this._prev = prev }

  set connections(connections) { this._connections = connections }

  distanceTo(other) {
    return Math.sqrt(Math.pow(other.x - this.x, 2) + Math.pow(other.y - this.y, 2));
  }
}

class Line {
  constructor(p1, p2) {
    this._p1 = p1;
    this._p2 = p2;
  }

  get p1() { return this._p1; }

  get p2() { return this._p2; }

  get eq() {
    let m = null;
    let c = null;
    if (this.p1.x - this.p2.x !== 0) { 
      m = (this.p1.y - this.p2.y)/(this.p1.x - this.p2.x);
      c = this.p1.y - m * this.p1.x;
    }
    return [m, c];
  }

  intersects(other) {
    let intersectionPoint = null;
    const otherEq = other.eq;
    const thisEq = this.eq;

    if (otherEq[0] === thisEq[0]) {
      return false;
    }

    if (otherEq[0] === null) {
      const x = other.p1.x;
      intersectionPoint = new Point(
        x,
        thisEq[0] * x + thisEq[1]
      )
    }
    else if (thisEq[0] === null) {
      const x = this.p1.x;
      intersectionPoint = new Point(
        x,
        otherEq[0] * x + otherEq[1]
      )
    }
    else {
      intersectionPoint = new Point(
        (otherEq[1] - thisEq[1]) / (thisEq[0] - otherEq[0]),
        -(thisEq[1] * otherEq[0] - otherEq[1] * thisEq[0]) / (thisEq[0] - otherEq[0])
      )
    }
    return (
      inBounds(intersectionPoint.x, [this.p1.x, this.p2.x]) && inBounds(intersectionPoint.y, [this.p1.y, this.p2.y])
      && inBounds(intersectionPoint.x, [other.p1.x, other.p2.x]) && inBounds(intersectionPoint.y, [other.p1.y, other.p2.y])
    );
  }

  closestPointOnLine(point) {
    let intersectionPoint = null;
    if (this.eq[0] === 0) {
      intersectionPoint = new Point(
        point.x,
        this.p1.y
      )
    }
    else if (this.eq[0] === null) {
      intersectionPoint = new Point(
        this.p1.x,
        point.y
      )
    }
    else {
      const inverseGradient = -1/(this.eq[0]);
      const c = point.y - inverseGradient * point.x;
      const x = (this.eq[1] - c)/(inverseGradient - this.eq[0]);

      intersectionPoint = new Point(
        x,
        inverseGradient * x + c
      )
    }
    const onLine = inBounds(intersectionPoint.x, [this.p1.x, this.p2.x]) && inBounds(intersectionPoint.y, [this.p1.y, this.p2.y]);

    return onLine ? intersectionPoint : null; 
  }
}

class Polygon {
  constructor(points) {
    this._points = points.map((point) => new Point(point[0], point[1]));
    this._points.forEach((point, i) => {
      point.next = (this._points[mod(i + 1, points.length)]);
      point.prev = (this._points[mod(i - 1, points.length)])
    });

    this._sides = points.reduce((
      lines,
      p1,
      i,
      arr
    ) => {
      const p2 = arr[(i + 1) % arr.length];
      lines.push(
        new Line(
          new Point(
            p1[0], p1[1]
          ),
          new Point(
            p2[0], p2[1]
          )
        )
      )
      return lines;
    }, []);
  }

  get sides() { return this._sides; }

  get points() { return this._points; }
}

class VisibilityGraph {
  constructor(polygons) {
    const points = polygons.map((polygon) => polygon.points).reduce((prev, curr) => prev.concat(curr));
    const sides = polygons.map((polygon) => polygon.sides).reduce((prev, curr) => prev.concat(curr));

    this._sides = sides;

    this._points = points;
    this._points.forEach((point) => {
      point.connections = points.filter((p) => {
        if (isVisible(p, point, sides)) {
          const x = p.x + (point.x - p.x) / 10;
          const y = p.y + (point.y - p.y) / 10;
          const testPoint = new Point (x, y);

          return isInPolygon(testPoint, polygons) % 2 === 1;
        }
        return false;
      })
    })
  }

  get points() { return this._points; }

  getBestPath(origin, destination) {
    let paths = this._points
      .filter((polygonPoint) => isVisible(origin, polygonPoint, this._sides))
      .map((p) => [p.distanceTo(destination), origin.distanceTo(p), [p]]);
    let incompletePaths = paths;
    let completePaths = [];
    let bestPath = [];
    let i = 0;

    while (i < 100) {
      
      incompletePaths = incompletePaths
        .filter((path) => {
          const connections = path[2][path[2].length - 1].connections
          return (connections !== undefined && connections.length > 0)
        })
        .sort((path1, path2) => path1[0] - path2[0]);


      if (incompletePaths.length === 0) {
        break;
      }

      if (completePaths.length > 0) {
        bestPath = completePaths.sort((path1, path2) => path1[1] - path2[1])[0];
        if (bestPath[1] <= incompletePaths[0][1]) {
          break;
        }
      }

      let newPath = [...incompletePaths[0]];
      newPath[2] = newPath[2].map((p) => new Point(p.x, p.y, p));
      let pathLength = newPath[2].length;
      const nextPoint = newPath[2][pathLength - 1].connections.sort((p1, p2) => p1.distanceTo(destination) - p2.distanceTo(destination))[0]
      newPath[2].push(nextPoint);
      newPath[1] = newPath[1] + newPath[2][pathLength].distanceTo(newPath[2][pathLength - 1]);
      newPath[0] = newPath[2][pathLength].distanceTo(destination);

      let oldConnections = incompletePaths[0][2][incompletePaths[0][2].length - 1].connections;
      incompletePaths[0][2][incompletePaths[0][2].length - 1].connections = oldConnections.filter((p) => !(p.x === nextPoint.x && p.y === nextPoint.y));

      if (isVisible(newPath[2][pathLength], destination, this._sides)) {
        newPath[1] = newPath[1] + newPath[2][pathLength].distanceTo(destination);
        newPath[2].push(destination);
        newPath[0] = 0;
        completePaths.push(newPath);
      }
      else {
        incompletePaths.push(newPath);
      }
    }

    return bestPath[2] ?? [destination];

  }

  

}

export default function pathfinding(
  outerPolygonPoints,
  innerPolygonsPoints,
  currentPos,
  clickPos,
) {
  
  const outerPolygon = new Polygon(outerPolygonPoints);
  const innerPolygons = innerPolygonsPoints.map(points => new Polygon(points));
  let clickPoint = new Point(clickPos[0], clickPos[1]);
  let currentPoint = new Point(currentPos[0], currentPos[1]);
  let path = [];

  const targetPos = clampToPolygon(clickPoint, outerPolygon, innerPolygons);

  if (!isInPolygon(currentPoint, [outerPolygon, ...innerPolygons])) {
    currentPoint = clampToPolygon(currentPoint, outerPolygon, innerPolygons);
  }

  if (path.length === 0 && isVisible(targetPos, currentPoint, [outerPolygon, ...innerPolygons].map((p) => p.sides).reduce((prev, curr) => prev.concat(curr)))) {
    return [[targetPos.x, targetPos.y]];
  }

  const graph = new VisibilityGraph([outerPolygon, ...innerPolygons]);

  path = graph.getBestPath(currentPoint, targetPos);

  return path.map((point) => [point.x, point.y]);
}

function clampToPolygon(clickPos, outerPolygon, innerPolygons) {
  const lineCounts = isInPolygon(clickPos, [outerPolygon, ...innerPolygons]);
  if (lineCounts % 2 === 1) return clickPos;

  const closestVertex = (lineCounts === 0 ? [outerPolygon] : [outerPolygon, ...innerPolygons])
  .map((p) => p.points)
  .reduce((prev, curr) => prev.concat(curr))
  .reduce((
    cp,
    point
  ) => (
    point.distanceTo(clickPos) < cp.distanceTo(clickPos) ? point : cp
  ));

  const closestPoint = [
    new Line(closestVertex, closestVertex.next),
    new Line(closestVertex, closestVertex.prev)
  ]
  .map((line) => (line.closestPointOnLine(clickPos)))
  .filter(Boolean)
  .sort((point) => point.distanceTo(clickPos));

  return closestPoint[0] ?? closestVertex;
}

function isInPolygon(point, polygons) {

  const lineCounts = [-1, 1].map((direction) => {
    const line = new Line(point, new Point(point.x + direction * INTERSECTION_LINE_LENGTH, point.y));

    const count = polygons
    .map((p) => p.sides)
    .reduce((prev, curr) => prev.concat(curr))
    .reduce((
      acc,
      val
    ) => (
      acc + line.intersects(val)
    ), 0);
    
    return count
  })
  
  return Math.min(...lineCounts);
}

function inBounds(val, bounds) {
  const min = Math.min(...bounds);
  const max = Math.max(...bounds);
  return (val > min && val < max) || min === max;
}

function mod(n, m) {
  return ((n % m) + m) % m;
}

function isVisible(point1, point2, borders) {
  const desiredPath = new Line(point1, point2);
  return !(
    borders.some((border) => (
      desiredPath.intersects(border)
    ))
  );
}