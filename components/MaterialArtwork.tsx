type MaterialArtworkProps = { slug: string };

export default function MaterialArtwork({ slug }: MaterialArtworkProps) {
  if (slug === "osi-layer") {
    return <svg className="material-card-illustration" viewBox="0 0 360 132" aria-hidden="true" focusable="false">
      {[0, 1, 2, 3, 4, 5, 6].map((layer) => {
        const y = 20 + layer * 14;
        const width = 106 + (layer % 3) * 24;
        return <g key={layer}>
          <text x="94" y={y + 9} textAnchor="end" className="material-art-label">{7 - layer}</text>
          <rect x="106" y={y} width={width} height="10" rx="5" className={layer === 0 ? "material-art-block primary" : "material-art-block"}/>
          <circle cx={252 + (layer % 2) * 10} cy={y + 5} r="2" className="material-art-dot"/>
        </g>;
      })}
      <path d="M278 25v82" className="material-art-line"/>
      <path d="m273 101 5 6 5-6" className="material-art-line"/>
    </svg>;
  }

  if (slug === "tcp-ip") {
    const layers = [
      { label: "APPLICATION", protocol: "HTTP · DNS" },
      { label: "TRANSPORT", protocol: "TCP · UDP" },
      { label: "INTERNET", protocol: "IP" },
      { label: "LINK", protocol: "ETHERNET" },
    ];
    return <svg className="material-card-illustration" viewBox="0 0 360 132" aria-hidden="true" focusable="false">
      {layers.map((layer, index) => {
        const y = 20 + index * 24;
        return <g key={layer.label}>
          <rect x="74" y={y} width="120" height="18" rx="5" className={index === 0 ? "material-art-block primary" : "material-art-block"}/>
          <text x="84" y={y + 12} className="material-art-label small">{layer.label}</text>
          <path d={`M194 ${y + 9}h26`} className="material-art-line"/>
          <rect x="220" y={y} width="92" height="18" rx="9" className="material-art-chip"/>
          <text x="266" y={y + 12} textAnchor="middle" className="material-art-label small">{layer.protocol}</text>
        </g>;
      })}
      <path d="M54 25v78m-5-6 5 6 5-6" className="material-art-line"/>
    </svg>;
  }

  if (slug === "ipv4-addressing") {
    return <svg className="material-card-illustration" viewBox="0 0 360 132" aria-hidden="true" focusable="false">
      <text x="180" y="32" textAnchor="middle" className="material-art-label small">32-BIT ADDRESS · FOUR OCTETS</text>
      {["192", "168", "10", "70"].map((octet, index) => {
        const x = 58 + index * 66;
        return <g key={octet}>
          <rect x={x} y="46" width="54" height="34" rx="8" className={index < 3 ? "material-art-block primary" : "material-art-block"}/>
          <text x={x + 27} y="68" textAnchor="middle" className="material-art-number">{octet}</text>
          {index < 3 && <circle cx={x + 61} cy="64" r="2" className="material-art-dot"/>}
        </g>;
      })}
      <path d="M61 92v8h180v-8" className="material-art-line"/>
      <text x="151" y="116" textAnchor="middle" className="material-art-label small">IPV4 · CIDR · GATEWAY</text>
    </svg>;
  }

  if (slug === "ipv4-subnetting") {
    const bits = [1, 1, 0, 0, 1, 0, 1, 0];
    return <svg className="material-card-illustration" viewBox="0 0 360 132" aria-hidden="true" focusable="false">
      <text x="143" y="27" textAnchor="middle" className="material-art-label small">NETWORK BITS</text>
      <text x="270" y="27" textAnchor="middle" className="material-art-label small">HOST BITS</text>
      {bits.map((bit, index) => {
        const x = 66 + index * 37;
        return <g key={index}>
          <rect x={x} y="40" width="30" height="37" rx="5" className={index < 5 ? "material-art-block primary" : "material-art-block host"}/>
          <text x={x + 15} y="64" textAnchor="middle" className="material-art-number">{bit}</text>
        </g>;
      })}
      <path d="M250 34v50" className="material-art-divider"/>
      <path d="M66 88v7h178v-7m11 0v7h66v-7" className="material-art-line"/>
      <text x="155" y="116" textAnchor="middle" className="material-art-label small">PREFIX SPLITS NETWORK AND HOST</text>
    </svg>;
  }

  if (slug === "troubleshooting-jaringan") {
    return <svg className="material-card-illustration" viewBox="0 0 360 132" aria-hidden="true" focusable="false">
      <path d="M76 35h128m-128 30h128m-128 30h88" className="material-art-line muted"/>
      <rect x="52" y="24" width="182" height="84" rx="12" className="material-art-frame"/>
      <path d="m65 36 4 4 8-9m-12 39 4 4 8-9m-12 39 4 4 8-9" className="material-art-check"/>
      <circle cx="250" cy="69" r="23" className="material-art-ring"/>
      <path d="m267 86 20 20" className="material-art-line strong"/>
      <circle cx="250" cy="69" r="7" className="material-art-dot"/>
      <path d="M242 69h16m-8-8v16" className="material-art-line"/>
    </svg>;
  }

  return <svg className="material-card-illustration" viewBox="0 0 360 132" aria-hidden="true" focusable="false">
    <path d="M180 63 102 36m78 27 78-27m-78 27-78 39m78-39 78 39" className="material-art-line"/>
    <rect x="157" y="48" width="46" height="30" rx="8" className="material-art-block primary"/>
    <circle cx="180" cy="63" r="5" className="material-art-dot"/>
    {[[102, 36], [258, 36], [102, 102], [258, 102]].map(([x, y]) => <g key={`${x}-${y}`}>
      <circle cx={x} cy={y} r="16" className="material-art-node"/>
      <circle cx={x} cy={y} r="4" className="material-art-dot"/>
    </g>)}
  </svg>;
}
