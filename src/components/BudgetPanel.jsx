import { areas } from '../game/economy.js';
import { taxLabel } from '../format.js';

const symbols = ['✎', '♡', '☂', '↔', '♫', '▤'];
const descriptions = ['Små människor. Stora behov.', 'Trygghet hela livet.', 'När livet inte går enligt plan.', 'Hål i vägen. Hål i budgeten.', 'Lite mer liv mellan mötena.', 'Någon måste skriva protokollet.'];
export default function BudgetPanel({ tax, changes, dispatch }) {
  return <section id="budget" className="panel" data-phase="budget" aria-labelledby="budget-title">
    <span className="eyebrow">PÅ DITT SKRIVBORD</span><h2 id="budget-title" tabIndex={-1}>Förhandla om budgeten</h2>
    <p className="muted">Kommunen har 3 200 Mkr i intäkter och 3 350 Mkr i utgifter. Ändra skatt och anslag för att minska underskottet.</p>
    <div id="sliders">
      <div className="tax-card"><div className="control-heading"><label htmlFor="tax">Skattejustering</label><output htmlFor="tax">{taxLabel(tax)}</output></div><p>Den lilla reglaget med de stora känslorna.</p>
      <input id="tax" type="range" min="-2" max="3" step=".1" value={tax} aria-valuetext={taxLabel(tax)}
        onChange={e => dispatch({ type: 'tax', value: +e.target.value })} /><div className="range-ends" aria-hidden="true"><span>−2 kr</span><span>+3 kr</span></div></div>
      <div className="budget-cards">{areas.map(([name], i) => <div className={`budget-card area-${i}`} key={name}>
        <span className="area-icon" aria-hidden="true">{symbols[i]}</span><label htmlFor={`area-${i}`}>{name}</label><p>{descriptions[i]}</p>
        <output htmlFor={`area-${i}`}>{changes[i] >= 0 ? '+' : ''}{changes[i]} <small>Mkr</small></output>
        <input id={`area-${i}`} type="range" min="-200" max="200" step="10" value={changes[i]} aria-valuetext={`${changes[i]} Mkr`}
          onChange={e => dispatch({ type: 'allocation', index: i, value: +e.target.value })} /><div className="range-ends" aria-hidden="true"><span>−200</span><span>+200 Mkr</span></div>
      </div>)}</div>
    </div>
    <div className="decision"><p>Alla nöjda? Nej? Då är det en kommunbudget.</p><button onClick={() => dispatch({ type: 'decide', random: Math.random() })}>Fastställ budgeten</button></div>
  </section>;
}
