import { areas } from '../game/economy.js';
import { taxLabel } from '../format.js';

export default function BudgetPanel({ tax, changes, dispatch }) {
  return <section id="budget" className="panel" data-phase="budget">
    <h2>Förhandla om budgeten</h2>
    <p className="muted">Kommunen har 3 200 Mkr i intäkter och 3 350 Mkr i utgifter. Ändra skatt och anslag för att minska underskottet.</p>
    <div id="sliders">
      <label htmlFor="tax">Skattejustering <b>{taxLabel(tax)}</b></label>
      <input id="tax" type="range" min="-2" max="3" step=".1" value={tax}
        onChange={e => dispatch({ type: 'tax', value: +e.target.value })} />
      {areas.map(([name], i) => <div key={name}>
        <label htmlFor={`area-${i}`}>{name} <b>{changes[i] >= 0 ? '+' : ''}{changes[i]} Mkr</b></label>
        <input id={`area-${i}`} type="range" min="-200" max="200" step="10" value={changes[i]}
          onChange={e => dispatch({ type: 'allocation', index: i, value: +e.target.value })} />
      </div>)}
    </div>
    <button onClick={() => dispatch({ type: 'decide', random: Math.random() })}>Fastställ budgeten →</button>
  </section>;
}
