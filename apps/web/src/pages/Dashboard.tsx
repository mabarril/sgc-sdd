import { api } from '../services/api';

interface DashboardProps {
  club: {
    name: string;
    uniqueCode: string;
    association: string;
    localChurch: string;
    city: string;
    state: string;
    foundingDate: string;
  };
  onLogout: () => void;
}

export default function Dashboard({ club, onLogout }: DashboardProps) {
  const currentUser = api.getCurrentUser();

  const formattedDate = new Date(club.foundingDate).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <div className="container" style={{ maxWidth: '1000px', padding: '3rem 1.5rem' }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid var(--border-glass)',
        paddingBottom: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div>
          <span style={{ fontSize: '0.875rem', color: 'var(--accent-secondary)', fontWeight: 600 }}>PAINEL ADMINISTRATIVO</span>
          <h1 style={{ fontSize: '2.5rem', color: '#fff', marginTop: '0.25rem' }}>{club.name}</h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid var(--accent-primary)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.5rem 1rem',
            fontSize: '0.875rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '0.05em'
          }}>
            {club.uniqueCode}
          </span>
          <button
            type="button"
            onClick={onLogout}
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid var(--error)',
              color: '#fca5a5',
              borderRadius: 'var(--radius-sm)',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 600,
              transition: 'all var(--transition-fast)'
            }}
          >
            Sair
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        
        {/* Left Column - Club Info */}
        <div className="glass-card" style={{ height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: '#fff', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem' }}>
            Dados do Clube
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', textTransform: 'uppercase' }}>Associação</span>
              <span style={{ fontSize: '1rem', fontWeight: 500 }}>{club.association}</span>
            </div>
            
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', textTransform: 'uppercase' }}>Igreja local</span>
              <span style={{ fontSize: '1rem', fontWeight: 500 }}>{club.localChurch}</span>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', textTransform: 'uppercase' }}>Cidade / Estado</span>
              <span style={{ fontSize: '1rem', fontWeight: 500 }}>{club.city} - {club.state}</span>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', textTransform: 'uppercase' }}>Data de Fundação</span>
              <span style={{ fontSize: '1rem', fontWeight: 500 }}>{formattedDate}</span>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', textTransform: 'uppercase' }}>Diretor do Clube</span>
              <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--accent-secondary)' }}>{currentUser?.name || 'Administrador'}</span>
            </div>
          </div>
        </div>

        {/* Right Column - Subsystems (Upcoming Features) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card">
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#fff' }}>Boas-vindas ao SGC-SDD!</h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Seu clube está configurado e pronto. Abaixo estão as funcionalidades centrais que estarão disponíveis no próximo lançamento do sistema.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {/* Cards for future scope */}
            <div className="glass-card" style={{ opacity: 0.65, cursor: 'not-allowed' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>👥</div>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem', color: '#fff' }}>Desbravadores</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Gestão de membros, fichas médicas e contatos dos pais.</p>
              <span style={{ display: 'inline-block', marginTop: '1rem', fontSize: '0.75rem', color: 'var(--accent-secondary)', fontWeight: 700 }}>EM BREVE</span>
            </div>

            <div className="glass-card" style={{ opacity: 0.65, cursor: 'not-allowed' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🛡️</div>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem', color: '#fff' }}>Unidades</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Criação de unidades, controle de pontuação e ranking.</p>
              <span style={{ display: 'inline-block', marginTop: '1rem', fontSize: '0.75rem', color: 'var(--accent-secondary)', fontWeight: 700 }}>EM BREVE</span>
            </div>

            <div className="glass-card" style={{ opacity: 0.65, cursor: 'not-allowed' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🏅</div>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem', color: '#fff' }}>Especialidades</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Acompanhamento de classes regulares, avançadas e especialidades.</p>
              <span style={{ display: 'inline-block', marginTop: '1rem', fontSize: '0.75rem', color: 'var(--accent-secondary)', fontWeight: 700 }}>EM BREVE</span>
            </div>

            <div className="glass-card" style={{ opacity: 0.65, cursor: 'not-allowed' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📅</div>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem', color: '#fff' }}>Eventos</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Planejamento de acampamentos, saídas e calendário anual.</p>
              <span style={{ display: 'inline-block', marginTop: '1rem', fontSize: '0.75rem', color: 'var(--accent-secondary)', fontWeight: 700 }}>EM BREVE</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
