import { Book, FileText, Tag, ChevronRight, Lock, Check, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { EpubBook, Chapter, medicalTags } from '@/data/mockEpubData';
import { useUser } from '@/context/UserContext';
import { cn } from '@/lib/utils';

interface SearchResultProps {
  book: EpubBook;
  chapter: Chapter;
  snippet: string;
  relevanceScore: number;
  searchQuery: string;
  onBuyBook: (book: EpubBook) => void;
  onSubscribe: () => void;
  onViewChapter: (book: EpubBook, chapter: Chapter) => void;
}

export function SearchResult({
  book,
  chapter,
  snippet,
  relevanceScore,
  searchQuery,
  onBuyBook,
  onSubscribe,
  onViewChapter,
}: SearchResultProps) {
  const { user, hasFullAccess } = useUser();
  const hasAccess = hasFullAccess(book.id);

  // Highlight matching terms in snippet
  const highlightSnippet = (text: string, query: string) => {
    const terms = query.toLowerCase().split(/\s+/);
    let result = text;
    
    terms.forEach(term => {
      if (term.length > 2) {
        const regex = new RegExp(`(${term})`, 'gi');
        result = result.replace(regex, '<mark class="search-result-highlight">$1</mark>');
      }
    });
    
    return result;
  };

  const getTagLabel = (tagId: string) => {
    const tag = medicalTags.find(t => t.id === tagId);
    return tag?.name || tagId;
  };

  return (
    <Card className="card-elevated overflow-hidden animate-slide-up group">
      <CardContent className="p-0">
        <div className="flex">
          {/* Book Cover Indicator */}
          <div 
            className="hidden sm:flex w-2 flex-shrink-0"
            style={{ backgroundColor: book.coverColor }}
          />
          
          <div className="flex-1 p-5">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Book className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm font-medium text-muted-foreground truncate">
                    {book.title}
                  </span>
                  {hasAccess && (
                    <span className="owned-badge flex-shrink-0">
                      <Check className="h-3 w-3 mr-1" />
                      {user.subscriptionType === 'subscriber' ? 'Subscribed' : 'Owned'}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2">
                  {chapter.title}
                </h3>
              </div>
              
              <Badge variant="secondary" className="flex-shrink-0 text-xs">
                Page {chapter.pageNumber}
              </Badge>
            </div>
            
            {/* Snippet */}
            <div className="mb-4">
              <p 
                className="text-sm text-muted-foreground line-clamp-3 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: highlightSnippet(snippet, searchQuery) }}
              />
            </div>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {chapter.tags.slice(0, 4).map(tagId => (
                <span key={tagId} className="medical-tag">
                  {getTagLabel(tagId)}
                </span>
              ))}
              {chapter.tags.length > 4 && (
                <span className="text-xs text-muted-foreground">
                  +{chapter.tags.length - 4} more
                </span>
              )}
            </div>
            
            {/* Actions */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-border/50">
              {hasAccess ? (
                <Button
                  onClick={() => onViewChapter(book, chapter)}
                  className="flex-1 sm:flex-none"
                >
                  <FileText className="h-4 w-4 mr-1.5" />
                  Read Full Chapter
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2 flex-1">
                  <Button
                    variant="cta"
                    onClick={() => onBuyBook(book)}
                    className="flex-1 sm:flex-none"
                  >
                    <Lock className="h-4 w-4 mr-1.5" />
                    Buy Book — ${book.price}
                  </Button>
                  <Button
                    variant="premium"
                    onClick={onSubscribe}
                    className="flex-1 sm:flex-none"
                  >
                    <Crown className="h-4 w-4 mr-1.5" />
                    Subscribe for All
                  </Button>
                </div>
              )}
              
              <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-medium">{book.specialty}</span>
                <span>•</span>
                <span>{book.publishedYear}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
