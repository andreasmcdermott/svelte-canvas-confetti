# svelte-canvas-confetti 🎉

## Features

* Uses a single canvas to render full-screen confetti.
* Supports image-based confetti.
* Allows full customization of confetti behavior using `onCreate` and `onUpdate` hooks.

## Examples

[Simple Demo](https://svelte.dev/repl/651daab486674a71a750b711aac76a7d?version=3.50.1)

[Advanced Demo](https://svelte.dev/repl/32552f9527e54eafb2e6d95af183212b?version=3.50.1)

## Installing

```
npm install svelte-canvas-confetti
```

## Basic Usage

The package includes four Svelte components.

### FallingConfetti

Adds confetti falling from the top of the screen.

```
<script>
	import { FallingConfetti } from 'svelte-canvas-confetti';
</script>

<FallingConfetti />
```

### ConfettiBurst

Adds a confetti burst anywhere on the screen. It requires an origin position.

```
<script>
	import { ConfettiBurst } from 'svelte-canvas-confetti';
</script>

<ConfettiBurst origin={[window.innerWidth / 2, window.innerHeight / 2]} />
```

### ConfettiCannon

Adds a confetti cannon that can shoot out directional confetti. It requires an origin position.

```
<script>
	import { ConfettiCannon } from 'svelte-canvas-confetti';
</script>

<ConfettiCannon origin={[window.innerWidth / 2, window.innerHeight]} />
```

### Confetti

Adds any type of confetti. This is the main component that the other three are just simple wrappers around. 

If no properties are passed in, it will create the same result as **FallingConfetti**.

```
<script>
	import { Confetti } from 'svelte-canvas-confetti';
</script>

<Confetti />
```

## Props

### particleCount

Number of particles to create.

**Type:** `number`
**Default value:** `50`
**Example:**

```
<Confetti particleCount={100} />
```

### styles

A list of styles used to render particles. Can be any valid HTML color or an HTMLImageElement.

**Type:** `Array<string | HTMLImageElement>`
**Default value:** `['hotpink','gold','dodgerblue','tomato','rebeccapurple','lightgreen','turquoise']`
**Example:**

```
<Confetti styles={['red', '#00ff00', 'hsl(120, 65%, 85%)']} />
```

### origin

The origin of the particles. If this is not used, the particles will fall from the top of the screen.

**Type:** `[number, number]`
**Default value:** `undefined`
**Example:**

```
<Confetti origin={[100, 100]} />
```

### force

The initial force used to shoot out confetti. This has no effect if `origin` is not used.

**Type:** `number`
**Default value:** 15
**Example:**

```
<Confetti origin={[50, 50]} force={25} />
```

### angle

The angle used to shoot out confetti. This has no effect if `origin` is not used. It can be combined with `spread` to create a "cannon".

**Type:** `number`
**Default value:** 0
**Example:**

```
<Confetti origin={[50, 50]} angle={90} />
```

### spread

The spread used when creating each particles initial direction. The particle's initial direction will be a value between `angle - spread / 2` and `angle + spread / 2`. This has no effect if `origin` is not used.

**Type:** `number`
**Default value:** 360
**Example:**

```
<Confetti origin={[100, 100]} spread={45} />
```

## onCreate

This can be used to override the properties of each particle at creation time.

**Type:** `(particle) => particle`
**Default value:** undefined
**Example:**

```
<Confetti 
  onCreate={(particle) => {
    particle.x = 0;
    particle.y = 0;
    return particle;
  }} 
/>
```

## onUpdate

This can be used to override the properties of each particle at update time.

**Type:** `(particle, deltaTime) => void`
**Default value:** undefined
**Example:**

```
<Confetti 
  onCreate={(particle) => {
    particle.x += Math.random() * 5;
  }} 
/>
```

## Particle object

```ts
export type Particle = {
  // Stop updating/rendering the particle once it is "dead" (ie off screen) 
	dead: boolean;
  
  // The total time since the particle was created.
	life: number;
  
  // The delay between the creation of the particle and when it starts updating/rendering (in seconds).
	delay: number;

  // The x position of the particle.
	x: number;

  // The y position of the particle.
	y: number;

  // The current angle of the particle.
	angle: number;

  // The rotation speed of the particle.
	da: number;

  // The horizontal speed of the particle.
	dx: number;

  // The vertical speed of the particle.
	dy: number;

  // The width of the particle (not used with images).
	w: number;

  // The height of the particle (not used with images).
	h: number;

  // Vertical gravity.
	gy: number;

  // The "width" of the falling motion. The falling motion is calculated as Math.sin(life * xw)
	xw: number;

  // The style of the particle. Either an HTML color or an HTMLImageElement.
	style: ParticleStyle;
};
```

## License

MIT License @copy; [Andreas McDermott](https://github.com/andreasmcdermott)