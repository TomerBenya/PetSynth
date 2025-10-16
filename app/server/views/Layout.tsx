import { css, Style } from 'hono/css';

// Define global styles
const globalStyles = css`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #f9fafb;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;
  }

  .header {
    background: #2563eb;
    color: white;
    padding: 1rem 0;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .nav-links {
    display: flex;
    gap: 1.5rem;
    align-items: center;
  }

  .nav a {
    color: white;
    text-decoration: none;
    opacity: 0.9;
  }

  .nav a:hover {
    opacity: 1;
  }

  .nav-brand {
    font-size: 1.5rem;
    font-weight: bold;
  }

  .btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .btn-primary {
    background: #2563eb;
    color: white;
  }

  .btn-primary:hover {
    background: #1d4ed8;
  }

  .btn-danger {
    background: #dc2626;
    color: white;
  }

  .btn-danger:hover {
    background: #b91c1c;
  }

  .card {
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    padding: 1.5rem;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  .pet-card {
    background: white;
    border-radius: 0.5rem;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    transition: transform 0.2s;
  }

  .pet-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }

  .pet-image {
    width: 100%;
    padding-top: 75%;
    position: relative;
    background: #f3f4f6;
  }

  .pet-image img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .pet-info {
    padding: 1rem;
  }

  .pet-name {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .pet-species {
    color: #6b7280;
    font-size: 0.875rem;
    margin-bottom: 0.75rem;
  }

  .pet-price {
    font-size: 1.125rem;
    font-weight: 700;
    color: #2563eb;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .form-label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }

  .form-input, .form-textarea {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.25rem;
    font-size: 1rem;
  }

  .form-textarea {
    min-height: 100px;
    resize: vertical;
  }

  .error {
    background: #fee2e2;
    color: #991b1b;
    padding: 0.75rem;
    border-radius: 0.25rem;
    margin-bottom: 1rem;
  }

  .success {
    background: #d1fae5;
    color: #065f46;
    padding: 0.75rem;
    border-radius: 0.25rem;
    margin-bottom: 1rem;
  }

  .loading {
    text-align: center;
    padding: 2rem;
    color: #6b7280;
  }

  @media (max-width: 640px) {
    .grid {
      grid-template-columns: 1fr;
    }
  }
`;

export function Layout({ children, title = 'PetSynth 9000' }: { children: any; title?: string }) {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <Style />
      </head>
      <body class={globalStyles}>
        <header class="header">
          <nav class="nav">
            <div class="nav-links">
              <a href="/" class="nav-brand">PetSynth</a>
              <a href="/catalog">Catalog</a>
              <a href="/generate">Generate</a>
              <a href="/store">My Store</a>
            </div>
            <div>
              <a href="/login" class="btn btn-primary">Login</a>
            </div>
          </nav>
        </header>
        <main class="container">
          {children}
        </main>
      </body>
    </html>
  );
}
