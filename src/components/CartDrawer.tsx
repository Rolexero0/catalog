import {
  Minus,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCart } from "@/hooks/useCart";
import { formatNaira } from "@/lib/formatters";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="fixed right-0 top-0 bottom-0 left-auto flex h-full max-w-md translate-x-0 translate-y-0 flex-col gap-0 rounded-none border-l border-slate-200 bg-white p-0 text-slate-900 shadow-[0_28px_90px_rgba(15,23,42,0.22)] sm:rounded-none">
        <DialogHeader className="border-b border-slate-200 bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-lg">
              <ShoppingCart className="h-5 w-5" />
              Cart
              {cart.totalItems > 0 && (
                <Badge className="ml-1">{cart.totalItems}</Badge>
              )}
            </DialogTitle>
            {cart.items.length > 0 && (
              <Button
                size="sm"
                variant="ghost"
                className="text-xs text-muted-foreground gap-1"
                onClick={() => clearCart()}
              >
                <Trash2 className="h-3 w-3" />
                Clear all
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 px-6 py-4">
          {cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-16">
              <ShoppingBag className="h-14 w-14 text-muted-foreground/40" />
              <div>
                <p className="font-semibold text-muted-foreground">
                  Your cart is empty
                </p>
                <p className="text-sm text-muted-foreground/60 mt-1">
                  Add products to see them here
                </p>
              </div>
            </div>
          ) : (
            cart.items.map((item) => (
              <div
                key={item.productId}
                className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
              >
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="h-16 w-16 rounded-lg object-cover shrink-0"
                />
                <div className="flex flex-1 flex-col justify-between min-w-0">
                  <div>
                    <p className="font-medium text-sm leading-snug line-clamp-2">
                      {item.product.name}
                    </p>
                    <div className="mt-2 inline-flex items-center rounded-full border border-slate-200 bg-slate-100 p-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 rounded-full"
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                        aria-label={`Decrease quantity for ${item.product.name}`}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </Button>
                      <span className="min-w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 rounded-full"
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                        aria-label={`Increase quantity for ${item.product.name}`}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-primary">
                    {formatNaira(item.quantity * item.product.price)}
                  </p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 shrink-0 self-start text-slate-500 hover:text-destructive"
                  onClick={() => removeFromCart(item.productId)}
                  aria-label={`Remove ${item.product.name} from cart`}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))
          )}
        </div>

        {cart.items.length > 0 && (
          <div className="space-y-3 border-t border-slate-200 bg-white px-6 py-4">
            <div className="flex justify-between text-sm text-slate-500">
              <span>Subtotal ({cart.totalItems} items)</span>
              <span className="font-semibold text-foreground">
                {formatNaira(cart.totalPrice)}
              </span>
            </div>
            <Button className="w-full" size="lg">
              Checkout
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
