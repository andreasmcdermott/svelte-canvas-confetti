<script lang="ts">
	import { onMount } from 'svelte';
	import { assets } from '$app/paths';
	import {
		FallingConfetti,
		ConfettiBurst,
		ConfettiCannon,
		random,
		coinFlip,
		type Particle,
		type OnCreateParticle,
		type OnUpdateParticle
	} from '$lib';
	import type { ParticleStyle, Position } from '$lib/utils/types';

	let counter = 0;
	let particleCount = Math.floor(random(100, 1));
	let img: HTMLImageElement;

	onMount(() => {
		img = new Image();
		img.src = `${assets}/parachute.png`;
	});

	let fallingConfettis: { id: number; particleCount: number }[] = [];
	const triggerFallingConfetti = () => {
		fallingConfettis = [
			...fallingConfettis,
			{
				id: counter++,
				particleCount
			}
		];
	};

	let parachutes: {
		id: number;
		styles: ParticleStyle[];
		particleCount: number;
		onCreate: OnCreateParticle;
		onUpdate: OnUpdateParticle;
	}[] = [];
	const triggerParachutes = () => {
		parachutes = [
			...parachutes,
			{
				id: counter++,
				styles: [img],
				particleCount,
				onCreate: (p: Particle) => {
					p.angle = 0;
					p.gy = 2;
					p.da = random(35, -35);
					return p;
				},
				onUpdate: (p: Particle) => {
					if ((p.angle > 35 && p.da > 0) || (p.angle < -35 && p.da < 0)) {
						p.da *= -1;
					}
				}
			}
		];
	};

	let confettiBursts: { id: number; particleCount: number; origin: Position }[] = [];
	const triggerConfettiBurst = () => {
		confettiBursts = [
			...confettiBursts,
			{
				id: counter++,
				particleCount,
				origin: [
					random((window.innerWidth / 4) * 3, window.innerWidth / 4),
					random((window.innerHeight / 4) * 3, window.innerHeight / 4)
				]
			}
		];
	};

	let confettiCannons: {
		id: number;
		particleCount: number;
		spread: number;
		angle: number;
		force: number;
		origin: Position;
	}[] = [];
	const triggerConfettiCannon = () => {
		const left = coinFlip();

		confettiCannons = [
			...confettiCannons,
			{
				id: counter++,
				particleCount,
				spread: random(90, 25),
				angle: random(65, 25) + (left ? 270 : 180),
				force: random(55, 25),
				origin: [left ? 0 : window.innerWidth, window.innerHeight]
			}
		];
	};
</script>

<main class="vertical center">
	<div class="horizontal">
		<button on:click={triggerFallingConfetti}>Falling Confetti!</button>
		<button on:click={triggerConfettiBurst}>Confetti Burst!</button>
		<button on:click={triggerConfettiCannon}>Confetti Cannon!</button>
		<button on:click={triggerParachutes}>Parachutes!</button>
	</div>

	<div class="vertical">
		<div class="horizontal">
			<label for="particle-count">Particle Count</label>
			<input
				id="particle-count"
				type="range"
				min="5"
				max="200"
				bind:value={particleCount}
				step="1"
			/>
			<span>{particleCount}</span>
		</div>
	</div>

	{#each fallingConfettis as { id, particleCount } (id)}
		<FallingConfetti
			{particleCount}
			on:completed={() => {
				fallingConfettis = fallingConfettis.filter((c) => c.id !== id);
			}}
		/>
	{/each}

	{#each parachutes as { id, particleCount, styles, onCreate, onUpdate } (id)}
		<FallingConfetti
			{particleCount}
			{styles}
			{onCreate}
			{onUpdate}
			on:completed={() => {
				parachutes = parachutes.filter((c) => c.id !== id);
			}}
		/>
	{/each}

	{#each confettiBursts as { id, origin, particleCount } (id)}
		<ConfettiBurst
			{origin}
			{particleCount}
			on:completed={() => {
				confettiBursts = confettiBursts.filter((c) => c.id !== id);
			}}
		/>
	{/each}

	{#each confettiCannons as { id, origin, angle, spread, force, particleCount } (id)}
		<ConfettiCannon
			{origin}
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
		font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
	}

	main {
		position: relative;
		height: 100%;
	}

	.vertical {
		display: flex;
		flex-direction: column;
	}

	.horizontal {
		display: flex;
		margin-top: 2rem;
	}

	.center {
		justify-content: center;
		align-items: center;
	}

	button {
		cursor: pointer;
		border: none;
		border-radius: 4px;
		padding: 0.75rem 2rem;
		margin: 1rem;
		font-weight: bold;
		font-size: 1rem;
		font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
		color: white;
		background: linear-gradient(-45deg, hsl(260, 95%, 75%), hsl(300, 95%, 75%));
		box-shadow: 5px 5px 0 0 rgba(0, 0, 0, 0.8);
		text-shadow: -1px -1px rgba(0, 0, 0, 0.6);
		transition: transform 0.1s ease-in-out, box-shadow 0.1s ease-in-out;
	}

	button:hover {
		background: linear-gradient(-45deg, hsl(260, 95%, 65%), hsl(300, 95%, 65%));
	}

	button:active {
		transform: translate(2px, 2px);
		box-shadow: 3px 3px 0 0 rgba(0, 0, 0, 0.8);
	}

	input {
		accent-color: hsl(260, 95%, 65%);
	}

	[type='range'] {
		min-width: 300px;
		width: 50%;
	}

	label {
		min-width: 150px;
		flex: none;
		margin-right: 2rem;
	}

	span {
		flex: none;
		min-width: 40px;
		text-align: right;
	}
</style>
