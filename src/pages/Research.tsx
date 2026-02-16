import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Search, Book, Crown, TrendingUp, History, Bookmark, 
  ChevronRight, Lock, Sparkles, Filter, BookOpen 
} from 'lucide-react';
import { SearchBar } from '@/components/SearchBar';
import { SearchResult } from '@/components/SearchResult';
import { TrendingTopics } from '@/components/TrendingTopics';
import { RelatedContent } from '@/components/RelatedContent';
import { PurchaseModal } from '@/components/PurchaseModal';
import { ChapterReader } from '@/components/ChapterReader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { searchBooks, EpubBook, Chapter } from '@/data/mockEpubData';
import { useUser } from '@/context/UserContext';
import { useBooks } from '@/context/BookContext';

export default function Research() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, hasFullAccess } = useUser();
  const { books, totalBooks } = useBooks();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ReturnType<typeof searchBooks>>([]);
  const [activeTab, setActiveTab] = useState('search');
  const [purchaseBook, setPurchaseBook] = useState<EpubBook | null>(null);
  const [readerState, setReaderState] = useState<{ book: EpubBook; chapter: Chapter } | null>(null);
  const [recentSearches] = useState(['diabetes treatment', 'cardiac arrhythmia', 'sepsis management']);

  // Get user's accessible books
  const accessibleBooks = books.filter(book => hasFullAccess(book.id));
  const inaccessibleBooks = books.filter(book => !hasFullAccess(book.id));

  useEffect(() => {
    // Check if user has access
    if (!user.isLoggedIn || (user.subscriptionType === 'none' && user.ownedBooks.length === 0)) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    // Only search within accessible books
    const allResults = searchBooks(query);
    const accessibleResults = allResults.filter(r => hasFullAccess(r.book.id));
    const inaccessibleResults = allResults.filter(r => !hasFullAccess(r.book.id));
    setSearchResults([...accessibleResults, ...inaccessibleResults]);
    setActiveTab('search');
  }, [hasFullAccess]);

  const handleBuyBook = useCallback((book: EpubBook) => {
    setPurchaseBook(book);
  }, []);

  const handleSubscribe = useCallback(() => {
    navigate('/subscribe');
  }, [navigate]);

  const handleViewChapter = useCallback((book: EpubBook, chapter: Chapter) => {
    if (hasFullAccess(book.id)) {
      setReaderState({ book, chapter });
    } else {
      setPurchaseBook(book);
    }
  }, [hasFullAccess]);

  if (!user.isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border bg-card">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-accent" />
                My Research Platform
              </h1>
              <p className="text-muted-foreground mt-1">
                {accessibleBooks.length} title{accessibleBooks.length !== 1 ? 's' : ''} in your library
                {user.subscriptionType === 'subscriber' && ' • Premium Subscriber'}
              </p>
            </div>
            
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Search within your library..."
              className="md:w-96"
            />
          </div>
        </div>
      </section>

      <main className="container py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="search" className="gap-2">
                  <Search className="h-4 w-4" />
                  Search Results
                </TabsTrigger>
                <TabsTrigger value="library" className="gap-2">
                  <Book className="h-4 w-4" />
                  My Books
                </TabsTrigger>
                <TabsTrigger value="recent" className="gap-2">
                  <History className="h-4 w-4" />
                  Recent
                </TabsTrigger>
              </TabsList>

              {/* Search Results Tab */}
              <TabsContent value="search" className="space-y-6">
                {searchQuery ? (
                  <>
                    <div className="flex items-center justify-between">
                      <p className="text-muted-foreground">
                        {searchResults.length} results for "{searchQuery}"
                      </p>
                    </div>

                    {searchResults.length > 0 ? (
                      <div className="space-y-4">
                        {searchResults.map((result) => (
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
                      <div className="text-center py-12 bg-muted/50 rounded-xl">
                        <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Results</h3>
                        <p className="text-muted-foreground">
                          Try different search terms
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12 bg-muted/50 rounded-xl">
                    <Sparkles className="h-12 w-12 text-accent mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Start Researching</h3>
                    <p className="text-muted-foreground mb-6">
                      Search across your library by topic, condition, drug, or procedure
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {recentSearches.map(term => (
                        <Button
                          key={term}
                          variant="secondary"
                          size="sm"
                          onClick={() => handleSearch(term)}
                        >
                          {term}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* My Books Tab */}
              <TabsContent value="library" className="space-y-6">
                <h3 className="text-lg font-semibold">Your Library</h3>
                
                {accessibleBooks.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {accessibleBooks.map(book => (
                      <Card 
                        key={book.id} 
                        className="card-elevated cursor-pointer"
                        onClick={() => handleSearch(book.specialty)}
                      >
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <div 
                              className="w-14 h-18 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: book.coverColor }}
                            >
                              <Book className="h-6 w-6 text-white/30" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-foreground line-clamp-2">
                                {book.title}
                              </h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {book.tableOfContents.length} chapters
                              </p>
                              <Badge variant="secondary" className="mt-2">
                                {book.specialty}
                              </Badge>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-muted/50 rounded-xl">
                    <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Books Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Purchase books or subscribe to access medical content
                    </p>
                    <Button onClick={() => navigate('/library')}>
                      Browse Library
                    </Button>
                  </div>
                )}

                {/* Upsell Section */}
                {inaccessibleBooks.length > 0 && user.subscriptionType !== 'subscriber' && (
                  <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Crown className="h-5 w-5 text-warning" />
                        Expand Your Library
                      </h3>
                      <Button variant="outline" size="sm" onClick={() => navigate('/library')}>
                        View All
                      </Button>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {inaccessibleBooks.slice(0, 2).map(book => (
                        <Card key={book.id} className="card-elevated border-dashed">
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              <div 
                                className="w-14 h-18 rounded-lg flex items-center justify-center flex-shrink-0 opacity-60"
                                style={{ backgroundColor: book.coverColor }}
                              >
                                <Lock className="h-6 w-6 text-white/50" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-foreground line-clamp-2">
                                  {book.title}
                                </h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                  ${book.price}
                                </p>
                                <Button 
                                  variant="cta" 
                                  size="sm" 
                                  className="mt-2"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleBuyBook(book);
                                  }}
                                >
                                  Unlock
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Recent Activity Tab */}
              <TabsContent value="recent" className="space-y-6">
                <div className="grid gap-4">
                  <Card className="card-elevated">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <History className="h-4 w-4 text-muted-foreground" />
                        Recent Searches
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        {recentSearches.map(term => (
                          <button
                            key={term}
                            onClick={() => handleSearch(term)}
                            className="w-full text-left p-3 rounded-lg hover:bg-muted transition-colors flex items-center justify-between group"
                          >
                            <span className="text-sm">{term}</span>
                            <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="card-elevated">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Bookmark className="h-4 w-4 text-muted-foreground" />
                        Saved Chapters
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground py-4 text-center">
                        Bookmark chapters to find them here
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <TrendingTopics onTopicClick={handleSearch} compact />

            {/* Quick Stats */}
            <Card className="card-elevated">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Your Activity</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Books accessed</span>
                  <span className="font-medium">{accessibleBooks.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Searches today</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Chapters read</span>
                  <span className="font-medium">24</span>
                </div>
              </CardContent>
            </Card>

            {/* Upgrade CTA */}
            {user.subscriptionType !== 'subscriber' && (
              <Card className="card-elevated bg-gradient-to-br from-warning/10 to-orange-500/10 border-warning/20">
                <CardContent className="p-4">
                  <Crown className="h-8 w-8 text-warning mb-2" />
                  <h3 className="font-semibold mb-1">Upgrade to Premium</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Unlock all {totalBooks} titles for unlimited research
                  </p>
                  <Button variant="cta" className="w-full" onClick={handleSubscribe}>
                    $49/month
                  </Button>
                </CardContent>
              </Card>
            )}
          </aside>
        </div>
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
