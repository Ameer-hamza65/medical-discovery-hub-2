import React from 'react';
import { useEnterprise } from '@/context/EnterpriseContext';
import { useBooks } from '@/context/BookContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building2,
  Scissors,
  Syringe,
  ShieldCheck,
  Stethoscope,
  Heart,
  Wind,
  BookOpen,
  ArrowRight,
  Lock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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

export default function ComplianceCollections() {
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
              Compliance collections are available to enterprise users only.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={() => navigate('/')}>Return Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const bookAccess = getEnterpriseBookAccess(currentEnterprise.id);
  const accessibleBookIds = new Set(bookAccess.filter(ba => ba.accessLevel === 'full').map(ba => ba.bookId));

  const handleCollectionClick = (collection: ComplianceCollection) => {
    logAction('access_collection', 'collection', collection.id, collection.name);
    navigate(`/collections/${collection.id}`);
  };

  const getCollectionAccessStatus = (collection: ComplianceCollection) => {
    const accessibleCount = collection.bookIds.filter(id => accessibleBookIds.has(id)).length;
    return {
      accessible: accessibleCount,
      total: collection.bookIds.length,
      hasFullAccess: accessibleCount === collection.bookIds.length
    };
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Compliance Collections</h1>
              <p className="text-primary-foreground/80">
                Curated clinical content bundles for {currentEnterprise.name}
              </p>
            </div>
            <Button variant="secondary" onClick={() => navigate('/enterprise')}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Info Banner */}
        <Card className="mb-8 border-accent/30 bg-accent/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <ShieldCheck className="h-8 w-8 text-accent flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Compliance-Focused Content Bundles</h3>
                <p className="text-sm text-muted-foreground">
                  These curated collections are designed to support regulatory compliance, risk reduction, 
                  and standardized clinical practice. Each bundle contains protocols and guidelines relevant 
                  to specific clinical areas and compliance requirements.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Collections Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => {
            const IconComponent = iconMap[collection.icon] || BookOpen;
            const accessStatus = getCollectionAccessStatus(collection);
            const collectionBooks = collection.bookIds
              .map(id => books.find(b => b.id === id))
              .filter(Boolean);

            return (
              <Card 
                key={collection.id} 
                className="group hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleCollectionClick(collection)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="p-3 rounded-lg bg-accent/10">
                      <IconComponent className="h-6 w-6 text-accent" />
                    </div>
                    <Badge className={categoryColors[collection.category]}>
                      {collection.category.replace('_', ' ')}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg mt-4">{collection.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {collection.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Book List */}
                    <div className="space-y-2">
                      {collectionBooks.slice(0, 3).map((book) => {
                        const hasAccess = accessibleBookIds.has(book!.id);
                        return (
                          <div 
                            key={book!.id} 
                            className="flex items-center gap-2 text-sm"
                          >
                            {hasAccess ? (
                              <BookOpen className="h-4 w-4 text-success" />
                            ) : (
                              <Lock className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className={hasAccess ? '' : 'text-muted-foreground'}>
                              {book!.title}
                            </span>
                          </div>
                        );
                      })}
                      {collectionBooks.length > 3 && (
                        <p className="text-xs text-muted-foreground pl-6">
                          +{collectionBooks.length - 3} more titles
                        </p>
                      )}
                    </div>

                    {/* Access Status */}
                    <div className="pt-4 border-t flex items-center justify-between">
                      <div className="text-sm">
                        <span className="font-medium text-success">{accessStatus.accessible}</span>
                        <span className="text-muted-foreground">/{accessStatus.total} titles accessible</span>
                      </div>
                      <Button variant="ghost" size="sm" className="gap-1 group-hover:translate-x-1 transition-transform">
                        View <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Request Access CTA */}
        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold">Need access to additional collections?</h3>
                <p className="text-sm text-muted-foreground">
                  Contact your institution's administrator to expand your content license.
                </p>
              </div>
              <Button variant="outline">
                Request Additional Access
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
