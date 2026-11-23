import { opinion, wonElection } from '../game/engine.js';
import { money } from '../format.js';
import OpinionPanel from './OpinionPanel.jsx';

export default function YearSummary({ state, dispatch }) {
  const election = state.phase === 'election';
  const won = wonElection(state.scores);
  return <section id="result" className="panel summary-panel" data-phase={state.phase} aria-labelledby="summary-title">
    <span className="eyebrow">{election ? 'DEMOKRATIN HAR SAGT SITT' : 'DAGS ATT SUMMERA'}</span><h2 id="summary-title" tabIndex={-1}>{election ? (won ? '🎉 Du blev omvald!' : '🗳️ Väljarna har sagt sitt') : `Årsbokslut ${2027 + state.year}`}</h2>
    <p>{election
      ? `Slutligt stöd: ${opinion(state.scores)}/100. ${won ? 'Lagomköping ger dig fyra år till. Ekonomichefen begär semester.' : 'Kommunen söker ny ledning. Ekonomichefen har redan bytt lösenord.'}`
      : `Beslut: ${state.choice}. Årsresultat: ${money(state.summaryBalance)}. Opinionsstöd: ${opinion(state.scores)}/100. ${state.summaryBalance < 0 ? 'Ekonomichefen önskar ett enskilt samtal.' : 'Ekonomichefen ler för första gången sedan 2018.'}`}</p>
    {!election && <OpinionPanel scores={state.scores} />}
    <button onClick={() => dispatch({ type: election ? 'restart' : 'next' })}>
      {election ? 'Spela igen' : state.year === 3 ? 'Visa valresultatet' : 'Nästa budgetår'}
    </button>
  </section>;
}
