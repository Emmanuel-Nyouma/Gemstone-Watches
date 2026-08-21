"use client";

import { useMemo, useState } from "react";

type BrandOption = { id: string; name: string };

export function BrandSearchSelect({ brands }: { brands: BrandOption[] }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<BrandOption | null>(null);
  const matches = useMemo(() => brands.filter((brand) => brand.name.toLowerCase().includes(query.toLowerCase())).slice(0, 12), [brands, query]);
  return <div className="brand-search-select">
    <input type="hidden" name="brandId" value={selected?.id ?? ""} />
    <input value={selected?.name ?? query} onChange={(event) => { setSelected(null); setQuery(event.target.value); }} placeholder="Rechercher une marque…" required aria-label="Rechercher une marque" />
    {!selected && query && <div className="brand-search-results">{matches.map((brand) => <button type="button" key={brand.id} onClick={() => { setSelected(brand); setQuery(brand.name); }}>{brand.name}</button>)}{!matches.length && <span>Aucune marque trouvée</span>}</div>}
    {selected && <button type="button" className="brand-search-clear" onClick={() => { setSelected(null); setQuery(""); }}>Changer de marque</button>}
  </div>;
}
