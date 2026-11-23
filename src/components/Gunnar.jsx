import { opinion, wonElection } from '../game/engine.js';

// Presentation only. Gunnar never changes the reducer state or predicts an event choice.
export function gunnarReaction(state) {
  if (state.phase === 'election') return wonElection(state.scores)
    ? { mood: 'relieved', label: 'Politiskt överlevande', text: 'Fyra år till. Jag förlänger mitt kaffeabonnemang.' }
    : { mood: 'worried', label: 'Förbereder överlämning', text: 'Väljarna har talat. Jag har sparat kvittona.' };
  if (state.phase === 'event') return { mood: 'worried', label: 'Oförutsett. Som vanligt.', text: 'Det här stod inte i budgeten. Det gör det sällan.' };
  const balance = state.phase === 'result' ? state.summaryBalance : state.balance;
  if (balance < 0) return { mood: 'worried', label: 'Lätt förhöjd puls', text: state.phase === 'result'
    ? 'Minus i bokslutet. Jag bokar ett enskilt samtal. Och avbokar Portugal.'
    : 'Vi går back. Men kaffet är i alla fall upphandlat till 2028.' };
  if (opinion(state.scores) < 45) return { mood: 'worried', label: 'Orolig för opinionen', text: 'Siffrorna går ihop. Invånarna har däremot bett att få prata med chefen.' };
  return { mood: 'relieved', label: 'Försiktigt hoppfull', text: 'Budget i balans? Jag vågar nästan ta fram finporslinet.' };
}

export default function Gunnar({ state }) {
  const { mood, label, text } = gunnarReaction(state);
  return <aside className={`gunnar ${mood}`} aria-labelledby="gunnar-name">
    <div className="gunnar-heading"><span className="eyebrow">FRÅN EKONOMIKONTORET</span><span className="paperclip" aria-hidden="true">⌁</span></div>
    <div className="gunnar-person">
      <svg viewBox="0 0 180 190" className="portrait" role="img" aria-label={`Gunnar Siffrén, ${mood === 'worried' ? 'bekymrad' : 'lättad'} ekonomichef`}>
        <circle cx="90" cy="89" r="78" fill="#efce8c"/>
        <path d="M23 189v-27q1-38 67-38t67 38v27" fill="#386269" stroke="#284c51" strokeWidth="3"/>
        <path d="m64 130 26 49 26-49-26 7Z" fill="#f7f1dc"/><path d="m83 144 7-7 7 7-4 9 5 29H82l5-29Z" fill="#c66c55"/>
        <path d="M78 112v26q12 10 24 0v-26" fill="#dca27d" stroke="#72584c" strokeWidth="2"/>
        <ellipse cx="47" cy="81" rx="8" ry="13" fill="#e7b38c"/><ellipse cx="133" cy="81" rx="8" ry="13" fill="#e7b38c"/>
        <path d="M48 63q0-44 42-44t42 44v28q-3 39-42 39T48 91Z" fill="#edbd96" stroke="#72584c" strokeWidth="3"/>
        <path d="M48 76q-15-40 15-51l-3 28-12 23m84 0q15-40-15-51l3 28 12 23" fill="#e7e2d2"/>
        <path d="M64 25q23-18 52 0M67 48h46" fill="none" stroke="#aa8168" strokeWidth="2"/>
        <g fill="none" stroke="#314e56" strokeWidth="3"><rect x="54" y="65" width="31" height="25" rx="8"/><rect x="95" y="65" width="31" height="25" rx="8"/><path d="M85 73h10m-41-2-9-3m81 3 9-3"/></g>
        <g fill="#344c4b"><circle cx="72" cy="77" r="3"/><circle cx="108" cy="77" r="3"/></g>
        <path d="m89 80-5 18h11" fill="none" stroke="#b77f63" strokeWidth="2"/>
        <path d={mood === 'worried' ? 'M74 111q16-13 32 0M60 59l20-5m20 0 20 5' : 'M74 105q16 15 32 0M60 57h20m20 0h20'} fill="none" stroke="#72584c" strokeWidth="3" strokeLinecap="round"/>
        <path d="M123 167h20v12h-20Z" fill="#f7f1dc"/><path d="M137 164v-9" stroke="#c66c55" strokeWidth="4"/>
      </svg>
      <div><h2 id="gunnar-name">Gunnar Siffrén</h2><p>Ekonomichef · sedan urminnes tid</p></div>
    </div>
    <div className="speech" role="status" aria-live="polite" aria-atomic="true"><p key={text}>”{text}”</p><span className="mood-label">{label}</span></div>
    <p className="gunnar-note">Gunnars kommentarer är kommunal stämningsrapport. Besluten är dina.</p>
  </aside>;
}
