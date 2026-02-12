import { Route, Switch } from "wouter"
import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"
import Briefing from "./pages/Briefing"

function App() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/briefing" component={Briefing} />
      <Route path="/briefing/new" component={Briefing} />
      <Route path="/briefing/:id" component={Briefing} />
      <Route>404 Not Found</Route>
    </Switch>
  )
}

export default App
