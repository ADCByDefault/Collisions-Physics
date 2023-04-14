const infoBallCoords = document.querySelector("#infoBallCoords");
const infoCollisionCoords = document.querySelector("#infoCollisionCoords");

/**@type {HTMLCanvasElement} */
const canvas = document.querySelector("#canvas");
/**@type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ball = new Ball({ x: canvas.width / 2, y: canvas.height / 2 + 50 }, ctx);
const brick = new Block(
    {
        x: canvas.width / 2 - Block.size.x / 2,
        y: canvas.height / 2 - Block.size.y / 2 + 50,
    },
    ctx
);

window.addEventListener("mousemove", (e) => {
    ball.setPosition({ x: e.clientX, y: e.clientY });
});

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    brick.setCenterTo(canvas.width / 2, canvas.height / 2 + 50);
});

function animation() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    brick.draw();
    ball.draw();
    handleCollision(ball, brick);
    window.requestAnimationFrame(animation);
}
animation();

/**
 * draws a line from the ball center to the nearest collision point
 * between the rectangle, and color them red if they are colliding.
 * if you want only the collision data use checkCollision()
 * @param {Ball} ball
 * @param {Block} brick
 *
 * @returns {object} collision data
 */
function handleCollision(ball, brick) {
    const collision = checkCollision(ball, brick);
    if (collision.isColliding) {
        ball.setColor("#800b03");
        brick.setColor("#f0554a");
    } else {
        ball.setColor(Ball.color);
        brick.setColor(Block.color);
    }

    //drawing line and points
    {
        ctx.save();
        if (collision.isColliding) {
            ctx.fillStyle = "red";
            ctx.strokeStyle = "firebrick";
        } else {
            ctx.strokeStyle = "whiteSmoke";
            ctx.fillStyle = "whiteSmoke";
        }
        ctx.beginPath();
        ctx.moveTo(ball.x, ball.y);
        ctx.lineTo(collision.collisionCoords.x, collision.collisionCoords.y);
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, 5, 0, Math.PI * 2);
        ctx.arc(
            collision.collisionCoords.x,
            collision.collisionCoords.y,
            5,
            0,
            Math.PI * 2
        );
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }
    setInfo(collision);
    return collision;
}
/**
 *
 * detects the collison between a circle and non rotated rectangle
 * @param {Ball} ball
 * @param {Block} brick
 * @returns {object} collision data
 */
function checkCollision(ball, brick) {
    const collision = clamp(
        brick.x,
        brick.x + brick.size.x,
        brick.y,
        brick.y + brick.size.y,
        ball.x,
        ball.y
    );
    collision.ballCoords = {
        x: ball.x,
        y: ball.y,
    };
    collision.distance = Math.sqrt(
        Math.pow(ball.x - collision.collisionCoords.x, 2) +
            Math.pow(ball.y - collision.collisionCoords.y, 2)
    );
    if (collision.distance <= ball.size) {
        collision.isColliding = true;
    }
    collision.collisionDirection = "";
    {
        switch (collision.collisionCoords.y) {
            case brick.y:
                collision.collisionDirection += "top";
                break;
            case brick.y + brick.size.y:
                collision.collisionDirection += "bottom";
                break;
            default:
                break;
        }
        switch (collision.collisionCoords.x) {
            case brick.x:
                collision.collisionDirection += "left";
                break;
            case brick.x + brick.size.x:
                collision.collisionDirection += "right";
                break;
            default:
                break;
        }
    }

    return collision;
}
/**
 *
 * @param {number} minx
 * @param {number} maxx
 * @param {number} miny
 * @param {number} maxy
 * @param {number} posx
 * @param {number} posy
 * @returns {object} nearest collision points, it's better to use checkCollision()
 */
function clamp(minx, maxx, miny, maxy, posx, posy) {
    const collision = {
        collisionCoords: {
            x: posx,
            y: posy,
        },
    };
    if (posx < minx) {
        collision.collisionCoords.x = minx;
    }
    if (posx > maxx) {
        collision.collisionCoords.x = maxx;
    }
    if (posy < miny) {
        collision.collisionCoords.y = miny;
    }
    if (posy > maxy) {
        collision.collisionCoords.y = maxy;
    }
    return collision;
}

function setInfo(collision) {
    infoBallCoords.textContent = `${collision.ballCoords.x} , ${collision.ballCoords.y}`;
    if (!collision.isColliding) {
        infoCollisionCoords.style.color = "whiteSmoke";
        infoCollisionCoords.textContent = `${collision.collisionCoords.x.toFixed(
            0
        )} , ${collision.collisionCoords.y.toFixed(0)}`;
        return;
    }
    infoCollisionCoords.style.color = "fireBrick";
    infoCollisionCoords.textContent = "colliding";
}
