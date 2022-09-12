<script lang="ts">
	import { FallingConfetti, ConfettiBurst, ConfettiCannon, random, coinFlip } from '$lib';

	let counter = 0;

	let fallingConfettis: { id: number; particleCount: number }[] = [];
	const triggerFallingConfetti = () => {
		fallingConfettis = [
			...fallingConfettis,
			{
				id: counter++,
				particleCount: random(100, 1)
			}
		];
	};

	let confettiBursts: { id: number; particleCount: number; x0: number; y0: number }[] = [];
	const triggerConfettiBurst = () => {
		confettiBursts = [
			...confettiBursts,
			{
				id: counter++,
				particleCount: random(100, 1),
				x0: random((window.innerWidth / 4) * 3, window.innerWidth / 4),
				y0: random((window.innerHeight / 4) * 3, window.innerHeight / 4)
			}
		];
	};

	let confettiCannons: {
		id: number;
		particleCount: number;
		spread: number;
		angle: number;
		force: number;
		x0: number;
		y0: number;
	}[] = [];
	const triggerConfettiCannon = () => {
		const left = coinFlip();

		confettiCannons = [
			...confettiCannons,
			{
				id: counter++,
				particleCount: random(100, 1),
				spread: random(90, 45),
				angle: random(65, 25) + (left ? 270 : 180),
				force: random(55, 25),
				x0: left ? 0 : window.innerWidth,
				y0: window.innerHeight
			}
		];
	};
</script>

<main>
	<button on:click={triggerFallingConfetti}>Falling Confetti!</button>
	<button on:click={triggerConfettiBurst}>Confetti Burst!</button>
	<button on:click={triggerConfettiCannon}>Confetti Cannon!</button>

	{#each fallingConfettis as { id, particleCount } (id)}
		<FallingConfetti
			{particleCount}
			on:completed={() => {
				fallingConfettis = fallingConfettis.filter((c) => c.id !== id);
			}}
		/>
	{/each}

	{#each confettiBursts as { id, x0, y0, particleCount } (id)}
		<ConfettiBurst
			{x0}
			{y0}
			{particleCount}
			on:completed={() => {
				confettiBursts = confettiBursts.filter((c) => c.id !== id);
			}}
		/>
	{/each}

	{#each confettiCannons as { id, x0, y0, angle, spread, force, particleCount } (id)}
		<ConfettiCannon
			{x0}
			{y0}
			{angle}
			{spread}
			{force}
			{particleCount}
			on:completed={() => {
				confettiCannons = confettiCannons.filter((c) => c.id !== id);
			}}
		/>
	{/each}
</main>

<style>
	:global(body) {
		margin: 0;
		width: 100vw;
		height: 100vh;
	}

	main {
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		height: 100%;
	}
</style>
