import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Book, Crown, TrendingUp, Users, Zap } from 'lucide-react';
import { SearchBar } from '@/components/SearchBar';
import { SearchResult } from '@/components/SearchResult';
import { TrendingTopics } from '@/components/TrendingTopics';
import { PurchaseModal } from '@/components/PurchaseModal';
import { ChapterReader } from '@/components/ChapterReader';
import { Button } from '@/components/ui/button';
import { EpubBook, Chapter, medicalTags } from '@/data/mockEpubData';
import { useUser } from '@/context/UserContext';
import { useBooks } from '@/context/BookContext';

// Search function using dynamic books
function searchBooksInLibrary(books: EpubBook[], query: string) {
  const normalizedQuery = query.toLowerCase().trim();
  const queryTerms = normalizedQuery.split(/\s+/);
  const results: Array<{
    book: EpubBook;
    chapter: Chapter;
    snippet: string;
    relevanceScore: number;
  }> = [];

  for (const book of books) {
    for (const chapter of book.tableOfContents) {
      let relevanceScore = 0;
      const contentLower = chapter.content.toLowerCase();
      const titleLower = chapter.title.toLowerCase();
      
      for (const term of queryTerms) {
        if (titleLower.includes(term)) {
          relevanceScore += 30;
        }
        
        const contentMatches = (contentLower.match(new RegExp(term, 'g')) || []).length;
        relevanceScore += contentMatches * 5;
        
        const tagMatches = chapter.tags.filter(tag => 
          tag.toLowerCase().includes(term) || 
          medicalTags.find(t => t.id === tag)?.name.toLowerCase().includes(term)
        ).length;
        relevanceScore += tagMatches * 20;
        
        if (book.specialty.toLowerCase().includes(term)) {
          relevanceScore += 15;
        }
      }

      if (relevanceScore > 0) {
        let snippetStart = 0;
        for (const term of queryTerms) {
          const idx = contentLower.indexOf(term);
          if (idx > -1) {
            snippetStart = Math.max(0, idx - 50);
            break;
          }
        }
        const snippet = chapter.content.slice(snippetStart, snippetStart + 200) + '...';

        results.push({
          book,
          chapter,
          snippet,
          relevanceScore
        });
      }
    }
  }

  return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
}

export default function Index() {
  const navigate = useNavigate();
  const { user, hasFullAccess } = useUser();
  const { books, totalBooks } = useBooks();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ReturnType<typeof searchBooksInLibrary>>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [purchaseBook, setPurchaseBook] = useState<EpubBook | null>(null);
  const [readerState, setReaderState] = useState<{ book: EpubBook; chapter: Chapter } | null>(null);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    const results = searchBooksInLibrary(books, query);
    setSearchResults(results);
    setHasSearched(true);
  }, [books]);

  const handleBuyBook = useCallback((book: EpubBook) => {
    setPurchaseBook(book);
  }, []);

  const handleSubscribe = useCallback(() => {
    navigate('/subscribe');
  }, [navigate]);

  const handleViewChapter = useCallback((book: EpubBook, chapter: Chapter) => {
    setReaderState({ book, chapter });
  }, []);

  // Calculate total chapters across all books
  const totalChapters = useMemo(() => 
    books.reduce((sum, book) => sum + book.tableOfContents.length, 0), 
    [books]
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="medical-gradient py-20 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4 tracking-tight">
            Medical Knowledge,{' '}
            <span className="text-warning">Intelligently Searched</span>
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Access thousands of medical EPUBs from leading publishers. 
            Search by topic, condition, or procedure across your entire library.
          </p>
          
          <SearchBar 
            onSearch={handleSearch} 
            size="large"
            initialValue={searchQuery}
          />
          
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-primary-foreground/70 text-sm">
            <div className="flex items-center gap-2">
              <Book className="h-5 w-5" />
              <span>{totalBooks} Premier Titles</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>50,000+ Medical Professionals</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              <span>Instant Results</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container py-12">
        {hasSearched ? (
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Search Results */}
            <div className="lg:col-span-3 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Search Results
                  </h2>
                  <p className="text-muted-foreground">
                    {searchResults.length} results for "{searchQuery}"
                  </p>
                </div>
                <SearchBar 
                  onSearch={handleSearch} 
                  initialValue={searchQuery}
                  className="hidden md:block w-80"
                />
              </div>

              {searchResults.length > 0 ? (
                <div className="space-y-4">
                  {searchResults.map((result, index) => (
                    <SearchResult
                      key={`${result.book.id}-${result.chapter.id}`}
                      book={result.book}
                      chapter={result.chapter}
                      snippet={result.snippet}
                      relevanceScore={result.relevanceScore}
                      searchQuery={searchQuery}
                      onBuyBook={handleBuyBook}
                      onSubscribe={handleSubscribe}
                      onViewChapter={handleViewChapter}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-muted/50 rounded-xl">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Results Found</h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your search terms or browse our trending topics
                  </p>
                  <Button onClick={() => setHasSearched(false)}>
                    Clear Search
                  </Button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              <TrendingTopics onTopicClick={handleSearch} />
              
              {user.subscriptionType !== 'subscriber' && (
                <div className="card-elevated p-6 rounded-xl bg-gradient-to-br from-warning/10 to-orange-500/10 border border-warning/20">
                  <Crown className="h-10 w-10 text-warning mb-3" />
                  <h3 className="font-bold text-lg mb-2">Unlock Everything</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get unlimited access to all medical texts with Premium
                  </p>
                  <Button variant="cta" className="w-full" onClick={handleSubscribe}>
                    Subscribe — $49/mo
                  </Button>
                </div>
              )}
            </aside>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Book, label: 'Medical Titles', value: String(totalBooks), sublabel: 'Premier Publishers' },
                { icon: Search, label: 'Searchable Chapters', value: `${totalChapters}+`, sublabel: 'Fully Indexed' },
                { icon: TrendingUp, label: 'Monthly Searches', value: '50K+', sublabel: 'By Professionals' },
              ].map((stat) => (
                <div key={stat.label} className="card-elevated p-6 rounded-xl text-center">
                  <stat.icon className="h-10 w-10 text-accent mx-auto mb-3" />
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="font-medium text-foreground">{stat.label}</p>
                  <p className="text-sm text-muted-foreground">{stat.sublabel}</p>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Featured Books */}
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold mb-6">Featured Titles</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {books.slice(0, 4).map((book) => (
                    <div 
                      key={book.id}
                      className="card-elevated p-4 rounded-xl cursor-pointer"
                      onClick={() => {
                        // Open book in reader if user has access, otherwise show purchase modal
                        if (hasFullAccess(book.id) && book.tableOfContents && book.tableOfContents.length > 0) {
                          const firstChapter = book.tableOfContents[0];
                          navigate(`/reader?book=${book.id}&chapter=${firstChapter.id}`);
                        } else {
                          handleBuyBook(book);
                        }
                      }}
                    >
                      <div className="flex gap-4">
                        <div 
                          className="w-16 h-20 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: book.coverColor }}
                        >
                          <Book className="h-8 w-8 text-white/30" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground line-clamp-2 hover:text-accent transition-colors">
                            {book.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {book.specialty}
                          </p>
                          <p className="text-sm font-medium text-accent mt-2">
                            ${book.price}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  className="mt-4 w-full"
                  onClick={() => navigate('/library')}
                >
                  View All Titles
                </Button>
              </div>

              {/* Trending */}
              <TrendingTopics onTopicClick={handleSearch} compact />
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <PurchaseModal
        book={purchaseBook}
        open={!!purchaseBook}
        onOpenChange={(open) => !open && setPurchaseBook(null)}
      />

      {readerState && (
        <ChapterReader
          book={readerState.book}
          chapter={readerState.chapter}
          open={!!readerState}
          onOpenChange={(open) => !open && setReaderState(null)}
          onViewChapter={handleViewChapter}
          onBuyBook={handleBuyBook}
          onSubscribe={handleSubscribe}
        />
      )}
    </div>
  );
}
