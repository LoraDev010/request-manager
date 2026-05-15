import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CreateRequestForm } from './components/CreateRequestForm'
import { RequestList } from './components/RequestList'
import './index.css'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="app">

        <header className="header">
          <div className="header-inner">
            <a
              className="header-logo"
              href="https://www.choucairtesting.com"
              target="_blank"
              rel="noreferrer"
            >
              <div className="logo-box">
                <span className="logo-name">
                  CHOUCAIR<span className="logo-registered">®</span>
                </span>
                <span className="logo-tagline">Digital Assets Reliability</span>
              </div>
            </a>

            <div className="header-divider" />
            <span className="header-title">Gestor de Solicitudes</span>
          </div>
        </header>

        <main className="main">

          <div className="page-header">
            <div>
              <h1 className="page-title">FLUJO DE <span>APROBACIÓN</span></h1>
              <p className="page-subtitle">Gestiona y aprueba solicitudes en tiempo real</p>
            </div>
            <span className="page-badge">Sistema Interno</span>
          </div>

          <aside className="sidebar">
            <CreateRequestForm />
          </aside>

          <section>
            <div className="section-header">
              <h2 className="section-title">Solicitudes</h2>
            </div>
            <RequestList />
          </section>

        </main>
      </div>
    </QueryClientProvider>
  )
}

export default App
