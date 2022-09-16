<script lang="ts">
	import Confetti from './Confetti.svelte';
	import type { OnCreateParticle, OnUpdateParticle, ParticleStyle, Position } from './utils/types';

	export let particleCount = 50;
	export let origin: Position;
	export let styles: ParticleStyle[] | undefined = undefined;
	export let onCreate: OnCreateParticle | undefined = undefined;
	export let onUpdate: OnUpdateParticle | undefined = undefined;
</script>

<Confetti {particleCount} {origin} {styles} {onCreate} {onUpdate} on:completed />
