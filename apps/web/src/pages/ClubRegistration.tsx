import React, { useState } from 'react';
import { api } from '../services/api';

interface ClubRegistrationProps {
  onRegistrationSuccess: (club: any) => void;
  onLogout: () => void;
}

export default function ClubRegistration({ onRegistrationSuccess, onLogout }: ClubRegistrationProps) {
  const [name, setName] = useState('');
  const [association, setAssociation] = useState('');
  const [localChurch, setLocalChurch] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [foundingDate, setFoundingDate] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successClub, setSuccessClub] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !association || !localChurch || !city || !state || !foundingDate) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (state.trim().length !== 2) {
      setError('O estado deve ser informado como UF (ex: SP, RJ).');
      return;
    }

    const selectedDate = new Date(foundingDate);
    if (selectedDate > new Date()) {
      setError('A data de fundação não pode ser posterior à data atual.');
      return;
    }

    setLoading(true);
    try {
      const club = await api.registerClub({
        name,
        association,
        localChurch,
        city,
        state: state.toUpperCase(),
        foundingDate: new Date(foundingDate).toISOString(),
      });
      setSuccessClub(club);
    } catch (err: any) {
      setError(err.message || 'Falha ao cadastrar o clube. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // If successfully registered, show the premium success confirmation card
  if (successClub) {
    return (
      <div className="full-screen-center">
        <div className="glass-card fade-in" style={{ width: '100%', maxWidth: '550px', textAlign: 'center' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'var(--success-glow)',
            border: '2px solid var(--success)',
            color: 'var(--success)',
            fontSize: '2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto'
          }}>
            ✓
          </div>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem', color: '#fff' }}>Clube Cadastrado!</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            O clube <strong>{successClub.name}</strong> foi registrado com sucesso no sistema.
          </p>

          <div style={{
            background: 'rgba(31, 41, 55, 0.4)',
            border: '1px solid var(--border-glass)',
            borderRadius: 'var(--radius-md)',
            padding: '1.5rem',
            marginBottom: '2rem'
          }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
              CÓDIGO DE IDENTIFICAÇÃO ÚNICO
            </span>
            <span style={{
              fontSize: '2rem',
              fontWeight: 800,
              fontFamily: 'Outfit, sans-serif',
              letterSpacing: '0.1em',
              color: 'var(--accent-secondary)',
              textShadow: '0 0 10px rgba(14, 165, 233, 0.3)'
            }} id="club-unique-code">
              {successClub.uniqueCode}
            </span>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onRegistrationSuccess(successClub)}
          >
            Acessar Painel do Clube
          </button>
        </div>
      </div>
    );
  }

  const currentUser = api.getCurrentUser();

  return (
    <div className="container" style={{ maxWidth: '700px', padding: '4rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <span style={{ fontSize: '0.875rem', color: 'var(--accent-secondary)', fontWeight: 600 }}>SGC-SDD</span>
          <h1 style={{ fontSize: '2rem', color: '#fff' }}>Cadastrar Clube</h1>
        </div>
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

      <div className="glass-card fade-in">
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Olá, <strong>{currentUser?.name || 'Administrador'}</strong>! Para começar a usar o sistema, informe os dados oficiais do seu Clube de Desbravadores abaixo.
        </p>

        {error && (
          <div className="alert alert-error" id="club-reg-error-alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="clubName">Nome do Clube de Desbravadores</label>
            <input
              type="text"
              id="clubName"
              className="form-input"
              placeholder="Ex: Pioneiros das Colinas"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="association">Associação / Missão</label>
            <input
              type="text"
              id="association"
              className="form-input"
              placeholder="Ex: Associação Paulista Leste (APL)"
              value={association}
              onChange={(e) => setAssociation(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="localChurch">Igreja Local Vinculada</label>
            <input
              type="text"
              id="localChurch"
              className="form-input"
              placeholder="Ex: IASD Central de Guarulhos"
              value={localChurch}
              onChange={(e) => setLocalChurch(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="city">Cidade</label>
              <input
                type="text"
                id="city"
                className="form-input"
                placeholder="Ex: Guarulhos"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="state">Estado (UF)</label>
              <input
                type="text"
                id="state"
                className="form-input"
                placeholder="Ex: SP"
                maxLength={2}
                value={state}
                onChange={(e) => setState(e.target.value)}
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '2.5rem' }}>
            <label className="form-label" htmlFor="foundingDate">Data de Fundação</label>
            <input
              type="date"
              id="foundingDate"
              className="form-input"
              value={foundingDate}
              onChange={(e) => setFoundingDate(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Cadastrando Clube...' : 'Salvar e Concluir Cadastro'}
          </button>
        </form>
      </div>
    </div>
  );
}
