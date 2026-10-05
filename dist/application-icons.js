// Original outline pictograms. Labels on the buttons provide the accessible names.
const icons={
 phone:'<rect x="6.5" y="2.5" width="11" height="19" rx="2"/><path d="M10 5h4M11 18.5h2"/>',
 ev:'<path d="m4 10 1.8-5h12.4l1.8 5M3 10h18v8H3zM5 18v3M19 18v3M3 8H1M21 8h2M6 13h2M16 13h2m-5-3-2 4h3l-2 3"/>',
 wind:'<circle cx="12" cy="9" r="1.7"/><path d="M12 7.3V2c-2 0-3 2-2 5.3M13.5 9.8l5 3c1.3-1.7.2-3.3-3.8-4.5M10.5 9.8l-5 3c.9 2.1 2.8 1.8 5.9-1.7M11.5 11l-.8 10M12.5 11l.8 10M8 21h8"/>',
 lighting:'<path d="M9 17v-2c-4.5-3-3.5-9 3-9s7.5 6 3 9v2H9ZM9 20h6M11 22h2M12 1v2M3 5l2 2M19 7l2-2M1 12h2M21 12h2M12 17v-5m-2-2 2 2 2-2"/>',
 mri:'<path d="M3 20V10a8 8 0 0 1 16 0v5M7 15v-5a4 4 0 0 1 8 0v5M2 21h7m5-5h8v3H9v-3h2M20 19v3"/><circle cx="11.5" cy="13" r="1.5"/>',
 camera:'<path d="M3 7h4l2-3h6l2 3h4v13H3zM18 10h1"/><circle cx="12" cy="13" r="4"/>',
 jet:'<ellipse cx="7" cy="12" rx="4" ry="7"/><path d="m7 5 12 3 2 4-2 4-12 3M7 10V7M8.5 11l1.5-1M8.5 13l1.5 1M7 14v3M5.5 13 4 14M5.5 11 4 10"/><circle cx="7" cy="12" r="1.7"/>',
 guidance:'<path d="M15 3h6v6M21 3l-5 5M7 19l-4 2 2-4m3-7 7-5 4 4-5 7-6-6Zm0 0H4l-2 4 7 1m5 1v4l-4 2-1-7"/>',
 'military-comms':'<rect x="6" y="7" width="12" height="15" rx="2"/><path d="M8 7V1M10 7V4h4v3M9 11h6M9 14h6M9 18h2M19 2a4 4 0 0 1 3 4"/><circle cx="14.5" cy="18" r=".5"/>',
 refining:'<path d="M4 22V5h5v17M4 9h5M4 13h5M4 17h5M6.5 5V2M13 22V11h5v11M13 15h5M13 19h5M9 8h7v3M18 17h3v5M2 22h21"/>',
 optics:'<rect x="2" y="4" width="20" height="14" rx="1"/><path d="M8 22h8M12 18v4M5 14l7-7M10 14l5-5M15 14l4-4"/>',
 fiber:'<path d="M2 18h5c7 0 1-13 9-13h3M2 21h6c8 0 2-9 9-9h2M2 15h4c5 0 0 4 7 4h6"/><circle cx="21" cy="5" r="1.5"/><circle cx="21" cy="12" r="1.5"/><circle cx="21" cy="19" r="1.5"/>',
 laser:'<path d="M2 8h8v8H2zM10 10h4v4h-4M5 16v5M2 21h6M14 12h9M19 5v3M19 16v3M15.5 7l1.5 1.5M21 15.5l1.5 1.5M15.5 17l1.5-1.5M21 8.5 22.5 7"/>',
 alloys:'<path d="m5 3 7 4-7 4-3-2V5l3-2Zm0 8 7-4 7 4-7 4-7-4Zm7 4 7-4 3 2v4l-7 4-3-2v-4ZM5 7v4M12 11v4M19 15l3-2M19 15v4"/>',
 special:'<ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/><circle cx="12" cy="12" r="1.2"/>'
};

export const applicationIcon=id=>`<svg class="application-icon" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${icons[id]}</svg>`;
