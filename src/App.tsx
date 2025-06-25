
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SessionManager } from "@/components/SessionManager";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ScanScreen from "./pages/ScanScreen";
import SearchScreen from "./pages/SearchScreen";
import ScanResult from "./pages/ScanResult";
import ScanHistory from "./pages/ScanHistory";
import FoodFacts from "./pages/FoodFacts";
import Recipes from "./pages/Recipes";
import RecipeDetail from "./pages/RecipeDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <SessionManager />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/scan" element={<ScanScreen />} />
            <Route path="/search" element={<SearchScreen />} />
            <Route path="/scan-result" element={<ScanResult />} />
            <Route path="/scan-history" element={<ScanHistory />} />
            <Route path="/food-facts" element={<FoodFacts />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/recipes/:id" element={<RecipeDetail />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
