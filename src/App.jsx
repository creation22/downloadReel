import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { platforms } from "./data/platforms";
import { converters } from "./data/converters";
import { ScrollToTop } from "./components/ScrollToTop";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import Home from "./pages/Home";
import Platforms from "./pages/Platforms";
import Converters from "./pages/Converters";
import Tools from "./pages/Tools";
import PlatformPage from "./pages/PlatformPage";
import ConverterPage from "./pages/ConverterPage";

const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
import FAQPage from "./pages/FAQPage";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <div key={location.pathname} className="animate-page-in">
      <Suspense fallback={null}>
        <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/platforms" element={<Platforms />} />
        <Route path="/converters" element={<Converters />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        {platforms.map((platform) => (
          <Route
            key={platform.slug}
            path={platform.href}
            element={<PlatformPage platform={platform} />}
          />
        ))}
        {converters.map((converter) => (
          <Route
            key={converter.slug}
            path={converter.href}
            element={<ConverterPage converter={converter} />}
          />
        ))}
        <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="relative flex min-h-screen flex-col bg-canvas font-sans text-fg">
        {/* semicircular linear-gradient backdrop in brand #ed5526 */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-0 flex justify-center overflow-hidden"
        >
          <div className="h-[300px] w-[1200px] max-w-none shrink-0 rounded-b-[50%] bg-[linear-gradient(180deg,rgba(242,102,58,0.32)_0%,rgba(237,85,38,0.22)_38%,rgba(237,85,38,0.08)_62%,transparent_100%)] blur-[2px] sm:h-[380px]" />
        </div>
        <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <AnimatedRoutes />
        </main>
        <Footer />
        </div>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "var(--surface)",
              border: "1px solid var(--line)",
              color: "var(--fg)",
              borderRadius: "8px",
              fontFamily: "inherit",
              fontSize: "13px",
            },
          }}
        />
      </div>
    </BrowserRouter>
  );
}
