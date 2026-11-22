# InvitacionesBoda

Invitación digital de boda con estética Editorial Luxury, construida con Vite y JavaScript modular. Incluye portada, historia, evento, código de vestimenta, cuenta regresiva, galería, música, mesa de regalos, confirmación por WhatsApp y footer.

## Desarrollo

Requisitos: Node.js 20.19+ o 22.12+ y npm.

```powershell
npm.cmd install
npm.cmd run dev
```

Abre la URL que muestra Vite (por defecto `http://localhost:5173`).

## Build de producción

```powershell
npm.cmd run build
```

Los archivos listos para publicar se generan en `dist/`.

## Despliegue en GitHub Pages

`vite.config.js` usa `base: './'`, por lo que los assets funcionan correctamente en GitHub Pages y en subdirectorios.

### Opción A — GitHub Actions (recomendada)

1. Sube el repositorio a GitHub.
2. En **Settings → Pages**, selecciona **GitHub Actions** como origen.
3. Crea el archivo `.github/workflows/deploy.yml` con este contenido:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

Cada push a `main` compilará el proyecto y publicará el contenido de `dist/`.

### Opción B — despliegue manual

1. Ejecuta `npm.cmd run build`.
2. Publica el contenido de `dist/` en la rama configurada para GitHub Pages, o súbelo desde la interfaz de GitHub Pages.
3. No es necesario versionar `dist/`: está excluido en `.gitignore` y puede generarse de nuevo con el comando de build.
