<script lang="ts">
	import Confetti from './Confetti.svelte';
	import type { OnCreateParticle, OnUpdateParticle, Particle } from './utils/types';

	export let particleCount = 50;
	export let x0: number;
	export let y0: number;
	export let colors: string[] | undefined = undefined;
	export let images: HTMLImageElement[] | undefined = undefined;
	export let onCreate: OnCreateParticle | undefined = undefined;
	export let onUpdate: OnUpdateParticle | undefined = undefined;
</script>

<Confetti {particleCount} {x0} {y0} {images} {colors} {onCreate} {onUpdate} on:completed />
