import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Crown, Check, Book, Search, Zap, Shield, 
  TrendingUp, Users, CreditCard, Sparkles 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/context/UserContext';
import { useBooks } from '@/context/BookContext';
import { useToast } from '@/hooks/use-toast';

export default function Subscribe() {
  const navigate = useNavigate();
  const { user, subscribe } = useUser();
  const { books, totalBooks } = useBooks();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');

  const totalValue = books.reduce((sum, b) => sum + b.price, 0);
  const monthlyPrice = 49;
  const annualPrice = 468; // $39/mo billed annually
  const annualSavings = (monthlyPrice * 12) - annualPrice;

  const handleSubscribe = async () => {
    if (!user.isLoggedIn) {
      toast({
        title: "Please sign in",
        description: "Create an account to subscribe",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    subscribe();
    
    toast({
      title: "🎉 Welcome to Premium!",
      description: "You now have unlimited access to all medical texts.",
    });
    
    setIsProcessing(false);
    navigate('/research');
  };

  if (user.subscriptionType === 'subscriber') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-8 pb-8">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
              <Crown className="h-8 w-8 text-success" />
            </div>
            <h2 className="text-2xl font-bold mb-2">You're a Premium Member!</h2>
            <p className="text-muted-foreground mb-6">
              You have unlimited access to all {totalBooks} medical titles.
            </p>
            <Button onClick={() => navigate('/research')}>
              Go to Research Platform
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="medical-gradient py-16 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <Badge className="bg-warning/20 text-warning border-warning/30 mb-4">
            <Sparkles className="h-3 w-3 mr-1" />
            Premium Subscription
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Unlimited Access to<br />Medical Knowledge
          </h1>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Subscribe once, access everything. Search across all titles, 
            unlock every chapter, and accelerate your research.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 text-primary-foreground/70">
            <div className="flex items-center gap-2">
              <Book className="h-5 w-5" />
              <span>{totalBooks} Premier Titles</span>
            </div>
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              <span>Unlimited Search</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              <span>Research Tools</span>
            </div>
          </div>
        </div>
      </section>

      <main className="container py-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Pricing Cards */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mb-6">Choose Your Plan</h2>
              
              {/* Monthly */}
              <Card 
                className={`cursor-pointer transition-all ${
                  billingPeriod === 'monthly' 
                    ? 'ring-2 ring-accent shadow-lg' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => setBillingPeriod('monthly')}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Monthly</h3>
                      <p className="text-muted-foreground text-sm">Flexible, cancel anytime</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold">${monthlyPrice}</p>
                      <p className="text-sm text-muted-foreground">/month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Annual */}
              <Card 
                className={`cursor-pointer transition-all relative overflow-hidden ${
                  billingPeriod === 'annual' 
                    ? 'ring-2 ring-warning shadow-lg' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => setBillingPeriod('annual')}
              >
                <div className="absolute top-0 right-0 bg-warning text-warning-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                  SAVE ${annualSavings}
                </div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Annual</h3>
                      <p className="text-muted-foreground text-sm">Best value, 2 months free</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold">${annualPrice}</p>
                      <p className="text-sm text-muted-foreground">/year ($39/mo)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Value Comparison */}
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <p className="text-sm text-muted-foreground mb-2">
                  You're getting access to:
                </p>
                <p className="text-2xl font-bold text-foreground">
                  ${totalValue.toLocaleString()} <span className="text-base font-normal text-muted-foreground">worth of content</span>
                </p>
                <p className="text-sm text-success mt-1">
                  That's {Math.round(totalValue / monthlyPrice)}x the value!
                </p>
              </div>
            </div>

            {/* Checkout */}
            <div>
              <Card className="card-elevated">
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h3 className="text-xl font-bold mb-1">Complete Subscription</h3>
                    <p className="text-muted-foreground text-sm">
                      {billingPeriod === 'annual' 
                        ? `$${annualPrice} billed annually` 
                        : `$${monthlyPrice} billed monthly`}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    {[
                      { icon: Book, text: `Access to all ${totalBooks} titles` },
                      { icon: Search, text: 'Unlimited cross-title search' },
                      { icon: TrendingUp, text: 'Trending topics & insights' },
                      { icon: Zap, text: 'Related content recommendations' },
                      { icon: Shield, text: 'Cancel anytime' },
                    ].map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                          <feature.icon className="h-4 w-4 text-success" />
                        </div>
                        <span className="text-sm">{feature.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Payment Form */}
                  <div className="space-y-4 pt-4 border-t border-border">
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
                    onClick={handleSubscribe}
                    disabled={isProcessing}
                    variant="cta"
                    size="xl"
                    className="w-full"
                  >
                    {isProcessing ? (
                      'Processing...'
                    ) : (
                      <>
                        <Crown className="h-5 w-5 mr-2" />
                        Start Premium — ${billingPeriod === 'annual' ? annualPrice : monthlyPrice}
                        {billingPeriod === 'annual' ? '/yr' : '/mo'}
                      </>
                    )}
                  </Button>
                  
                  <p className="text-xs text-center text-muted-foreground">
                    This is a demo. No actual payment will be processed.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Books Preview */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6 text-center">What You'll Get Access To</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
              {books.slice(0, 8).map(book => (
                <div key={book.id} className="text-center">
                  <div 
                    className="w-full aspect-[3/4] rounded-lg mb-2 flex items-center justify-center"
                    style={{ backgroundColor: book.coverColor }}
                  >
                    <Book className="h-8 w-8 text-white/30" />
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{book.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
