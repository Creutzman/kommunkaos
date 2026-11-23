import { names } from '../game/engine.js';

export default function OpinionPanel({ scores }) {
  return <div id="groups">{names.map((name, i) => <div className="group" key={name}>
    <label>{name} <b>{Math.round(scores[i])}/100</b></label>
    <div className="meter" role="meter" aria-label={name} aria-valuemin={0} aria-valuemax={100} aria-valuenow={scores[i]}>
      <div style={{ width: `${scores[i]}%` }} />
    </div>
  </div>)}</div>;
}
