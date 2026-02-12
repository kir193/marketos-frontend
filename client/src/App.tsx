import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Briefing from "./pages/Briefing";
import NotFound from "./pages/NotFound";
import { system } from "./theme";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/briefing/new"} component={Briefing} />
      <Route path={"/briefing/:id"} component={Briefing} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ChakraProvider value={system}>
        <Router />
      </ChakraProvider>
    </ErrorBoundary>
  );
}

export default App;
