// Optional local illustration slot; no artwork or motion added in this migration.
export default function EventCard({ event, onChoose, illustration }) {
  return <section id="event" className="panel" data-phase="event">
    <small>OFÖRUTSEDD HÄNDELSE</small>
    {illustration && <img className="panel-media" src={illustration.src} alt={illustration.alt} />}
    <h2>{event.t}</h2><p>{event.d}</p>
    <div id="choices">{event.c.map(([label], i) =>
      <button className="choice" key={label} onClick={() => onChoose(i)}>{label}</button>)}</div>
  </section>;
}
