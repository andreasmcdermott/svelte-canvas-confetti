<script lang="ts">
	import Confetti from './Confetti.svelte';
	import type { OnCreateParticle, OnUpdateParticle, Particle } from './utils/types';

	export let particleCount = 50;
	export let colors: string[] | undefined = undefined;
	export let images: HTMLImageElement[] | undefined = undefined;
	export let onCreate: OnCreateParticle | undefined = undefined;
	export let onUpdate: OnUpdateParticle | undefined = undefined;
</script>

<Confetti {particleCount} {images} {colors} {onCreate} {onUpdate} on:completed />
