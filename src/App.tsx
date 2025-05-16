import { QueryProvider } from "./lib/query_provider";
import AppRouter from "./router/router";

function App() {
  return (
    <QueryProvider>
      <AppRouter />
    </QueryProvider>
  );
}

export default App;
