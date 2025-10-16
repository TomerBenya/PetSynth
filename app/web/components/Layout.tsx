// Main layout component
import React from 'react';
import { getUsername, isLoggedIn, logout } from '../lib/auth';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [username, setUsername] = React.useState<string | null>(null);
  const [loggedIn, setLoggedIn] = React.useState(false);

  React.useEffect(() => {
    setLoggedIn(isLoggedIn());
    setUsername(getUsername());
  }, []);

  const handleLogout = () => {
    logout();
    setLoggedIn(false);
    setUsername(null);
    window.location.href = '/login';
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header
        style={{
          backgroundColor: '#2563eb',
          color: 'white',
          padding: '1rem 2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <a
              href="/"
              style={{
                color: 'white',
                textDecoration: 'none',
                fontSize: '1.5rem',
                fontWeight: 'bold',
              }}
            >
              PetSynth
            </a>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <a
                href="/catalog"
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '1rem',
                  opacity: 0.9,
                  transition: 'opacity 0.2s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.opacity = '1')}
                onMouseOut={(e) => (e.currentTarget.style.opacity = '0.9')}
              >
                Catalog
              </a>
              {loggedIn && (
                <>
                  <a
                    href="/generate"
                    style={{
                      color: 'white',
                      textDecoration: 'none',
                      fontSize: '1rem',
                      opacity: 0.9,
                      transition: 'opacity 0.2s',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.opacity = '1')}
                    onMouseOut={(e) => (e.currentTarget.style.opacity = '0.9')}
                  >
                    Generate
                  </a>
                  <a
                    href="/store"
                    style={{
                      color: 'white',
                      textDecoration: 'none',
                      fontSize: '1rem',
                      opacity: 0.9,
                      transition: 'opacity 0.2s',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.opacity = '1')}
                    onMouseOut={(e) => (e.currentTarget.style.opacity = '0.9')}
                  >
                    My Store
                  </a>
                </>
              )}
            </div>
          </div>
          <div>
            {loggedIn ? (
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span style={{ opacity: 0.9 }}>Hello, {username || 'User'}</span>
                <button
                  onClick={handleLogout}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)')
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)')
                  }
                >
                  Logout
                </button>
              </div>
            ) : (
              <a
                href="/login"
                style={{
                  backgroundColor: 'white',
                  color: '#2563eb',
                  textDecoration: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.25rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  display: 'inline-block',
                }}
              >
                Login
              </a>
            )}
          </div>
        </nav>
      </header>
      <main
        style={{
          flex: 1,
          padding: '2rem',
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        {children}
      </main>
      <footer
        style={{
          backgroundColor: '#f3f4f6',
          padding: '1.5rem 2rem',
          textAlign: 'center',
          color: '#6b7280',
          fontSize: '0.875rem',
        }}
      >
        <p>PetSynth 9000 - Chaos Biology Meets Luxury Pet Sommelier</p>
      </footer>
    </div>
  );
}
