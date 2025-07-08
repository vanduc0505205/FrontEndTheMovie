import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import DefaultLayout from "@/layouts/DefaultLayout";
import OperatingModel from "./pages/OperatingModel";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Route dùng layout chung */}
          <Route element={<DefaultLayout />}>
            <Route index element={<Index />} />
            <Route path="/ve-chung-toi" element={<AboutUs />} />
            <Route path="/lien-he" element={<Contact />} />
            <Route path="/mo-hinh-van-hanh" element={<OperatingModel />} />
          </Route>

          {/* Route không dùng layout */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
