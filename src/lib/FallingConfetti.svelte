<script lang="ts">
	import Confetti from './Confetti.svelte';

	export let particleCount = 50;
</script>

<Confetti {particleCount} on:completed />
