<script lang="ts" context="module">
	import { random } from './utils/random';
	import type { OnCreateParticle, OnUpdateParticle, Particle } from './utils/types';
	import { DEG_TO_RAD, ROTATION_SPEED, MOVEMENT_SPEED, BOUNDARY, COLORS } from './utils/constants';

	const createParticle = (
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
		let dir, x, y, vx, vy, dx, dy, img;

		if (images) {
			img = images[Math.floor(random(images.length))];
		}

		if (typeof x0 === 'number' && typeof y0 === 'number') {
			x = x0;
			y = y0;
			vx = random(force, 5);
			vy = random(force, 5);
			dir = random(angle + spread / 2, angle - spread / 2) * DEG_TO_RAD;
		} else {
			x = random(context.canvas.width);
			y = random(-25);
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
			da: random(90, -90),
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

	const renderParticles = (context: CanvasRenderingContext2D, particles: Particle[]) => {
		context.clearRect(0, 0, context.canvas.width, context.canvas.height);

		for (let i = 0; i < particles.length; ++i) {
			const p = particles[i];
			if (p.dead) continue;
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
		}
	};

	const updateParticles = (
		context: CanvasRenderingContext2D,
		particles: Particle[],
		dt: number,
		onUpdate?: OnUpdateParticle
	) => {
		let livingParticles = particles.length;

		for (let i = 0; i < particles.length; ++i) {
			let p = particles[i];
			if (p.dead) {
				livingParticles--;
				continue;
			}

			p.life += dt;
			p.angle += p.da * dt * ROTATION_SPEED;
			p.dy += p.gy * dt * ROTATION_SPEED;
			p.dx += random(4, 2) * Math.sin(p.life * p.xw) * dt;
			p.dx *= 0.98;
			p.dy *= 0.98;
			p.x += p.dx * MOVEMENT_SPEED;
			p.y += p.dy * MOVEMENT_SPEED;

			if (
				p.x < -BOUNDARY ||
				p.x > context.canvas.width + BOUNDARY ||
				p.y > context.canvas.height + BOUNDARY
			) {
				p.dead = true;
			}

			if (onUpdate) onUpdate(p, dt);
		}

		return livingParticles > 0;
	};

	const create = (
		canvas: HTMLCanvasElement,
		onCompleted: () => void,
		particleCount: number,
		x0: number | undefined,
		y0: number | undefined,
		force: number,
		angle: number,
		spread: number,
		colors: string[],
		images?: HTMLImageElement[],
		onCreate?: OnCreateParticle,
		onUpdate?: OnUpdateParticle
	) => {
		const context = canvas.getContext('2d');
		if (!context) throw new Error('No context?');
		const particles: Particle[] = Array.from({ length: particleCount }, () =>
			createParticle(context, x0, y0, force, angle, spread, colors, images, onCreate)
		);

		let frameId: number, t: number;

		const run = (_t: number) => {
			renderParticles(context, particles);
			const stillRunning = updateParticles(context, particles, (_t - t) / 1e3, onUpdate);
			if (stillRunning) {
				t = _t;
				frameId = requestAnimationFrame(run);
			} else {
				onCompleted();
			}
		};

		return () => {
			t = performance.now();
			frameId = requestAnimationFrame(run);

			return () => {
				cancelAnimationFrame(frameId);
			};
		};
	};
</script>

<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';

	export let colors = COLORS;
	export let images: HTMLImageElement[] | undefined = undefined;
	export let particleCount = 50;
	export let x0: number | undefined = undefined;
	export let y0: number | undefined = undefined;
	export let force = 15;
	export let angle = 0;
	export let spread = 360;
	export let onCreate: OnCreateParticle | undefined = undefined;
	export let onUpdate: OnUpdateParticle | undefined = undefined;

	const dispatch = createEventDispatcher();
	let canvas: HTMLCanvasElement;
	let w: number, h: number;

	onMount(() => {
		canvas.width = w;
		canvas.height = h;
		const start = create(
			canvas,
			() => dispatch('completed'),
			particleCount,
			x0,
			y0,
			force,
			angle,
			spread,
			colors,
			images,
			onCreate,
			onUpdate
		);
		return start();
	});
</script>

<svelte:window bind:innerWidth={w} bind:innerHeight={h} />
<canvas bind:this={canvas} width={w} height={h} />

<style>
	canvas {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 999999;
	}
</style>
