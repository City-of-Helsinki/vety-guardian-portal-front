# vety-guardian-portal-front

## Development environment

### Requirements:

- Node.js >= 24.0.0

### Setup

1. Install packages:

```
npm install
```

2. Run dev server:

```
npm run dev
```

### Update/generate api classes from OpenApi schema

NOTE: 'codegen' will not remove obsolete endpoint classes.

```
npm run codegen
```

### Login (Helsinki-profiili)

Login uses the [HDS login module](https://hds.hel.fi/components/login/) against Helsinki Tunnistus.
Fill the `VITE_OIDC_*` variables in `.env` (see `.env.example`). The Tunnistus client must allow
`http://localhost:5173/auth/helsinki/return` as a redirect URI and `http://localhost:5173/auth/helsinki/logout` as a post-logout redirect URI.

After login the app exchanges the access token for API tokens (backend + Helsinki-profiili), sends the
backend token as `Authorization: Bearer`, and calls `POST /auth/identity/` so the backend can read the
guardian's henkilötunnus from Helsinki-profiili.
