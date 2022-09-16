<script lang="ts">
	import Confetti from './Confetti.svelte';
	import type { OnCreateParticle, OnUpdateParticle, ParticleStyle, Position } from './utils/types';

	/**
	 * The origin position of the confetti burst.
	 * @required
	 * @example
	 * ```
	 * <ConfettiBurst origin={[50, 50]} />
	 * ```
	 */
	export let origin: Position;
	/**
	 * A list of render styles to use for the confetti. Each confetti will be assigned a random value from the list.
	 * The values can either be valid HTML colors or an HTMLImageElement.
	 * @default ['hotpink','gold','dodgerblue','tomato','rebeccapurple','lightgreen','turquoise']
	 * @example
	 * ```
	 * <ConfettiBurst colors={['red', '#ff0000', 'hsl(250, 54%, 85%)']} />
	 * ```
	 */
	export let styles: ParticleStyle[] | undefined = undefined;
	/**
	 * The number of particles to create.
	 * @default 50
	 * @example
	 * ```
	 * <ConfettiBurst particleCount={100} />
	 * ```
	 */
	export let particleCount = 50;
	/**
	 * By default, each particle is created with some random variation. The initial values of each particle can be overriden using the onCreate callback.
	 * @default undefined
	 * @example
	 * ```
	 * <ConfettiBurst
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
	 * <ConfettiBurst
	 *   onUpdate={(particle, deltaTime) => {
	 *     if (particle.angle < 0 && particle.da < 0) {
	 *       particle.da *= -1;
	 * 		 }
	 * 	 }}
	 * />
	 * ```
	 */
	export let onUpdate: OnUpdateParticle | undefined = undefined;
</script>

<Confetti {particleCount} {origin} {styles} {onCreate} {onUpdate} on:completed />
