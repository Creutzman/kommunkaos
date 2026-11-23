import { areas, calculateBalance, budgetEffects } from './economy.js';
import { events } from './events.js';
export const names = ["Barnfamiljer","Pensionärer","Företagare","Kommunanställda","Unga vuxna","Övriga väljare"];
export const clamp = x => Math.max(0, Math.min(100, x));
export const opinion = scores => Math.round(scores.reduce((a, b) => a + b, 0) / 6);
const modify = (scores, effects) => scores.map((score, i) => clamp(score + effects[i]));

export function createGame() {
  return { year: 0, tax: 0, changes: areas.map(() => 0), scores: names.map(() => 50),
    balance: -150, used: [], phase: 'budget', eventIndex: null, choice: null };
}

// Randomness is supplied at the boundary, making the rules deterministic in tests.
export function gameReducer(state, action) {
  switch (action.type) {
    case 'tax':
    case 'allocation': {
      if (state.phase !== 'budget') return state;
      const tax = action.type === 'tax' ? action.value : state.tax;
      const changes = action.type === 'allocation'
        ? state.changes.map((value, i) => i === action.index ? action.value : value) : state.changes;
      return { ...state, tax, changes, balance: calculateBalance(tax, changes) };
    }
    case 'decide': {
      if (state.phase !== 'budget') return state;
      let used = state.used;
      let pool = events.map((_, i) => i).filter(i => !used.includes(i));
      if (!pool.length) { used = []; pool = events.map((_, i) => i); }
      const eventIndex = pool[Math.floor(action.random * pool.length)];
      return { ...state, scores: modify(state.scores, budgetEffects(state)),
        eventOpinion: opinion(state.scores), used: [...used, eventIndex], eventIndex, phase: 'event' };
    }
    case 'choose': {
      if (state.phase !== 'event') return state;
      const choice = events[state.eventIndex].c[action.index];
      // MVP report() captures the event result, then update() restores the header balance.
      return { ...state, summaryBalance: state.balance + choice[1],
        balance: calculateBalance(state.tax, state.changes), scores: modify(state.scores, choice[2]),
        choice: choice[0], phase: 'result' };
    }
    case 'next':
      if (state.phase !== 'result') return state;
      if (state.year === 3) return { ...state, phase: 'election' };
      return { ...state, year: state.year + 1, tax: 0, changes: areas.map(() => 0),
        balance: -150, phase: 'budget', eventIndex: null, choice: null };
    case 'restart': return createGame();
    default: return state;
  }
}

export const wonElection = scores => opinion(scores) >= 52;
