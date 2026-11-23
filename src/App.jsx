import { useReducer } from 'react';
import { createGame, gameReducer, opinion } from './game/engine.js';
import { events } from './game/events.js';
import { money, taxLabel } from './format.js';
import BudgetPanel from './components/BudgetPanel.jsx';
import EventCard from './components/EventCard.jsx';
import YearSummary from './components/YearSummary.jsx';

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, undefined, createGame);
  return <main>
    <small>LAGOMKÖPINGS KOMMUN · POLITISK SATIR</small>
    <h1>🏛️ KOMMUNKAOS</h1><p>Alla vill ha mer. Ingen vill betala.</p>
    <div className="stats">
      <div className="stat">Budgetår<b>{2027 + state.year}</b></div>
      <div className="stat">Opinionsstöd<b>{state.phase === 'event' ? state.eventOpinion : opinion(state.scores)}/100</b></div>
      <div className="stat">Årsresultat<b className={state.balance >= 0 ? 'good' : 'bad'}>{money(state.balance)}</b></div>
      <div className="stat">Skatt, ändring<b>{taxLabel(state.tax)}</b></div>
    </div>
    {state.phase === 'budget' && <BudgetPanel {...state} dispatch={dispatch} />}
    {state.phase === 'event' && <EventCard event={events[state.eventIndex]} onChoose={index => dispatch({ type: 'choose', index })} />}
    {(state.phase === 'result' || state.phase === 'election') && <YearSummary state={state} dispatch={dispatch} />}
    <p className="muted"><small>Fiktiv spelmodell. Kommunal skattebas och politiska reaktioner är förenklade för spelbarhet.</small></p>
  </main>;
}
