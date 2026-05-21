import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type {
  ProductFilters,
  ProductCategory,
  ProductFilterStatus,
} from "@/types";
import { PRODUCT_CATEGORIES } from "@/hooks/useProducts";
import { cn } from "@/lib/utils";

interface ProductFiltersBarProps {
  filters: ProductFilters;
  onChange: (filters: ProductFilters) => void;
  totalCount: number;
  filteredCount: number;
}

const STATUS_OPTIONS: { label: string; value: ProductFilterStatus }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Archived", value: "archived" },
];

export function ProductFiltersBar({
  filters,
  onChange,
  totalCount,
  filteredCount,
}: ProductFiltersBarProps) {
  const hasActiveFilters =
    filters.status !== "all" ||
    filters.category !== "All" ||
    filters.search !== "";

  const clearAll = () =>
    onChange({ status: "all", category: "All", search: "" });

  return (
    <div className="space-y-3 rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search products…"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          className="w-full rounded-xl border border-input bg-background py-2.5 pl-10 pr-4 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Search products"
        />
        {filters.search && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => onChange({ ...filters, search: "" })}
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        {/* Status */}
        <div className="flex items-center gap-1 rounded-xl border border-border/60 bg-muted/40 p-1">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onChange({ ...filters, status: opt.value })}
              className={cn(
                "rounded-md px-3 py-1 text-xs font-medium transition-colors",
                filters.status === opt.value
                  ? "bg-background shadow text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
              aria-pressed={filters.status === opt.value}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Category */}
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => onChange({ ...filters, category: "All" })}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              filters.category === "All"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground hover:text-foreground",
            )}
          >
            All Categories
          </button>
          {PRODUCT_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() =>
                onChange({ ...filters, category: cat as ProductCategory })
              }
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                filters.category === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground hover:text-foreground",
              )}
              aria-pressed={filters.category === cat}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 gap-1 text-xs"
              onClick={clearAll}
            >
              <X className="h-3 w-3" />
              Clear
            </Button>
          )}
          <Badge variant="secondary" className="text-xs">
            {filteredCount} / {totalCount}
          </Badge>
        </div>
      </div>
    </div>
  );
}
