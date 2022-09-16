<script lang="ts" context="module">
	import type { OnCreateParticle, OnUpdateParticle, Particle } from './utils/types';
	import { COLORS } from './utils/constants';
	import { createParticle, isOutOfBounds, renderParticle, updateParticle } from './utils/particle';

	const renderParticles = (context: CanvasRenderingContext2D, particles: Particle[]) => {
		context.clearRect(0, 0, context.canvas.width, context.canvas.height);

		for (let i = 0; i < particles.length; ++i) {
			renderParticle(context, particles[i]);
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
			const p = particles[i];
			if (p.dead) {
				livingParticles--;
			} else {
				updateParticle(p, dt);
				if (isOutOfBounds(context, p)) p.dead = true;
				if (onUpdate) onUpdate(p, dt);
			}
		}

		return livingParticles > 0;
	};

	const start = (
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

		t = performance.now();
		frameId = requestAnimationFrame(run);

		return () => {
			cancelAnimationFrame(frameId);
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
		return start(
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
