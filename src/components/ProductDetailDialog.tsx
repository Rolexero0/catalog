import {
  Archive,
  RotateCcw,
  Trash2,
  ShoppingCart,
  CheckCircle,
  Package,
  Tag,
  Calendar,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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

interface ProductDetailDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  onRestore: (id: string) => void;
}

export function ProductDetailDialog({
  product,
  open,
  onOpenChange,
  onDelete,
  onArchive,
  onRestore,
}: ProductDetailDialogProps) {
  const { addToCart, isInCart } = useCart();

  if (!product) return null;

  const inCart = isInCart(product.id);
  const isArchived = product.status === "archived";

  const handleDelete = () => {
    onDelete(product.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl overflow-hidden border-slate-200 bg-white p-0 text-slate-900 shadow-[0_28px_90px_rgba(15,23,42,0.22)]">
        <div className="relative h-56 w-full overflow-hidden bg-muted">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop";
            }}
          />
          {isArchived && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Badge
                variant="secondary"
                className="text-sm font-bold uppercase tracking-widest px-4 py-1.5"
              >
                Archived
              </Badge>
            </div>
          )}
          <div className="absolute left-4 top-4">
            <Badge>{product.category}</Badge>
          </div>
        </div>

        <div className="space-y-5 bg-white p-6">
          <DialogHeader>
            <div className="flex items-start justify-between gap-4">
              <DialogTitle className="text-2xl font-semibold">
                {product.name}
              </DialogTitle>
              <span className="shrink-0 text-2xl font-semibold text-primary">
                {formatNaira(product.price)}
              </span>
            </div>
            <DialogDescription className="text-base leading-relaxed text-slate-600">
              {product.description}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-3 gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-col items-center gap-1 text-center">
              <Package className="h-4 w-4 text-slate-500" />
              <span className="text-xs text-slate-500">Stock</span>
              <span className="font-semibold text-sm">
                {product.stock > 0 ? product.stock : "Out of stock"}
              </span>
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <Tag className="h-4 w-4 text-slate-500" />
              <span className="text-xs text-slate-500">Category</span>
              <span className="font-semibold text-sm">{product.category}</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <Calendar className="h-4 w-4 text-slate-500" />
              <span className="text-xs text-slate-500">Added</span>
              <span className="font-semibold text-sm">
                {new Date(product.createdAt).toLocaleDateString("en-GB", {
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {!isArchived && (
              <Button
                className="flex-1 gap-2"
                onClick={() => addToCart(product)}
                disabled={inCart || product.stock === 0}
              >
                {inCart ? (
                  <>
                    <CheckCircle className="h-4 w-4" /> In Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4" /> Add to Cart
                  </>
                )}
              </Button>
            )}

            {isArchived ? (
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => {
                  onRestore(product.id);
                  onOpenChange(false);
                }}
              >
                <RotateCcw className="h-4 w-4" /> Restore Product
              </Button>
            ) : (
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => {
                  onArchive(product.id);
                  onOpenChange(false);
                }}
              >
                <Archive className="h-4 w-4" /> Archive
              </Button>
            )}

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="gap-2 text-destructive hover:bg-destructive hover:text-white"
                >
                  <Trash2 className="h-4 w-4" /> Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete "{product.name}"?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. The product will be
                    permanently removed.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={handleDelete}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
