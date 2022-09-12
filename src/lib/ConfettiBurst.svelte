<script lang="ts">
	import Confetti from './Confetti.svelte';

	export let particleCount = 50;
	export let x0: number;
	export let y0: number;
</script>

<Confetti {particleCount} {x0} {y0} on:completed />
