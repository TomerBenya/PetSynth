/** @jsxImportSource hono/jsx */
import { Hono } from "hono";
import { Layout } from "../../server/views/Layout";

const login = new Hono();

login.get("/", (c) => {
  return c.html(
    <Layout title="Login - PetSynth">
      <div style="max-width: 500px; margin: 2rem auto;">
        <h1 style="margin-bottom: 2rem; text-align: center;">
          Welcome to PetSynth
        </h1>

        {/* Error banner with accessibility */}
        <div
          id="error"
          role="alert"
          aria-live="assertive"
          style="display: none;"
          class="error"
        ></div>

        {/* Tab buttons */}
        <div style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem; border-bottom: 2px solid #e5e7eb;">
          <button
            id="loginTab"
            onclick="switchTab('login')"
            class="btn"
            style="flex: 1; border-radius: 0; border-bottom: 3px solid #2563eb; background: transparent; color: #2563eb;"
          >
            Login
          </button>
          <button
            id="registerTab"
            onclick="switchTab('register')"
            class="btn"
            style="flex: 1; border-radius: 0; border-bottom: 3px solid transparent; background: transparent; color: #6b7280;"
          >
            Register
          </button>
        </div>

        {/* Login form */}
        <div id="loginForm" class="card">
          <h2 style="margin-bottom: 1.5rem;">Login to your account</h2>
          <form onsubmit="handleLogin(event); return false;">
            <div class="form-group">
              <label for="login-username" class="form-label">
                Username
              </label>
              <input
                type="text"
                id="login-username"
                name="username"
                required
                class="form-input"
                autocomplete="username"
              />
            </div>
            <div class="form-group">
              <label for="login-password" class="form-label">
                Password
              </label>
              <input
                type="password"
                id="login-password"
                name="password"
                required
                minlength={6}
                class="form-input"
                autocomplete="current-password"
              />
            </div>
            <button type="submit" class="btn btn-primary" style="width: 100%;">
              Login
            </button>
          </form>
        </div>

        {/* Register form */}
        <div id="registerForm" class="card" style="display: none;">
          <h2 style="margin-bottom: 1.5rem;">Create new account</h2>
          <form onsubmit="handleRegister(event); return false;">
            <div class="form-group">
              <label for="register-username" class="form-label">
                Username (3-24 characters)
              </label>
              <input
                type="text"
                id="register-username"
                name="username"
                required
                minlength={3}
                maxlength={24}
                class="form-input"
                autocomplete="username"
              />
            </div>
            <div class="form-group">
              <label for="register-password" class="form-label">
                Password (minimum 6 characters)
              </label>
              <input
                type="password"
                id="register-password"
                name="password"
                required
                minlength={6}
                maxlength={72}
                class="form-input"
                autocomplete="new-password"
              />
            </div>
            <button type="submit" class="btn btn-primary" style="width: 100%;">
              Register
            </button>
          </form>
        </div>
      </div>

      <script src="/js/login.js"></script>
    </Layout>
  );
});

export default login;
