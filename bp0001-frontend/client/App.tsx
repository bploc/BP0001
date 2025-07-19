import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Reports from "./pages/Reports";
import AddEntry from "./pages/AddEntry";
import Customers from "./pages/Customers";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";
import PlasmicCanvasHost from "./PlasmicCanvasHost";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/add-entry" element={<AddEntry />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/help" element={<Help />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/plasmic-host" element={<PlasmicCanvasHost />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
