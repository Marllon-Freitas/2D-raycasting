export function createBoundary(x1, y1, x2, y2, ctx) {
  let a = createVector(x1, y1);
  let b = createVector(x2, y2);

  function rotate(angle) {
    let x1 = a.x;
    let y1 = a.y;
    let x2 = b.x;
    let y2 = b.y;

    let x1_ = x1 * Math.cos(angle) - y1 * Math.sin(angle);
    let y1_ = x1 * Math.sin(angle) + y1 * Math.cos(angle);
    let x2_ = x2 * Math.cos(angle) - y2 * Math.sin(angle);
    let y2_ = x2 * Math.sin(angle) + y2 * Math.cos(angle);

    a = createVector(x1_, y1_);
    b = createVector(x2_, y2_);
  }

  function draw() {
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  return { a, b, rotate, draw };
}

export function createFlashlight(pos, angle, ctx) {
  let dir = createVector(Math.cos(angle), Math.sin(angle));

  function lookAt(x, y) {
    dir.x = x - pos.x;
    dir.y = y - pos.y;
    let len = Math.sqrt(dir.x * dir.x + dir.y * dir.y);
    dir.x /= len;
    dir.y /= len;
  }

  function draw() {
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.lineTo(pos.x + dir.x * 10, pos.y + dir.y * 10);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  function rotate(angle) {
    let x = dir.x;
    let y = dir.y;
    dir.x = x * Math.cos(angle) - y * Math.sin(angle);
    dir.y = x * Math.sin(angle) + y * Math.cos(angle);
  }

  function cast(wall) {
    let x1 = wall.a.x;
    let y1 = wall.a.y;
    let x2 = wall.b.x;
    let y2 = wall.b.y;

    let x3 = pos.x;
    let y3 = pos.y;
    let x4 = pos.x + dir.x;
    let y4 = pos.y + dir.y;

    let den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

    if (den == 0) return;

    let t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
    let u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;

    if (t > 0 && t < 1 && u > 0) {
      let pt = createVector(x1 + t * (x2 - x1), y1 + t * (y2 - y1));
      return pt;
    } else {
      return;
    }
  }

  return { pos, dir, lookAt, draw, rotate, cast };
}

export function createPlayer(ctx) {
  let pos = createVector(100, 200);
  let rays = [];

  function updateRays() {
    rays = [];
    for (let i = 0; i < 45; i += 0.1) {
      rays.push(createFlashlight(pos, i * Math.PI / 180, ctx));
    }
  }

  updateRays();

  function rotate(angle) {
    for (let ray of rays) {
      ray.rotate(angle);
    }
  }

  function draw() {
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "white";
    ctx.stroke();
    for (let ray of rays) {
      ray.draw();
    }
  }

  function update(x, y) {
    pos.x = x;
    pos.y = y;
  }

  function look(walls) {
    for (let ray of rays) {
      let closest = null;
      let record = Infinity;
      for (let wall of walls) {
        let pt = ray.cast(wall);
        if (pt) {
          let distance = Math.sqrt((pos.x - pt.x) * (pos.x - pt.x) + (pos.y - pt.y) * (pos.y - pt.y));
          if (distance < record) {
            record = distance;
            closest = pt;
          }
        }
      }
      if (closest) {
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        ctx.lineTo(closest.x, closest.y);
        ctx.strokeStyle = "white";
        ctx.stroke();
      }
    }
  }

  return { pos, rays, rotate, draw, update, look };
}

function createVector(x, y) {
  return { x, y };
}