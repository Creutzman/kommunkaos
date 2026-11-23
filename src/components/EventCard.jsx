// Event descriptions and choices come directly from the unchanged game model.
export default function EventCard({ event, onChoose, illustration }) {
  return <section id="event" className="panel event-panel" data-phase="event" aria-labelledby="event-title">
    <span className="eyebrow">INKOMMET ÄRENDE · BRÅDSKANDE</span><div className="event-stamp" aria-hidden="true">!</div><small>OFÖRUTSEDD HÄNDELSE</small>
    {illustration && <img className="panel-media" src={illustration.src} alt={illustration.alt} />}
    <h2 id="event-title" tabIndex={-1}>{event.t}</h2><p>{event.d}</p>
    <div id="choices">{event.c.map(([label], i) =>
      <button className="choice" key={label} onClick={() => onChoose(i)}>{label}</button>)}</div>
  </section>;
}
