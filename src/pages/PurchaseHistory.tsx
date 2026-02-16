import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Book, Crown, Calendar, CreditCard, Download, Receipt } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { epubBooks } from '@/data/mockEpubData';
import { useUser } from '@/context/UserContext';

interface PurchaseRecord {
  id: string;
  type: 'book' | 'subscription';
  bookId?: string;
  date: string;
  amount: number;
  status: 'completed' | 'pending' | 'refunded';
}

// Mock purchase history
const mockPurchases: PurchaseRecord[] = [
  {
    id: 'pur-001',
    type: 'book',
    bookId: 'harrison-internal',
    date: '2024-01-15',
    amount: 189.99,
    status: 'completed',
  },
  {
    id: 'pur-002',
    type: 'book',
    bookId: 'braunwald-cardiology',
    date: '2024-01-10',
    amount: 249.99,
    status: 'completed',
  },
  {
    id: 'sub-001',
    type: 'subscription',
    date: '2024-02-01',
    amount: 49.00,
    status: 'completed',
  },
];

export default function PurchaseHistory() {
  const navigate = useNavigate();
  const { user } = useUser();

  // Filter purchases based on user state
  const userPurchases = user.subscriptionType === 'subscriber' 
    ? mockPurchases 
    : user.ownedBooks.length > 0 
      ? mockPurchases.filter(p => p.type === 'book' && user.ownedBooks.includes(p.bookId || ''))
      : [];

  const getBookDetails = (bookId: string) => {
    return epubBooks.find(b => b.id === bookId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const totalSpent = userPurchases.reduce((sum, p) => sum + p.amount, 0);

  if (!user.isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-8 pb-8">
            <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Sign In Required</h2>
            <p className="text-muted-foreground mb-6">
              Please sign in to view your purchase history.
            </p>
            <Button onClick={() => navigate('/')}>
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border bg-card">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <Receipt className="h-8 w-8 text-accent" />
                Purchase History
              </h1>
              <p className="text-muted-foreground mt-1">
                View your orders, subscriptions, and invoices
              </p>
            </div>
            
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold text-foreground">${totalSpent.toFixed(2)}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <main className="container py-8">
        {userPurchases.length > 0 ? (
          <div className="space-y-4">
            {userPurchases.map((purchase) => {
              const book = purchase.bookId ? getBookDetails(purchase.bookId) : null;
              
              return (
                <Card key={purchase.id} className="card-elevated">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Icon/Cover */}
                      <div 
                        className="w-16 h-20 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ 
                          backgroundColor: book?.coverColor || 'hsl(var(--accent))' 
                        }}
                      >
                        {purchase.type === 'subscription' ? (
                          <Crown className="h-8 w-8 text-white/50" />
                        ) : (
                          <Book className="h-8 w-8 text-white/30" />
                        )}
                      </div>
                      
                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-semibold text-foreground">
                              {purchase.type === 'subscription' 
                                ? 'Premium Subscription' 
                                : book?.title || 'Unknown Book'}
                            </h3>
                            {book && (
                              <p className="text-sm text-muted-foreground mt-0.5">
                                {book.authors[0]} • {book.publisher}
                              </p>
                            )}
                            {purchase.type === 'subscription' && (
                              <p className="text-sm text-muted-foreground mt-0.5">
                                Monthly subscription - Unlimited access to all titles
                              </p>
                            )}
                          </div>
                          
                          <Badge 
                            variant={purchase.status === 'completed' ? 'default' : 'secondary'}
                            className={purchase.status === 'completed' ? 'bg-success text-success-foreground' : ''}
                          >
                            {purchase.status}
                          </Badge>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4" />
                            {formatDate(purchase.date)}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <CreditCard className="h-4 w-4" />
                            ${purchase.amount.toFixed(2)}
                          </span>
                          <span className="text-xs">
                            Order #{purchase.id.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex gap-2 sm:flex-col">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1.5" />
                          Invoice
                        </Button>
                        {purchase.type === 'book' && book && (
                          <Button 
                            size="sm"
                            onClick={() => navigate(`/research?book=${book.id}`)}
                          >
                            <Book className="h-4 w-4 mr-1.5" />
                            Read
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="text-center py-16">
            <CardContent>
              <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">No Purchases Yet</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                You haven't made any purchases. Browse our library to find medical texts that fit your needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => navigate('/library')}>
                  Browse Library
                </Button>
                <Button variant="cta" onClick={() => navigate('/subscribe')}>
                  <Crown className="h-4 w-4 mr-1.5" />
                  Subscribe to Premium
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Subscription Status */}
        {user.subscriptionType === 'subscriber' && (
          <Card className="mt-8 card-elevated bg-gradient-to-br from-accent/5 to-teal-500/5 border-accent/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Crown className="h-6 w-6 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Premium Subscriber</h3>
                  <p className="text-sm text-muted-foreground">
                    Your subscription renews on March 1, 2024
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Manage Subscription
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
