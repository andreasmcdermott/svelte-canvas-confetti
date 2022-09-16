import { BOUNDARY, DEG_TO_RAD, MOVEMENT_SPEED, ROTATION_SPEED } from './constants';
import { random } from './random';
import type { OnCreateParticle, Particle } from './types';

export const createParticle = (
	context: CanvasRenderingContext2D,
	x0: number | undefined,
	y0: number | undefined,
	force: number,
	angle: number,
	spread: number,
	colors: string[],
	images?: HTMLImageElement[],
	onCreate?: OnCreateParticle
) => {
	let dir,
		x,
		y,
		vx,
		vy,
		dx,
		dy,
		img,
		da = random(90, -90);

	if (images) {
		img = images[Math.floor(random(images.length))];
	}

	if (typeof x0 === 'number' && typeof y0 === 'number') {
		// When we have an origin, we create a confetti burst
		x = x0;
		y = y0;
		vx = random(force, 5);
		vy = random(force, 5);
		dir = random(angle + spread / 2, angle - spread / 2) * DEG_TO_RAD;
		da *= 2;
	} else {
		// Otherwise we drop confetti from the top of the screen
		x = random(context.canvas.width);
		y = random(-BOUNDARY);
		vx = random(5);
		vy = random(5, 1);
		dir = random(180) * DEG_TO_RAD;
	}

	dx = Math.cos(dir);
	dy = Math.sin(dir);

	let particle: Particle = {
		dead: false,
		life: 0,
		x,
		y,
		angle: random(360),
		da,
		dx: dx * vx,
		dy: dy * vy,
		w: random(18, 10),
		h: random(6, 4),
		color: colors[Math.floor(random(colors.length))],
		gx: 0,
		gy: random(4.5, 2),
		xw: random(6, 1),
		img
	};

	if (onCreate) particle = onCreate(particle);
	return particle;
};

export const renderParticle = (context: CanvasRenderingContext2D, p: Particle) => {
	if (p.dead) return;
	context.save();
	context.fillStyle = p.color;
	context.translate(p.x, p.y);
	context.rotate(p.angle * DEG_TO_RAD);
	if (p.img) {
		context.drawImage(p.img, -p.img.width / 2, -p.img.height / 2);
	} else {
		context.beginPath();
		context.rect(p.w * -0.5, p.h * -0.5, p.w, p.h);
		context.fill();
	}
	context.restore();
};

export const updateParticle = (p: Particle, dt: number) => {
	if (p.dead) return;
	p.life += dt;
	p.angle += p.da * dt * ROTATION_SPEED;
	p.dy += p.gy * dt * ROTATION_SPEED;
	p.dx += random(4, 2) * Math.sin(p.life * p.xw) * dt;
	p.dx *= 0.98;
	p.dy *= 0.98;
	p.x += p.dx * MOVEMENT_SPEED;
	p.y += p.dy * MOVEMENT_SPEED;
};

export const isOutOfBounds = (context: CanvasRenderingContext2D, p: Particle) =>
	p.x < -BOUNDARY ||
	p.x > context.canvas.width + BOUNDARY ||
	p.y > context.canvas.height + BOUNDARY;
