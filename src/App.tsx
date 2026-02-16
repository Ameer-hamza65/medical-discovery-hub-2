import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/context/UserContext";
import { BookProvider } from "@/context/BookContext";
import { EnterpriseProvider } from "@/context/EnterpriseContext";
import { Header } from "@/components/Header";
import Index from "./pages/Index";
import Library from "./pages/Library";
import Research from "./pages/Research";
import Reader from "./pages/Reader";
import Subscribe from "./pages/Subscribe";
import PurchaseHistory from "./pages/PurchaseHistory";
import AdminUpload from "./pages/AdminUpload";
import EnterpriseDashboard from "./pages/EnterpriseDashboard";
import ComplianceCollections from "./pages/ComplianceCollections";
import CollectionDetail from "./pages/CollectionDetail";
import AuditLogs from "./pages/AuditLogs";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BookProvider>
      <EnterpriseProvider>
        <UserProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div className="min-h-screen flex flex-col">
                <Header />
                <div className="flex-1">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/library" element={<Library />} />
                    <Route path="/research" element={<Research />} />
                    <Route path="/reader" element={<Reader />} />
                    <Route path="/subscribe" element={<Subscribe />} />
                    <Route path="/purchases" element={<PurchaseHistory />} />
                    <Route path="/admin/upload" element={<AdminUpload />} />
                    <Route path="/enterprise" element={<EnterpriseDashboard />} />
                    <Route path="/collections" element={<ComplianceCollections />} />
                    <Route path="/collections/:collectionId" element={<CollectionDetail />} />
                    <Route path="/audit-logs" element={<AuditLogs />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </div>
            </BrowserRouter>
          </TooltipProvider>
        </UserProvider>
      </EnterpriseProvider>
    </BookProvider>
  </QueryClientProvider>
);

export default App;
