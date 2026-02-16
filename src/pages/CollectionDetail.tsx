import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEnterprise } from '@/context/EnterpriseContext';
import { useBooks } from '@/context/BookContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building2,
  ArrowLeft,
  BookOpen,
  Lock,
  ShieldCheck,
  Users,
  Eye,
  Search,
  Scissors,
  Syringe,
  Stethoscope,
  Heart,
  Wind
} from 'lucide-react';
import { ComplianceCollection } from '@/data/mockEnterpriseData';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Scissors: Scissors,
  Syringe: Syringe,
  ShieldCheck: ShieldCheck,
  Stethoscope: Stethoscope,
  Heart: Heart,
  Wind: Wind
};

const categoryColors: Record<ComplianceCollection['category'], string> = {
  perioperative: 'bg-accent/10 text-accent border-accent/20',
  anesthesia: 'bg-primary/10 text-primary border-primary/20',
  patient_safety: 'bg-success/10 text-success border-success/20',
  surgical: 'bg-destructive/10 text-destructive border-destructive/20',
  general: 'bg-muted text-muted-foreground border-border'
};

export default function CollectionDetail() {
  const { collectionId } = useParams<{ collectionId: string }>();
  const navigate = useNavigate();
  const { 
    currentEnterprise, 
    isEnterpriseMode,
    collections,
    getEnterpriseBookAccess,
    logAction
  } = useEnterprise();
  const { books } = useBooks();

  if (!isEnterpriseMode || !currentEnterprise) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <CardTitle>Enterprise Access Required</CardTitle>
            <CardDescription>
              Please log in with an enterprise account to view collections.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={() => navigate('/')}>Return Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const collection = collections.find(c => c.id === collectionId);
  
  if (!collection) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <CardTitle>Collection Not Found</CardTitle>
            <CardDescription>
              The requested collection does not exist.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={() => navigate('/collections')}>Back to Collections</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const bookAccess = getEnterpriseBookAccess(currentEnterprise.id);
  const accessibleBookIds = new Set(bookAccess.filter(ba => ba.accessLevel === 'full').map(ba => ba.bookId));

  const collectionBooks = collection.bookIds
    .map(id => books.find(b => b.id === id))
    .filter(Boolean);

  const IconComponent = iconMap[collection.icon] || BookOpen;

  const handleBookClick = (bookId: string, bookTitle: string, hasAccess: boolean) => {
    if (hasAccess) {
      logAction('view_book', 'book', bookId, bookTitle);
      navigate(`/library?book=${bookId}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-8">
          <Button 
            variant="ghost" 
            className="text-primary-foreground/80 hover:text-primary-foreground mb-4"
            onClick={() => navigate('/collections')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Collections
          </Button>
          
          <div className="flex items-start gap-4">
            <div className="p-4 rounded-xl bg-white/10">
              <IconComponent className="h-8 w-8" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">{collection.name}</h1>
                <Badge className={categoryColors[collection.category]}>
                  {collection.category.replace('_', ' ')}
                </Badge>
              </div>
              <p className="text-primary-foreground/80 max-w-2xl">
                {collection.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <BookOpen className="h-8 w-8 text-accent" />
                <div>
                  <p className="text-2xl font-bold">{collectionBooks.length}</p>
                  <p className="text-sm text-muted-foreground">Total Titles</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-8 w-8 text-success" />
                <div>
                  <p className="text-2xl font-bold">
                    {collectionBooks.filter(b => accessibleBookIds.has(b!.id)).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Accessible</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{currentEnterprise.usedSeats}</p>
                  <p className="text-sm text-muted-foreground">Users with Access</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Books List */}
        <Card>
          <CardHeader>
            <CardTitle>Books in this Collection</CardTitle>
            <CardDescription>
              Click on a book to view its contents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {collectionBooks.map((book) => {
                if (!book) return null;
                const hasAccess = accessibleBookIds.has(book.id);
                
                return (
                  <div 
                    key={book.id}
                    className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
                      hasAccess 
                        ? 'hover:bg-accent/5 cursor-pointer border-border' 
                        : 'bg-muted/30 border-border/50'
                    }`}
                    onClick={() => handleBookClick(book.id, book.title, hasAccess)}
                  >
                    {/* Book Cover */}
                    <div 
                      className="w-16 h-20 rounded-md flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0"
                      style={{ backgroundColor: book.coverColor }}
                    >
                      {book.title.charAt(0)}
                    </div>
                    
                    {/* Book Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-semibold truncate ${!hasAccess ? 'text-muted-foreground' : ''}`}>
                          {book.title}
                        </h3>
                        {!hasAccess && <Lock className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {book.authors.join(', ')}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {book.accessCount.toLocaleString()} views
                        </span>
                        <span className="flex items-center gap-1">
                          <Search className="h-3 w-3" />
                          {book.searchCount.toLocaleString()} searches
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {book.tableOfContents.length} chapters
                        </Badge>
                      </div>
                    </div>

                    {/* Access Status */}
                    <div className="flex-shrink-0">
                      {hasAccess ? (
                        <Badge className="bg-success/10 text-success border-success/20">
                          Full Access
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          No Access
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* CTA for Locked Books */}
        {collectionBooks.some(b => b && !accessibleBookIds.has(b.id)) && (
          <Card className="mt-6 border-warning/30 bg-warning/5">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Lock className="h-6 w-6 text-warning" />
                  <div>
                    <h3 className="font-semibold">Some titles are locked</h3>
                    <p className="text-sm text-muted-foreground">
                      Contact your administrator to request access to additional books in this collection.
                    </p>
                  </div>
                </div>
                <Button variant="outline">
                  Request Access
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
