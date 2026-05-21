import {
  Archive,
  RotateCcw,
  Trash2,
  ShoppingCart,
  Eye,
  CheckCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Product } from "@/types";
import { useCart } from "@/hooks/useCart";
import { formatNaira } from "@/lib/formatters";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  onView: (product: Product) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  onRestore: (id: string) => void;
}

export function ProductCard({
  product,
  onView,
  onDelete,
  onArchive,
  onRestore,
}: ProductCardProps) {
  const { addToCart, isInCart } = useCart();
  const inCart = isInCart(product.id);
  const isArchived = product.status === "archived";

  return (
    <Card
      className={cn(
        "group flex flex-col overflow-hidden border-border/70 bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg",
        isArchived && "opacity-75",
      )}
    >
      <div
        className="relative h-48 cursor-pointer overflow-hidden bg-muted"
        onClick={() => onView(product)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onView(product)}
        aria-label={`View ${product.name} details`}
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop";
          }}
        />

        {isArchived && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <Badge
              variant="secondary"
              className="text-xs font-semibold uppercase tracking-wider"
            >
              Archived
            </Badge>
          </div>
        )}

        <div className="absolute left-3 top-3">
          <Badge className="border border-white/20 bg-white/90 text-xs text-slate-900 backdrop-blur">
            {product.category}
          </Badge>
        </div>
      </div>

      <CardContent className="flex flex-1 flex-col gap-2 p-4">
        <button
          className="text-left"
          onClick={() => onView(product)}
          aria-label={`Open ${product.name}`}
        >
          <h3 className="text-base font-semibold leading-tight transition-colors hover:text-primary line-clamp-2">
            {product.name}
          </h3>
        </button>

        <p className="line-clamp-2 text-sm text-muted-foreground flex-1">
          {product.description}
        </p>

        <div className="flex items-center justify-between pt-1">
          <span className="text-lg font-semibold text-primary">
            {formatNaira(product.price)}
          </span>
          <span className="text-xs text-muted-foreground">
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </span>
        </div>
      </CardContent>

      {/* Actions */}
      <CardFooter className="flex gap-2 border-t border-border/60 bg-muted/20 p-4 pt-3">
        {/* View */}
        <Button
          size="sm"
          variant="outline"
          className="flex-1 gap-1.5"
          onClick={() => onView(product)}
          aria-label={`View ${product.name}`}
        >
          <Eye className="h-3.5 w-3.5" />
          View
        </Button>

        {!isArchived && (
          <Button
            size="sm"
            className="flex-1 gap-1.5"
            onClick={() => addToCart(product)}
            disabled={inCart || product.stock === 0}
            aria-label={
              inCart ? "Already in cart" : `Add ${product.name} to cart`
            }
          >
            {inCart ? (
              <>
                <CheckCircle className="h-3.5 w-3.5" />
                In Cart
              </>
            ) : (
              <>
                <ShoppingCart className="h-3.5 w-3.5" />
                Add
              </>
            )}
          </Button>
        )}

        {isArchived ? (
          <Button
            size="icon"
            variant="outline"
            className="shrink-0"
            onClick={() => onRestore(product.id)}
            aria-label={`Restore ${product.name}`}
            title="Restore product"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        ) : (
          <Button
            size="icon"
            variant="outline"
            className="shrink-0"
            onClick={() => onArchive(product.id)}
            aria-label={`Archive ${product.name}`}
            title="Archive product"
          >
            <Archive className="h-3.5 w-3.5" />
          </Button>
        )}

        {/* Delete */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              className="shrink-0 text-destructive hover:bg-destructive hover:text-white"
              aria-label={`Delete ${product.name}`}
              title="Delete product"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete "{product.name}"?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. The product will be permanently
                removed from the catalogue.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive! text-destructive-foreground! hover:bg-destructive/90"
                onClick={() => onDelete(product.id)}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
