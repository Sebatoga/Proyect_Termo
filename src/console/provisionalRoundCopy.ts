import { PROVISIONAL_EVENT_KEYS } from "../application/round-session/provisionalRoundManifest.mjs";

export interface ProvisionalRoundCopy {
  readonly roundId: string;
  readonly eventKey: string;
  readonly title: string;
  readonly question: string;
}

const titles = Object.freeze([
  "Condición base",
  "Temperatura alta",
  "Río bajo",
  "Pico de demanda",
  "Luz reducida",
  "Combinación final",
] as const);

const questions = Object.freeze([
  "¿Entendemos el tablero y qué cargas debemos priorizar?",
  "¿Cómo cambia la estrategia cuando el panel trabaja más caliente?",
  "¿Qué consigna hidro es posible sin vulnerar el caudal ecológico?",
  "¿Qué cargas protegemos y cuándo usamos la batería?",
  "¿Cómo administramos la reserva sin inventar generación?",
  "¿Podemos sostener la ciudad y justificar todas las decisiones?",
] as const);

const copies: readonly ProvisionalRoundCopy[] = Object.freeze(
  PROVISIONAL_EVENT_KEYS.map((eventKey, index) => Object.freeze({
    roundId: `round-${index + 1}`,
    eventKey,
    title: titles[index],
    question: questions[index],
  })),
);

export function getProvisionalRoundCopy(
  roundIndex: number,
  roundId: string,
): ProvisionalRoundCopy | null {
  if (!Number.isSafeInteger(roundIndex) || roundIndex < 0 || roundIndex >= copies.length) {
    return null;
  }
  const copy = copies[roundIndex];
  return copy?.roundId === roundId ? copy : null;
}
