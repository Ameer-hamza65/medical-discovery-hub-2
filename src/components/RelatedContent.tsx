import { Link2, Book, ChevronRight, Crown, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EpubBook, Chapter, getRelatedChapters } from '@/data/mockEpubData';
import { useUser } from '@/context/UserContext';
import { cn } from '@/lib/utils';

interface RelatedContentProps {
  currentChapterId: string;
  onViewChapter: (book: EpubBook, chapter: Chapter) => void;
  onBuyBook: (book: EpubBook) => void;
  onSubscribe: () => void;
  className?: string;
}

export function RelatedContent({
  currentChapterId,
  onViewChapter,
  onBuyBook,
  onSubscribe,
  className,
}: RelatedContentProps) {
  const { hasFullAccess, user } = useUser();
  const related = getRelatedChapters(currentChapterId, 5);

  if (related.length === 0) return null;

  // Separate owned and upsell content
  const ownedContent = related.filter(r => hasFullAccess(r.book.id));
  const upsellContent = related.filter(r => !hasFullAccess(r.book.id));

  return (
    <Card className={cn("card-elevated", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
            <Link2 className="h-4 w-4 text-accent" />
          </div>
          Related Content
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {/* Owned Related Content */}
        {ownedContent.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              In Your Library
            </p>
            {ownedContent.map(({ book, chapter }) => (
              <button
                key={chapter.id}
                onClick={() => onViewChapter(book, chapter)}
                className="w-full text-left p-3 rounded-lg bg-success/5 border border-success/20 hover:bg-success/10 transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <div 
                    className="w-1 h-12 rounded-full flex-shrink-0"
                    style={{ backgroundColor: book.coverColor }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-accent transition-colors">
                      {chapter.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {book.title}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Upsell Related Content */}
        {upsellContent.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
              <Crown className="h-3 w-3 text-warning" />
              Also Relevant
            </p>
            {upsellContent.slice(0, 3).map(({ book, chapter }) => (
              <div
                key={chapter.id}
                className="w-full p-3 rounded-lg bg-muted/50 border border-border/50"
              >
                <div className="flex items-start gap-3">
                  <div 
                    className="w-1 h-12 rounded-full flex-shrink-0 opacity-50"
                    style={{ backgroundColor: book.coverColor }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground line-clamp-2">
                      {chapter.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {book.title}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        onClick={() => onBuyBook(book)}
                      >
                        <Lock className="h-3 w-3 mr-1" />
                        ${book.price}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {user.subscriptionType !== 'subscriber' && (
              <Button
                variant="premium"
                size="sm"
                className="w-full mt-2"
                onClick={onSubscribe}
              >
                <Crown className="h-4 w-4 mr-1.5" />
                Unlock All with Subscription
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
