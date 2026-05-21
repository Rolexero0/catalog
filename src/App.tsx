import { useState, useMemo } from "react";
import { ShoppingCart, Leaf, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/ProductCard";
import { ProductDetailDialog } from "@/components/ProductDetailDialog";
import { CartDrawer } from "@/components/CartDrawer";
import { ProductFiltersBar } from "@/components/ProductFiltersBar";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider, useCart } from "@/hooks/useCart";
import { ProductsProvider, useProducts } from "@/hooks/useProducts";
import type { Product, ProductFilters } from "@/types";
import { ProductSkeleton } from "./components/ProductSkeleton";
import React from "react";

function AppShell() {
  const { cart } = useCart();
  const {
    products,
    loading,
    error,
    refresh,
    deleteProduct,
    archiveProduct,
    restoreProduct,
  } = useProducts();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [filters, setFilters] = useState<ProductFilters>({
    status: "all",
    category: "All",
    search: "",
  });

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (filters.status !== "all" && p.status !== filters.status) return false;
      if (filters.category !== "All" && p.category !== filters.category)
        return false;
      if (
        filters.search &&
        !p.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !p.description.toLowerCase().includes(filters.search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [products, filters]);

  const openDetail = (product: Product) => {
    setSelectedProduct(product);
    setDetailOpen(true);
  };

  return (
    <React.Fragment>
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <Leaf className="h-4 w-4" />
              </div>
              <span className="text-xl font-semibold tracking-tight">
                uThrive
              </span>
            </div>

            <Button
              variant="outline"
              className="relative gap-2"
              onClick={() => setCartOpen(true)}
              aria-label={`Open cart with ${cart.totalItems} items`}
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Cart</span>
              {cart.totalItems > 0 && (
                <Badge className="h-5 min-w-5 rounded-full px-1 text-xs absolute -right-2 -top-2">
                  {cart.totalItems}
                </Badge>
              )}
            </Button>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="mb-8 rounded-3xl border border-border/60 bg-card px-6 py-7 shadow-sm">
            <h1 className="text-3xl font-semibold tracking-tight">
              Product Catalogue
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Browse wellness essentials, manage stock states, and build a
              cleaner cart experience.
            </p>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <ProductFiltersBar
              filters={filters}
              onChange={setFilters}
              totalCount={products.length}
              filteredCount={filteredProducts.length}
            />
          </div>

          {error && (
            <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-destructive/30 bg-destructive/5 py-16 text-center">
              <AlertCircle className="h-10 w-10 text-destructive" />
              <div>
                <p className="font-semibold text-destructive">
                  Failed to load products
                </p>
                <p className="text-sm text-muted-foreground mt-1">{error}</p>
              </div>
              <Button variant="outline" className="gap-2" onClick={refresh}>
                <RefreshCw className="h-4 w-4" />
                Try again
              </Button>
            </div>
          )}

          {loading && !error && (
            <div
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              aria-label="Loading products"
              aria-busy="true"
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          )}

          {!loading && !error && filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
              <div className="text-5xl">🔍</div>
              <p className="font-semibold text-lg">No products found</p>
              <p className="text-sm text-muted-foreground max-w-xs">
                Try adjusting your search or filters to find what you're looking
                for.
              </p>
              <Button
                variant="outline"
                onClick={() =>
                  setFilters({ status: "all", category: "All", search: "" })
                }
              >
                Clear filters
              </Button>
            </div>
          )}

          {!loading && !error && filteredProducts.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-in">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onView={openDetail}
                  onDelete={deleteProduct}
                  onArchive={archiveProduct}
                  onRestore={restoreProduct}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Detail dialog */}
      <ProductDetailDialog
        product={selectedProduct}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onDelete={deleteProduct}
        onArchive={archiveProduct}
        onRestore={restoreProduct}
      />

      {/* Cart drawer */}
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />

      {/* Toasts */}
      <Toaster />
    </React.Fragment>
  );
}

export default function App() {
  return (
    <ProductsProvider>
      <CartProvider>
        <AppShell />
      </CartProvider>
    </ProductsProvider>
  );
}
