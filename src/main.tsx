import ReactDOM from 'react-dom/client'
import App from './App'
import { QueryClient, QueryClientProvider } from 'react-query'

const query = new QueryClient()

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
    <QueryClientProvider client={query}><App /></QueryClientProvider>
)