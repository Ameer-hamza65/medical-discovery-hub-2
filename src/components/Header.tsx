import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Book, Search, User, LogOut, Crown, ShoppingCart, Settings, Building2, Shield, FileText, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/context/UserContext';
import { useEnterprise } from '@/context/EnterpriseContext';
import { LoginModal } from './LoginModal';
import { EnterpriseLoginModal } from './EnterpriseLoginModal';

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const { 
    currentEnterprise, 
    currentUser, 
    isEnterpriseMode, 
    logoutEnterprise,
    isAdmin,
    isComplianceOfficer
  } = useEnterprise();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showEnterpriseLoginModal, setShowEnterpriseLoginModal] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleEnterpriseLogout = () => {
    logoutEnterprise();
    navigate('/');
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg medical-gradient shadow-md group-hover:shadow-lg transition-shadow">
                <Book className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">
                MedLib<span className="text-accent">Pro</span>
              </span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-1">
              <Link to="/">
                <Button 
                  variant={isActive('/') ? 'secondary' : 'ghost'} 
                  size="sm"
                  className="font-medium"
                >
                  <Search className="h-4 w-4 mr-1.5" />
                  Search
                </Button>
              </Link>
              <Link to="/library">
                <Button 
                  variant={isActive('/library') ? 'secondary' : 'ghost'} 
                  size="sm"
                  className="font-medium"
                >
                  <Book className="h-4 w-4 mr-1.5" />
                  Library
                </Button>
              </Link>
              {(user.isLoggedIn && (user.subscriptionType === 'subscriber' || user.ownedBooks.length > 0)) && (
                <Link to="/research">
                  <Button 
                    variant={isActive('/research') ? 'secondary' : 'ghost'} 
                    size="sm"
                    className="font-medium"
                  >
                    <Crown className="h-4 w-4 mr-1.5" />
                    My Research
                  </Button>
                </Link>
              )}
              
              {/* Enterprise Navigation */}
              {isEnterpriseMode && (
                <>
                  <Link to="/enterprise">
                    <Button 
                      variant={isActive('/enterprise') ? 'secondary' : 'ghost'} 
                      size="sm"
                      className="font-medium"
                    >
                      <Building2 className="h-4 w-4 mr-1.5" />
                      Dashboard
                    </Button>
                  </Link>
                  <Link to="/collections">
                    <Button 
                      variant={isActive('/collections') ? 'secondary' : 'ghost'} 
                      size="sm"
                      className="font-medium"
                    >
                      <FolderOpen className="h-4 w-4 mr-1.5" />
                      Collections
                    </Button>
                  </Link>
                  {(isAdmin() || isComplianceOfficer()) && (
                    <Link to="/audit-logs">
                      <Button 
                        variant={isActive('/audit-logs') ? 'secondary' : 'ghost'} 
                        size="sm"
                        className="font-medium"
                      >
                        <FileText className="h-4 w-4 mr-1.5" />
                        Audit Logs
                      </Button>
                    </Link>
                  )}
                </>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {/* Enterprise Login Button (always visible for demo) */}
            {!isEnterpriseMode && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowEnterpriseLoginModal(true)}
                className="gap-2 border-accent/30 text-accent hover:bg-accent/10"
              >
                <Building2 className="h-4 w-4" />
                <span className="hidden sm:inline">Enterprise Demo</span>
              </Button>
            )}

            {/* Enterprise User Menu */}
            {isEnterpriseMode && currentUser && currentEnterprise && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <div 
                      className="flex h-7 w-7 items-center justify-center rounded-full text-white text-xs font-bold"
                      style={{ backgroundColor: currentEnterprise.logoColor }}
                    >
                      {currentEnterprise.name.charAt(0)}
                    </div>
                    <span className="hidden sm:inline font-medium">{currentUser.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {currentUser.role.replace('_', ' ')}
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-accent" />
                      <span>{currentEnterprise.name}</span>
                    </div>
                  </DropdownMenuLabel>
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{currentUser.name}</p>
                    <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/enterprise" className="cursor-pointer">
                      <Shield className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/collections" className="cursor-pointer">
                      <FolderOpen className="mr-2 h-4 w-4" />
                      Compliance Collections
                    </Link>
                  </DropdownMenuItem>
                  {(isAdmin() || isComplianceOfficer()) && (
                    <DropdownMenuItem asChild>
                      <Link to="/audit-logs" className="cursor-pointer">
                        <FileText className="mr-2 h-4 w-4" />
                        Audit Logs
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleEnterpriseLogout} className="cursor-pointer text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Exit Enterprise Mode
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Individual User Auth */}
            {!isEnterpriseMode && (
              <>
                {!user.isLoggedIn ? (
                  <>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setShowLoginModal(true)}
                    >
                      Sign In
                    </Button>
                    <Link to="/subscribe">
                      <Button variant="cta" size="sm">
                        Subscribe
                      </Button>
                    </Link>
                  </>
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/10 text-accent">
                          <User className="h-4 w-4" />
                        </div>
                        <span className="hidden sm:inline font-medium">{user.name}</span>
                        {user.subscriptionType === 'subscriber' && (
                          <Crown className="h-4 w-4 text-warning" />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="px-2 py-1.5">
                        <p className="text-sm font-medium">{user.email}</p>
                        <p className="text-xs text-muted-foreground">
                          {user.subscriptionType === 'subscriber' 
                            ? 'Premium Subscriber' 
                            : user.ownedBooks.length > 0 
                              ? `${user.ownedBooks.length} books owned`
                              : 'Free account'}
                        </p>
                      </div>
                      <DropdownMenuSeparator />
                      {user.subscriptionType !== 'subscriber' && (
                        <DropdownMenuItem asChild>
                          <Link to="/subscribe" className="cursor-pointer">
                            <Crown className="mr-2 h-4 w-4 text-warning" />
                            Upgrade to Premium
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem asChild>
                        <Link to="/research" className="cursor-pointer">
                          <Book className="mr-2 h-4 w-4" />
                          My Library
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/purchases" className="cursor-pointer">
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Purchase History
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/admin/upload" className="cursor-pointer">
                          <Settings className="mr-2 h-4 w-4" />
                          Admin: Upload Books
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
      <EnterpriseLoginModal 
        open={showEnterpriseLoginModal} 
        onClose={() => setShowEnterpriseLoginModal(false)}
        onLoginSuccess={() => navigate('/enterprise')}
      />
    </>
  );
}
