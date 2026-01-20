import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GovindProvider } from "@/contexts/GovindContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Gmail from "./pages/Gmail";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Docs from "./pages/Docs";
import { Outlook, Telegram, WhatsApp } from "./pages/Platforms";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <GovindProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/gmail" element={<Gmail />} />
            <Route path="/outlook" element={<Outlook />} />
            <Route path="/telegram" element={<Telegram />} />
            <Route path="/whatsapp" element={<WhatsApp />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </GovindProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
