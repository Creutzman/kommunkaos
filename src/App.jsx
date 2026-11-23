import { useEffect, useReducer, useRef } from 'react';
import { createGame, gameReducer, opinion } from './game/engine.js';
import { events } from './game/events.js';
import { money, taxLabel } from './format.js';
import BudgetPanel from './components/BudgetPanel.jsx';
import EventCard from './components/EventCard.jsx';
import YearSummary from './components/YearSummary.jsx';
import Town from './components/Town.jsx';
import Gunnar from './components/Gunnar.jsx';

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, undefined, createGame);
  const panelRef = useRef(null);
  const previousStep = useRef(`${state.year}-${state.phase}`);
  useEffect(() => {
    const step = `${state.year}-${state.phase}`;
    if (previousStep.current !== step) panelRef.current?.querySelector('h2')?.focus();
    previousStep.current = step;
  }, [state.year, state.phase]);
  return <main>
    <header className="masthead"><a className="brand" href="#game" aria-label="Kommunkaos, till spelet"><span className="crest" aria-hidden="true">K</span><span>KOMMUNKAOS<small>LAGOMKÖPINGS KOMMUN</small></span></a><span className="edition">0.2 · Operation Rädda Gunnar</span></header>
    <section className="hero" aria-labelledby="game-title"><div className="hero-copy"><span className="eyebrow">ETT SPEL OM ATT FÅ IHOP DET</span><h1 id="game-title">Alla vill ha mer.<br/><em>Ingen vill betala.</em></h1><p>Välkommen till Lagomköping. Fyra år, en budget<br className="desktop-break"/> och orimligt många önskemål. Lycka till.</p></div><Town/><span className="town-sign">LAGOMKÖPING <small>Här är det nästan i balans.</small></span></section>
    <div className="term" aria-label={`År ${state.year + 1} av 4 i mandatperioden`}><span>DIN MANDATPERIOD</span><ol>{[0,1,2,3].map(year => <li key={year} className={year === state.year ? 'current' : year < state.year ? 'complete' : ''} aria-current={year === state.year ? 'step' : undefined}><span>{year < state.year ? '✓' : year + 1}</span><b>{2027 + year}</b></li>)}</ol><span className="election-label">Sedan säger väljarna sitt.</span></div>
    <div className="stats" aria-label="Kommunens läge">
      <div className="stat">Budgetår<b>{2027 + state.year}</b><small>År {state.year + 1} av 4</small></div>
      <div className="stat">Opinionsstöd<b>{state.phase === 'event' ? state.eventOpinion : opinion(state.scores)}<span>/100</span></b><small>Väljarnas tålamod</small></div>
      <div className="stat">Årsresultat<b className={state.balance >= 0 ? 'good' : 'bad'}>{money(state.balance)}</b><small>Budget före händelser</small></div>
      <div className="stat">Skatt, ändring<b>{taxLabel(state.tax)}</b><small>Jämfört med utgångsläget</small></div>
    </div>
    <div className="game-layout" id="game"><div className="game-panel" ref={panelRef} key={`${state.year}-${state.phase}`}>
      {state.phase === 'budget' && <BudgetPanel {...state} dispatch={dispatch} />}
      {state.phase === 'event' && <EventCard event={events[state.eventIndex]} onChoose={index => dispatch({ type: 'choose', index })} />}
      {(state.phase === 'result' || state.phase === 'election') && <YearSummary state={state} dispatch={dispatch} />}
    </div><Gunnar state={state}/></div>
    <footer><span>🏛 LAGOMKÖPINGS KOMMUN <b>·</b> POLITISK SATIR</span><p>Fiktiv spelmodell. Kommunal skattebas och politiska reaktioner är förenklade för spelbarhet.</p></footer>
  </main>;
}
