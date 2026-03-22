import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Diagnostic from "./pages/Diagnostic";
import DiagnosticResultPage from "./pages/DiagnosticResult";
import DiagnosticHistory from "./pages/DiagnosticHistory";
import TypeCatalog from "./pages/TypeCatalog";
import TypeDetail from "./pages/TypeDetail";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/diagnostic"} component={Diagnostic} />
      <Route path={"/result/:id"} component={DiagnosticResultPage} />
      <Route path={"/history"} component={DiagnosticHistory} />
      <Route path={"/types"} component={TypeCatalog} />
      <Route path={"/types/:code"} component={TypeDetail} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
