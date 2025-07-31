import { ToastProvider } from './components/ui/toast';
import { QueryProvider } from './lib/query_provider';
import AppRouter from './router/router';
function App() {
  return (
    <QueryProvider>
      <ToastProvider>
        <AppRouter />
      </ToastProvider>
    </QueryProvider>
  );
}

export default App;
