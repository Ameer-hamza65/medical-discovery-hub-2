import React from 'react';
import { useEnterprise } from '@/context/EnterpriseContext';
import { useBooks } from '@/context/BookContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  Users, 
  BookOpen, 
  Shield, 
  TrendingUp, 
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
  FileText,
  Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const CHART_COLORS = ['hsl(166 76% 32%)', 'hsl(213 50% 35%)', 'hsl(38 92% 50%)', 'hsl(280 50% 40%)', 'hsl(0 65% 35%)'];

export default function EnterpriseDashboard() {
  const navigate = useNavigate();
  const { 
    currentEnterprise, 
    currentUser, 
    isEnterpriseMode,
    usageStats, 
    complianceStatus,
    getEnterpriseUsers,
    getEnterpriseDepartments,
    getEnterpriseBookAccess,
    isAdmin,
    isComplianceOfficer
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
              Please log in with an enterprise account to access the dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={() => navigate('/')}>Return Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const enterpriseUsers = getEnterpriseUsers(currentEnterprise.id);
  const enterpriseDepartments = getEnterpriseDepartments(currentEnterprise.id);
  const enterpriseBookAccess = getEnterpriseBookAccess(currentEnterprise.id);
  const accessibleBooks = books.filter(b => enterpriseBookAccess.some(ba => ba.bookId === b.id));

  const complianceStatusColors = {
    compliant: 'bg-success/10 text-success border-success/20',
    attention: 'bg-warning/10 text-warning border-warning/30',
    critical: 'bg-destructive/10 text-destructive border-destructive/20'
  };

  const complianceIcons = {
    compliant: CheckCircle,
    attention: AlertTriangle,
    critical: XCircle
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div 
                  className="h-12 w-12 rounded-lg flex items-center justify-center text-white font-bold text-xl"
                  style={{ backgroundColor: currentEnterprise.logoColor }}
                >
                  {currentEnterprise.name.charAt(0)}
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{currentEnterprise.name}</h1>
                  <p className="text-primary-foreground/80 text-sm">
                    {currentEnterprise.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} • {currentEnterprise.domain}
                  </p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-primary-foreground/80">Logged in as</p>
              <p className="font-medium">{currentUser?.name}</p>
              <Badge variant="secondary" className="mt-1">
                {currentUser?.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                  <p className="text-3xl font-bold">{currentEnterprise.usedSeats}</p>
                  <p className="text-xs text-muted-foreground">of {currentEnterprise.licenseSeats} seats</p>
                </div>
                <Users className="h-10 w-10 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Available Titles</p>
                  <p className="text-3xl font-bold">{accessibleBooks.length}</p>
                  <p className="text-xs text-muted-foreground">in your license</p>
                </div>
                <BookOpen className="h-10 w-10 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Views (30d)</p>
                  <p className="text-3xl font-bold">{usageStats.totalViews.toLocaleString()}</p>
                  <p className="text-xs text-success">+12% from last month</p>
                </div>
                <TrendingUp className="h-10 w-10 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Compliance Score</p>
                  <p className="text-3xl font-bold">87%</p>
                  <p className="text-xs text-warning">1 area needs attention</p>
                </div>
                <Shield className="h-10 w-10 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview" className="gap-2">
              <Activity className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="compliance" className="gap-2">
              <Shield className="h-4 w-4" />
              Compliance
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            {(isAdmin() || isComplianceOfficer()) && (
              <TabsTrigger value="reports" className="gap-2">
                <FileText className="h-4 w-4" />
                Reports
              </TabsTrigger>
            )}
            {isAdmin() && (
              <TabsTrigger value="settings" className="gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            )}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Daily Activity Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Daily Activity</CardTitle>
                  <CardDescription>Views and searches over the past 7 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={usageStats.dailyActivity}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { weekday: 'short' })}
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                        />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }} 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="views" 
                          stroke="hsl(166 76% 32%)" 
                          strokeWidth={2}
                          dot={{ fill: 'hsl(166 76% 32%)' }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="searches" 
                          stroke="hsl(213 50% 35%)" 
                          strokeWidth={2}
                          dot={{ fill: 'hsl(213 50% 35%)' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Usage by Department */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Usage by Department</CardTitle>
                  <CardDescription>Content views distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={usageStats.viewsByDepartment} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis 
                          type="category" 
                          dataKey="departmentName" 
                          stroke="hsl(var(--muted-foreground))" 
                          fontSize={12}
                          width={120}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }} 
                        />
                        <Bar dataKey="views" fill="hsl(166 76% 32%)" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Content */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Most Accessed Titles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {usageStats.topBooks.map((book, index) => (
                      <div key={book.bookId} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-muted-foreground w-6">{index + 1}.</span>
                          <span className="text-sm font-medium truncate max-w-[250px]">{book.title}</span>
                        </div>
                        <Badge variant="secondary">{book.views.toLocaleString()} views</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Top Searches</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {usageStats.topSearches.map((search, index) => (
                      <div key={search.query} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-muted-foreground w-6">{index + 1}.</span>
                          <span className="text-sm font-medium">{search.query}</span>
                        </div>
                        <Badge variant="secondary">{search.count} searches</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Compliance Status Cards */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="font-semibold text-lg">Compliance Areas</h3>
                {complianceStatus.map((status) => {
                  const StatusIcon = complianceIcons[status.status];
                  return (
                    <Card key={status.category}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <StatusIcon className={`h-6 w-6 ${
                              status.status === 'compliant' ? 'text-success' :
                              status.status === 'attention' ? 'text-warning' : 'text-destructive'
                            }`} />
                            <div>
                              <p className="font-medium">{status.category}</p>
                              <p className="text-sm text-muted-foreground">
                                Next review: {new Date(status.nextReviewDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={complianceStatusColors[status.status]}>
                              {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
                            </Badge>
                            <p className="text-2xl font-bold mt-1">{status.completionRate}%</p>
                          </div>
                        </div>
                        <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              status.status === 'compliant' ? 'bg-success' :
                              status.status === 'attention' ? 'bg-warning' : 'bg-destructive'
                            }`}
                            style={{ width: `${status.completionRate}%` }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Compliance Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Compliant', value: complianceStatus.filter(s => s.status === 'compliant').length },
                            { name: 'Attention', value: complianceStatus.filter(s => s.status === 'attention').length },
                            { name: 'Critical', value: complianceStatus.filter(s => s.status === 'critical').length }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={60}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          <Cell fill="hsl(152 69% 31%)" />
                          <Cell fill="hsl(38 92% 50%)" />
                          <Cell fill="hsl(0 84% 60%)" />
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2 mt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-success" />
                        Compliant
                      </span>
                      <span className="font-medium">{complianceStatus.filter(s => s.status === 'compliant').length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-warning" />
                        Attention
                      </span>
                      <span className="font-medium">{complianceStatus.filter(s => s.status === 'attention').length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-destructive" />
                        Critical
                      </span>
                      <span className="font-medium">{complianceStatus.filter(s => s.status === 'critical').length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Analytics</CardTitle>
                <CardDescription>
                  Coming soon: Advanced analytics with custom date ranges, user segmentation, and export capabilities.
                </CardDescription>
              </CardHeader>
              <CardContent className="py-12 text-center">
                <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Advanced analytics features are under development.</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          {(isAdmin() || isComplianceOfficer()) && (
            <TabsContent value="reports">
              <Card>
                <CardHeader>
                  <CardTitle>Audit Reports</CardTitle>
                  <CardDescription>
                    Generate compliance and usage reports for regulatory requirements.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                      <FileText className="h-6 w-6" />
                      <span>Usage Report</span>
                      <span className="text-xs text-muted-foreground">Export content access logs</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                      <Shield className="h-6 w-6" />
                      <span>Compliance Report</span>
                      <span className="text-xs text-muted-foreground">Training completion status</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                      <Users className="h-6 w-6" />
                      <span>User Activity</span>
                      <span className="text-xs text-muted-foreground">Individual user metrics</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Settings Tab */}
          {isAdmin() && (
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Enterprise Settings</CardTitle>
                  <CardDescription>
                    Manage your organization's configuration and preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent className="py-12 text-center">
                  <Settings className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Settings panel is under development.</p>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
