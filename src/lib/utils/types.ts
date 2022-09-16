export type Particle = {
  dead: boolean;
  life: number;
  x: number;
  y: number;
  angle: number;
  da: number;
  dx: number;
  dy: number;
  w: number;
  h: number;
  color: string;
  gx: number;
  gy: number;
  xw: number;
  img?: HTMLImageElement;
};

export type OnCreateParticle = (p: Particle) => Particle;
export type OnUpdateParticle = (p: Particle, dt: number) => void;