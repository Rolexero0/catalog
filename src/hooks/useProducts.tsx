import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import productsData from "@/data/products.json";
import { toast } from "@/hooks/useToast";
import type { Product, ProductCategory } from "@/types";

interface ProductsContextValue {
  products: Product[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
  deleteProduct: (id: string) => void;
  archiveProduct: (id: string) => void;
  restoreProduct: (id: string) => void;
}

const ProductsContext = createContext<ProductsContextValue | null>(null);

const INITIAL_PRODUCTS = productsData as Product[];

export const PRODUCT_CATEGORIES = Array.from(
  new Set(INITIAL_PRODUCTS.map((product) => product.category)),
) as ProductCategory[];

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setLoading(true);
    setError(null);

    const timeoutId = window.setTimeout(() => {
      setProducts(structuredClone(INITIAL_PRODUCTS));
      setLoading(false);
    }, 120);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const cleanup = refresh();
    return cleanup;
  }, []);

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
    toast({
      variant: "destructive",
      title: "Product deleted",
      description: "The product has been permanently removed.",
    });
  };

  const archiveProduct = (id: string) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id
          ? { ...product, status: "archived", stock: 0 }
          : product,
      ),
    );
    toast({
      title: "Product archived",
      description: "Product is now archived and hidden from active listings.",
    });
  };

  const restoreProduct = (id: string) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id
          ? {
              ...product,
              status: "active",
              stock: product.stock > 0 ? product.stock : 24,
            }
          : product,
      ),
    );
    toast({
      variant: "success",
      title: "Product restored",
      description: "Product is now active again.",
    });
  };

  const value = useMemo(
    () => ({
      products,
      loading,
      error,
      refresh,
      deleteProduct,
      archiveProduct,
      restoreProduct,
    }),
    [products, loading, error],
  );

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts(): ProductsContextValue {
  const context = useContext(ProductsContext);

  if (!context) {
    throw new Error("useProducts must be used inside ProductsProvider");
  }

  return context;
}
