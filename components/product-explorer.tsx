"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "./product-card";
import type { Product } from "@/types/product";

type Sort = "newest" | "low" | "high" | "popular";
type FilterKey = "brands" | "genders" | "movements" | "straps" | "dials" | "sizes";

const unique = (values: string[]) => [...new Set(values)].sort();

export function ProductExplorer({ initialProducts, initialSearch = "", title = "The collection", remoteSearch = false }: { initialProducts: Product[]; initialSearch?: string; title?: string; remoteSearch?: boolean }) {
  const [search, setSearch] = useState(initialSearch);
  const [catalogProducts, setCatalogProducts] = useState(initialProducts);
  const [isSearching, setIsSearching] = useState(false);
  const [sort, setSort] = useState<Sort>("newest");
  const [maxPrice, setMaxPrice] = useState(20000);
  const [filters, setFilters] = useState<Record<FilterKey, string[]>>({ brands: [], genders: [], movements: [], straps: [], dials: [], sizes: [] });
  const [page, setPage] = useState(1);
  const [mobileFilters, setMobileFilters] = useState(false);
  const perPage = 6;

  useEffect(() => {
    if (!remoteSearch) return;
    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(`/api/catalog/search?q=${encodeURIComponent(search)}&limit=240`, { signal: controller.signal });
        if (!response.ok) throw new Error("Search failed");
        const result = await response.json() as { products: Product[] };
        setCatalogProducts(result.products);
        setPage(1);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) setCatalogProducts(initialProducts);
      } finally {
        if (!controller.signal.aborted) setIsSearching(false);
      }
    }, 280);
    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [initialProducts, remoteSearch, search]);

  const availableProducts = remoteSearch ? catalogProducts : initialProducts;

  const options = useMemo(() => ({
    brands: unique(availableProducts.map((product) => product.brand)),
    genders: unique(availableProducts.map((product) => product.gender)),
    movements: unique(availableProducts.map((product) => product.movement)),
    straps: unique(availableProducts.map((product) => product.strap)),
    dials: unique(availableProducts.map((product) => product.dialColor)),
    sizes: unique(availableProducts.map((product) => String(product.caseSize))),
  }), [availableProducts]);

  const toggle = (key: FilterKey, value: string) => {
    setFilters((current) => ({ ...current, [key]: current[key].includes(value) ? current[key].filter((item) => item !== value) : [...current[key], value] }));
    setPage(1);
  };

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return availableProducts
      .filter((product) => remoteSearch || !query || [product.title, product.brand, product.model, product.referenceNumber, ...product.tags].join(" ").toLowerCase().includes(query))
      .filter((product) => product.price <= maxPrice)
      .filter((product) => !filters.brands.length || filters.brands.includes(product.brand))
      .filter((product) => !filters.genders.length || filters.genders.includes(product.gender))
      .filter((product) => !filters.movements.length || filters.movements.includes(product.movement))
      .filter((product) => !filters.straps.length || filters.straps.includes(product.strap))
      .filter((product) => !filters.dials.length || filters.dials.includes(product.dialColor))
      .filter((product) => !filters.sizes.length || filters.sizes.includes(String(product.caseSize)))
      .sort((a, b) => sort === "low" ? a.price - b.price : sort === "high" ? b.price - a.price : sort === "popular" ? b.popular - a.popular : Date.parse(b.createdDate) - Date.parse(a.createdDate));
  }, [availableProducts, filters, maxPrice, remoteSearch, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const visible = filtered.slice((page - 1) * perPage, page * perPage);
  const clear = () => { setFilters({ brands: [], genders: [], movements: [], straps: [], dials: [], sizes: [] }); setMaxPrice(20000); setSearch(""); setPage(1); };
  const activeCount = Object.values(filters).flat().length + (maxPrice < 20000 ? 1 : 0);

  const filterSidebar = (
    <aside className={`filter-sidebar ${mobileFilters ? "is-open" : ""}`} aria-label="Watch filters">
      <div className="filter-mobile-head"><strong>Filters {activeCount > 0 && `(${activeCount})`}</strong><button onClick={() => setMobileFilters(false)} aria-label="Close filters"><X /></button></div>
      <FilterGroup label="Brand" values={options.brands} selected={filters.brands} onToggle={(value) => toggle("brands", value)} />
      <details className="filter-group" open><summary>Prix <ChevronDown size={15} /></summary><div className="price-filter"><div><span>0 FCFA</span><strong>Jusqu’à {maxPrice.toLocaleString("fr-FR")} FCFA</strong></div><input type="range" min="500" max="20000000" step="50000" value={maxPrice} onChange={(event) => { setMaxPrice(Number(event.target.value)); setPage(1); }} aria-label="Prix maximum en FCFA" /></div></details>
      <FilterGroup label="Gender" values={options.genders} selected={filters.genders} onToggle={(value) => toggle("genders", value)} />
      <FilterGroup label="Movement" values={options.movements} selected={filters.movements} onToggle={(value) => toggle("movements", value)} />
      <FilterGroup label="Strap material" values={options.straps} selected={filters.straps} onToggle={(value) => toggle("straps", value)} />
      <FilterGroup label="Dial color" values={options.dials} selected={filters.dials} onToggle={(value) => toggle("dials", value)} />
      <FilterGroup label="Case size" values={options.sizes} selected={filters.sizes} onToggle={(value) => toggle("sizes", value)} suffix=" mm" />
      <button className="filter-clear" onClick={clear}>Clear all filters</button>
      <button className="button button-dark mobile-filter-apply" onClick={() => setMobileFilters(false)}>Show {filtered.length} watches</button>
    </aside>
  );

  return (
    <section className="catalog-explorer">
      <div className="catalog-toolbar">
        <div><p className="eyebrow">Curated inventory</p><h2>{title}</h2><span aria-live="polite">{isSearching ? "Recherche…" : `${filtered.length} ${filtered.length === 1 ? "montre" : "montres"}`}</span></div>
        <div className="catalog-actions">
          <label className="catalog-search"><Search size={17} /><span className="sr-only">Search watches</span><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search collection" /></label>
          <button className="filter-toggle" onClick={() => setMobileFilters(true)}><SlidersHorizontal size={17} /> Filters {activeCount > 0 && `(${activeCount})`}</button>
          <label className="sort-select"><span>Sort by</span><select value={sort} onChange={(event) => { setSort(event.target.value as Sort); setPage(1); }} aria-label="Sort watches"><option value="newest">Newest</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="popular">Most popular</option></select><ChevronDown size={14} /></label>
        </div>
      </div>
      <div className="catalog-layout">
        {filterSidebar}
        <div className="catalog-results">
          {visible.length ? <div className="product-grid">{visible.map((product, index) => <ProductCard key={product.id} product={product} priority={index < 2} />)}</div> : <div className="empty-state"><p className="eyebrow">No matches</p><h3>Let&apos;s widen the search.</h3><p>Try removing a filter or searching for a different reference.</p><button className="button button-dark" onClick={clear}>Reset filters</button></div>}
          {totalPages > 1 && <nav className="pagination" aria-label="Catalog pages"><button disabled={page === 1} onClick={() => { setPage((value) => value - 1); window.scrollTo({ top: 250, behavior: "smooth" }); }}>Previous</button>{Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => <button key={number} className={page === number ? "active" : ""} aria-current={page === number ? "page" : undefined} onClick={() => { setPage(number); window.scrollTo({ top: 250, behavior: "smooth" }); }}>{number}</button>)}<button disabled={page === totalPages} onClick={() => { setPage((value) => value + 1); window.scrollTo({ top: 250, behavior: "smooth" }); }}>Next</button></nav>}
        </div>
      </div>
    </section>
  );
}

function FilterGroup({ label, values, selected, onToggle, suffix = "" }: { label: string; values: string[]; selected: string[]; onToggle: (value: string) => void; suffix?: string }) {
  return <details className="filter-group" open><summary>{label}<ChevronDown size={15} /></summary><div>{values.map((value) => <label key={value}><input type="checkbox" checked={selected.includes(value)} onChange={() => onToggle(value)} /><span>{value}{suffix}</span></label>)}</div></details>;
}
