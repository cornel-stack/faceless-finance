// One flat palette, one display font — the channel's visual identity.
export const theme = {
  bg: "#f4f1ea",        // warm near-white paper
  bgPanel: "#ebe7dd",   // slightly darker panel
  ink: "#17120f",       // near-black
  inkSoft: "#5c544c",   // muted label text
  accent: "#c0392b",    // the red spiking line
  accentDark: "#8f281c",
  up: "#1f7a3d",
  grid: "#d8d2c6",
  ledgerBg: "#17120f",
  ledgerInk: "#f4f1ea",
};

export const money = (v: number, unit = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: unit === "USD" ? "currency" : "decimal",
    currency: "USD",
    maximumFractionDigits: 0,
    notation: Math.abs(v) >= 1_000_000 ? "standard" : "standard",
  }).format(v);

// Compact money for axis ticks: $1K, $1M, $100M
export const moneyShort = (v: number) => {
  if (v >= 1_000_000_000) return `$${v / 1_000_000_000}B`;
  if (v >= 1_000_000) return `$${v / 1_000_000}M`;
  if (v >= 1_000) return `$${v / 1_000}K`;
  return `$${v}`;
};
