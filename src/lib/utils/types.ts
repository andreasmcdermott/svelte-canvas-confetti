export type ParticleStyle = string | HTMLImageElement;
export type Position = [number, number];

export type Particle = {
	dead: boolean;
	life: number;
	delay: number;
	x: number;
	y: number;
	angle: number;
	da: number;
	dx: number;
	dy: number;
	w: number;
	h: number;
	gy: number;
	xw: number;
	style: ParticleStyle;
};

export type OnCreateParticle = (p: Particle) => Particle;
export type OnUpdateParticle = (p: Particle, dt: number) => void;
