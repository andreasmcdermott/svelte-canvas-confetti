<script lang="ts" context="module">
	import type {
		OnCreateParticle,
		OnUpdateParticle,
		Particle,
		ParticleStyle,
		Position
	} from './utils/types';
	import { COLORS } from './utils/constants';
	import { createParticle, isOutOfBounds, renderParticle, updateParticle } from './utils/particle';

	const renderParticles = (context: CanvasRenderingContext2D, particles: Particle[]) => {
		context.clearRect(0, 0, context.canvas.width, context.canvas.height);

		for (let i = 0; i < particles.length; ++i) {
			renderParticle(context, particles[i]);
		}
	};

	/**
	 * @returns {boolean} Returns false if no more confettis on the screen.
	 */
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
		origin: Position | undefined,
		force: number,
		angle: number,
		spread: number,
		styles: (HTMLImageElement | string)[],
		onCreate?: OnCreateParticle,
		onUpdate?: OnUpdateParticle
	) => {
		const context = canvas.getContext('2d');
		if (!context) throw new Error('No context?');

		const particles: Particle[] = Array.from({ length: particleCount }, () =>
			createParticle(context, origin, force, angle, spread, styles, onCreate)
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

	/**
	 * A list of render styles to use for the confetti. Each confetti will be assigned a random value from the list.
	 * The values can either be valid HTML colors or an HTMLImageElement.
	 * @default ['hotpink','gold','dodgerblue','tomato','rebeccapurple','lightgreen','turquoise']
	 * @example
	 * ```
	 * <Confetti colors={['red', '#ff0000', 'hsl(250, 54%, 85%)']} />
	 * ```
	 */
	export let styles: ParticleStyle[] = COLORS;
	/**
	 * The number of particles to create.
	 * @default 50
	 * @example
	 * ```
	 * <Confetti particleCount={100} />
	 * ```
	 */
	export let particleCount = 50;
	/**
	 * The origin position of the confetti. If this is not passed in, the confetti will fall from the top of the screen.
	 * @default undefined
	 * @example
	 * ```
	 * <Confetti origin={[50, 50]} />
	 * ```
	 */
	export let origin: Position | undefined = undefined;
	/**
	 * The force of the burst. A larger number will shoot the confetti faster and further. Has no effect if origin isn't passed in.
	 * @default 15
	 * @example
	 * ```
	 * <Confetti origin={[50, 50]} force={15} />
	 * ```
	 */
	export let force = 15;
	/**
	 * Angle in degrees of the burst. This can be used together with spread to create a directed burst. Has no effect if origin isn't passed in.
	 * @default 0
	 * @example
	 * ```
	 * <Confetti origin={[50, 50]} angle={90} />
	 * ```
	 */
	export let angle = 0;
	/**
	 * The spread in degrees of the burst. This can be used together with angle to create a directed burst. Has no effect if origin isn't passed in.
	 * @default 360
	 * @example
	 * ```
	 * <Confetti origin={[50, 50]} spread={90} />
	 * ```
	 */
	export let spread = 360;
	/**
	 * By default, each particle is created with some random variation. The initial values of each particle can be overriden using the onCreate callback.
	 * @default undefined
	 * @example
	 * ```
	 * <Confetti
	 *   onCreate={(particle) => {
	 *     particle.style = 'blue';
	 *     particle.x = window.innerWidth / 2;
	 *     return particle;
	 * 	 }}
	 * />
	 * ```
	 */
	export let onCreate: OnCreateParticle | undefined = undefined;
	/**
	 * The onUpdate callback can be used to modify the particle on each frame.
	 * @default undefined
	 * @example
	 * ```
	 * <Confetti
	 *   onUpdate={(particle, deltaTime) => {
	 *     if (particle.angle < 0 && particle.da < 0) {
	 *       particle.da *= -1;
	 * 		 }
	 * 	 }}
	 * />
	 * ```
	 */
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
			origin,
			force,
			angle,
			spread,
			styles,
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
