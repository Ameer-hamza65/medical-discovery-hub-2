import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, SortAsc } from 'lucide-react';
import { BookCard } from '@/components/BookCard';
import { PurchaseModal } from '@/components/PurchaseModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EpubBook } from '@/data/mockEpubData';
import { useUser } from '@/context/UserContext';
import { useBooks } from '@/context/BookContext';

export default function Library() {
  const navigate = useNavigate();
  const { user, hasFullAccess } = useUser();
  const { books } = useBooks();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('popular');
  const [purchaseBook, setPurchaseBook] = useState<EpubBook | null>(null);

  // Get unique specialties from current books
  const specialties = [...new Set(books.map(b => b.specialty))];

  const filteredBooks = books
    .filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           book.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           book.authors.some(a => a.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesSpecialty = selectedSpecialty === 'all' || book.specialty === selectedSpecialty;
      return matchesSearch && matchesSpecialty;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.accessCount - a.accessCount;
        case 'newest':
          return b.publishedYear - a.publishedYear;
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const handleBuy = useCallback((book: EpubBook) => {
    setPurchaseBook(book);
  }, []);

  const handleSubscribe = useCallback(() => {
    navigate('/subscribe');
  }, [navigate]);

  const handleView = useCallback((book: EpubBook) => {
    // Open the book in the reader, starting with the first chapter
    if (book.tableOfContents && book.tableOfContents.length > 0) {
      const firstChapter = book.tableOfContents[0];
      navigate(`/reader?book=${book.id}&chapter=${firstChapter.id}`);
    } else {
      // If no chapters, navigate to research page
      navigate(`/research?book=${book.id}`);
    }
  }, [navigate]);

  const ownedCount = books.filter(b => hasFullAccess(b.id)).length;
  const totalValue = books.reduce((sum, b) => sum + b.price, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border bg-card">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Medical Library</h1>
              <p className="text-muted-foreground mt-1">
                {books.length} titles from leading medical publishers
              </p>
            </div>
            
            {user.isLoggedIn && (
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="text-sm py-1.5 px-3">
                  {ownedCount} of {books.length} titles accessible
                </Badge>
                {user.subscriptionType !== 'subscriber' && (
                  <Button variant="cta" onClick={handleSubscribe}>
                    Get All for $49/mo
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <main className="container py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search titles, authors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Specialty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specialties</SelectItem>
              {specialties.map(specialty => (
                <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SortAsc className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="title">Title A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Count */}
        <p className="text-sm text-muted-foreground mb-6">
          Showing {filteredBooks.length} of {books.length} titles
        </p>

        {/* Book Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map(book => (
            <BookCard
              key={book.id}
              book={book}
              onBuy={handleBuy}
              onSubscribe={handleSubscribe}
              onView={handleView}
            />
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-16">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Books Found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button onClick={() => { setSearchTerm(''); setSelectedSpecialty('all'); }}>
              Clear Filters
            </Button>
          </div>
        )}

        {/* Subscription CTA */}
        {user.subscriptionType !== 'subscriber' && (
          <div className="mt-12 p-8 rounded-2xl medical-gradient text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-3">
              Unlock All {books.length} Titles
            </h2>
            <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
              Get unlimited access to ${totalValue.toLocaleString()} worth of medical texts 
              for just $49/month with Premium subscription.
            </p>
            <Button 
              variant="cta" 
              size="xl"
              onClick={handleSubscribe}
            >
              Start Premium Subscription
            </Button>
          </div>
        )}
      </main>

      <PurchaseModal
        book={purchaseBook}
        open={!!purchaseBook}
        onOpenChange={(open) => !open && setPurchaseBook(null)}
      />
    </div>
  );
}
