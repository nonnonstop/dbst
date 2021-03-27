// eslint-disable-next-line no-unused-vars
interface DbstData {
  breed: BreedHorse[];
  race: RaceHorse[];
}

interface BreedHorse {
  name: string;
  year: number;
  speed: number;
  stamina: number;
}

interface RaceHorse {
  name: string;
  year: number;
  sex: number;
  bestWeight: number;
  diffWeight: number;
  cond: number;
  speed: number;
  speedMax: number;
  stamina: number;
  staminaMax: number;
  guts: number;
  gutsMax: number;
  temper: number;
  temperMax: number;
  growth: number;
  xMonth: number;
}
