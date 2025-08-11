## Project index

### Directory tree
```
frontend/
  - eslint.config.mjs
  - jsconfig.json
  - next.config.js
  - package-lock.json
  - package.json
  - postcss.config.mjs
  - public/
    - file.svg
    - globe.svg
    - next.svg
    - vercel.svg
    - window.svg
  - README.md
  - src/
    - app/
      - auth/
        - login/
          - page.jsx
        - register/
          - page.jsx
        - request-reset/
          - page.jsx
        - reset-password/
          - page.jsx
      - favicon.ico
      - gigs/
        - gigcard/
          - page.jsx
        - giginfo/
          - [id]/
            - page.jsx
      - globals.css
      - layout.js
      - page.js
    - components/
      - gig/
        - GigCard.jsx
        - GigDetail.jsx
      - layout/
        - Container.jsx
        - Footer.jsx
        - HeroBar.jsx
        - LayoutClient.jsx
        - Navbar.jsx
        - Sidebar.jsx
      - ui/
        - AuthForm.jsx
        - Button.jsx
        - InputField.jsx
        - Modal.jsx
        - SelectField.jsx
        - Spinner.jsx
    - context/
      - AuthContext.jsx
```

### App routes (Next.js App Router)
- **/** → `src/app/page.js`
- **/auth/login** → `src/app/auth/login/page.jsx`
- **/auth/register** → `src/app/auth/register/page.jsx`
- **/auth/request-reset** → `src/app/auth/request-reset/page.jsx`
- **/auth/reset-password** → `src/app/auth/reset-password/page.jsx`
- **/gigs/gigcard** → `src/app/gigs/gigcard/page.jsx`
- **/gigs/giginfo/[id]** → `src/app/gigs/giginfo/[id]/page.jsx` (dynamic segment: `id`)

### Global app files
- **Root layout**: `src/app/layout.js`
- **Global styles**: `src/app/globals.css`
- **Favicon**: `src/app/favicon.ico`

### Components
- **Gig components**:
  - `src/components/gig/GigCard.jsx`
  - `src/components/gig/GigDetail.jsx`
- **Layout components**:
  - `src/components/layout/Container.jsx`
  - `src/components/layout/Footer.jsx`
  - `src/components/layout/HeroBar.jsx`
  - `src/components/layout/LayoutClient.jsx`
  - `src/components/layout/Navbar.jsx`
  - `src/components/layout/Sidebar.jsx`
- **UI components**:
  - `src/components/ui/AuthForm.jsx`
  - `src/components/ui/Button.jsx`
  - `src/components/ui/InputField.jsx`
  - `src/components/ui/Modal.jsx`
  - `src/components/ui/SelectField.jsx`
  - `src/components/ui/Spinner.jsx`

### React context
- **Auth context**: `src/context/AuthContext.jsx`

### Public assets
- `public/file.svg`, `public/globe.svg`, `public/next.svg`, `public/vercel.svg`, `public/window.svg`

### Config and meta
- `eslint.config.mjs`
- `jsconfig.json`
- `next.config.js`
- `package.json`, `package-lock.json`
- `postcss.config.mjs`
- `README.md`

### Notes
- This index reflects the current workspace snapshot provided in this environment. If files change, update this `INDEX.md` to keep it in sync. 