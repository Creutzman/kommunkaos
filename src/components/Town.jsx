// Original SVG artwork: no external image or reference mockup required.
export default function Town() {
  return <svg className="town" viewBox="0 0 1000 310" role="img" aria-label="Illustrerat Lagomköping med kommunhus, skola, badhus och den omdebatterade älgen i rondellen">
    <defs>
      <linearGradient id="sky" x2="0" y2="1"><stop stopColor="#b5e4ed"/><stop offset="1" stopColor="#e8f4dc"/></linearGradient>
      <pattern id="windows" width="28" height="36" patternUnits="userSpaceOnUse"><rect x="8" y="8" width="12" height="19" rx="2" fill="#31576a"/><path d="M14 8v19M8 17h12" stroke="#f5dc9e" strokeWidth="2"/></pattern>
    </defs>
    <path fill="url(#sky)" d="M0 0h1000v310H0z"/>
    <circle cx="832" cy="59" r="30" fill="#ffe499"/>
    <g fill="#fff" opacity=".8"><path d="M79 65c-12-22 17-40 30-21 17-34 52-20 50 2 31-2 35 20 21 23H79Z"/><path d="M616 40c-10-17 13-31 24-16 12-25 40-15 39 2 23-1 27 15 16 18h-79Z"/></g>
    <path d="M0 174Q130 86 274 168T540 149T777 139T1000 130V310H0Z" fill="#8db48a"/>
    <path d="M0 221Q190 144 378 214T725 202T1000 192V310H0Z" fill="#b9ce91"/>
    <path d="M0 288Q250 218 480 275T1000 263" fill="none" stroke="#f6ecd3" strokeWidth="47"/>
    <path d="M0 288Q250 218 480 275T1000 263" fill="none" stroke="#a9ada5" strokeWidth="30"/>
    <path d="M0 288Q250 218 480 275T1000 263" fill="none" stroke="#fff3cb" strokeWidth="2" strokeDasharray="12 12"/>
    <g stroke="#365b55" strokeWidth="3" strokeLinejoin="round">
      <g><path d="M67 166h153v80H67Z" fill="#e5af69"/><path d="m53 166 90-48 92 48Z" fill="#a35247"/><path d="M79 174h130v55H79Z" fill="url(#windows)"/><path d="M130 207h28v39h-28Z" fill="#345969"/><path d="M133 113v-30"/><path d="m135 84 31 5-31 13" fill="#efcd69"/></g>
      <g><path d="M299 138h193v103H299Z" fill="#e9c9a2"/><path d="m285 139 109-58 111 58Z" fill="#6a8085"/><path d="M317 150h156v64H317Z" fill="url(#windows)"/><path d="M381 190h26v51h-26Z" fill="#355969"/><path d="M372 109V60h44v49" fill="#e9c9a2"/><path d="m366 61 28-30 28 30Z" fill="#6a8085"/><circle cx="394" cy="80" r="13" fill="#fff2d0"/><path d="M394 71v10l7 3" fill="none"/></g>
      <g><path d="M564 179h147v65H564Z" fill="#f2b3a0"/><path d="m553 180 85-45 84 45Z" fill="#b75c52"/><path d="M581 185h110v47H581Z" fill="url(#windows)"/><path d="M618 210h30v34h-30Z" fill="#345969"/></g>
      <g><path d="M792 182h156v62H792Z" fill="#8fc9cb"/><path d="m782 183 20-35h136l20 35Z" fill="#547b8a"/><path d="M810 193h120v28H810Z" fill="url(#windows)"/></g>
    </g>
    <g fill="#294c57" fontFamily="system-ui" fontSize="12" fontWeight="800" textAnchor="middle"><text x="143" y="194" fill="#fff2d0">SKOLA</text><text x="394" y="131">KOMMUNHUSET</text><text x="638" y="172">BIBLIOTEK</text><text x="870" y="173" fill="#fff2d0">BADHUSET</text></g>
    <g fill="#537b62" stroke="#365b55" strokeWidth="3">{[35,251,527,749,975].map((x,i)=><g key={x} transform={`translate(${x} ${204-i%2*19})`}><path d="M0 9v35"/><path d="M-18 12Q-28-7-10-18Q-3-39 12-19Q34-10 18 12Z"/></g>)}</g>
    <ellipse cx="545" cy="282" rx="44" ry="13" fill="#e9d8b4" stroke="#75877b" strokeWidth="3"/>
    <g stroke="#68574e" strokeWidth="6" fill="none" strokeLinecap="round"><path d="M526 274v-29h26l9-18 7 3M549 247v27M561 229l-9-11m6 7 7-12m-7 11-7-12"/></g>
    <g transform="translate(897 257)"><rect width="48" height="20" rx="6" fill="#d57c55" stroke="#365b55" strokeWidth="3"/><path d="m8 0 7-11h18l8 11" fill="#e4efdb" stroke="#365b55" strokeWidth="3"/><circle cx="11" cy="20" r="5" fill="#345969"/><circle cx="38" cy="20" r="5" fill="#345969"/></g>
  </svg>;
}
