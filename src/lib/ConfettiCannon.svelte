<script lang="ts">
	import Confetti from './Confetti.svelte';

	export let particleCount = 50;
	export let x0: number;
	export let y0: number;
	export let force = 15;
	export let spread = 360;
	export let angle = -90;
</script>

<Confetti {particleCount} {x0} {y0} {force} {spread} {angle} on:completed />
