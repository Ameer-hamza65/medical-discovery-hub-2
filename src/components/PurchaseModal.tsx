import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EpubBook } from '@/data/mockEpubData';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Check, Book, Shield, Zap, Crown } from 'lucide-react';

interface PurchaseModalProps {
  book: EpubBook | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  showSubscriptionOption?: boolean;
}

export function PurchaseModal({ book, open, onOpenChange, showSubscriptionOption = true }: PurchaseModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseType, setPurchaseType] = useState<'single' | 'subscribe'>('single');
  const { purchaseBook, subscribe, user } = useUser();
  const { toast } = useToast();

  if (!book) return null;

  const handlePurchase = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (purchaseType === 'subscribe') {
      subscribe();
      toast({
        title: "🎉 Welcome to Premium!",
        description: "You now have unlimited access to all medical texts.",
      });
    } else {
      purchaseBook(book.id);
      toast({
        title: "Purchase Complete!",
        description: `"${book.title}" has been added to your library.`,
      });
    }
    
    setIsProcessing(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Complete Your Purchase</DialogTitle>
          <DialogDescription>
            Unlock access to expert medical knowledge
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {/* Book Info */}
          <div className="flex gap-4 p-4 rounded-lg bg-muted/50 border border-border">
            <div 
              className="w-16 h-20 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: book.coverColor }}
            >
              <Book className="h-8 w-8 text-white/30" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-foreground line-clamp-2">{book.title}</h4>
              <p className="text-sm text-muted-foreground mt-1">{book.authors[0]}</p>
              <p className="text-sm text-muted-foreground">{book.publisher}</p>
            </div>
          </div>

          {/* Purchase Options */}
          {showSubscriptionOption && user.subscriptionType !== 'subscriber' && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Select an option</Label>
              
              <button
                onClick={() => setPurchaseType('single')}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                  purchaseType === 'single' 
                    ? 'border-accent bg-accent/5' 
                    : 'border-border hover:border-muted-foreground/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      purchaseType === 'single' ? 'border-accent bg-accent' : 'border-muted-foreground'
                    }`}>
                      {purchaseType === 'single' && <Check className="h-3 w-3 text-accent-foreground" />}
                    </div>
                    <div>
                      <p className="font-medium">Buy This Book</p>
                      <p className="text-sm text-muted-foreground">One-time purchase, lifetime access</p>
                    </div>
                  </div>
                  <span className="text-xl font-bold">${book.price}</span>
                </div>
              </button>
              
              <button
                onClick={() => setPurchaseType('subscribe')}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all relative overflow-hidden ${
                  purchaseType === 'subscribe' 
                    ? 'border-warning bg-warning/5' 
                    : 'border-border hover:border-muted-foreground/30'
                }`}
              >
                <div className="absolute top-0 right-0 bg-warning text-warning-foreground text-xs font-bold px-2 py-0.5 rounded-bl-lg">
                  BEST VALUE
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      purchaseType === 'subscribe' ? 'border-warning bg-warning' : 'border-muted-foreground'
                    }`}>
                      {purchaseType === 'subscribe' && <Check className="h-3 w-3 text-warning-foreground" />}
                    </div>
                    <div>
                      <p className="font-medium flex items-center gap-1.5">
                        <Crown className="h-4 w-4 text-warning" />
                        Premium Subscription
                      </p>
                      <p className="text-sm text-muted-foreground">Unlimited access to all 8 books</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold">$49</span>
                    <span className="text-sm text-muted-foreground">/mo</span>
                  </div>
                </div>
              </button>
            </div>
          )}

          {/* Benefits */}
          <div className="space-y-2 py-3 border-y border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="h-4 w-4 text-accent" />
              <span>Instant access after purchase</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-accent" />
              <span>Secure payment processing</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Book className="h-4 w-4 text-accent" />
              <span>Full-text search & research tools</span>
            </div>
          </div>

          {/* Demo Payment Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="card">Card Number</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="card"
                  placeholder="4242 4242 4242 4242"
                  className="pl-10"
                  defaultValue="4242 4242 4242 4242"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry</Label>
                <Input id="expiry" placeholder="MM/YY" defaultValue="12/28" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input id="cvc" placeholder="123" defaultValue="123" />
              </div>
            </div>
          </div>

          <Button
            onClick={handlePurchase}
            disabled={isProcessing}
            variant={purchaseType === 'subscribe' ? 'cta' : 'default'}
            size="lg"
            className="w-full"
          >
            {isProcessing ? (
              <>Processing...</>
            ) : purchaseType === 'subscribe' ? (
              <>Start Premium — $49/mo</>
            ) : (
              <>Complete Purchase — ${book.price}</>
            )}
          </Button>
          
          <p className="text-xs text-center text-muted-foreground">
            This is a demo. No actual payment will be processed.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
