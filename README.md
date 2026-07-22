# Pazar — Marketplace Frontend

Çok satıcılı e-ticaret uygulamasının React tabanlı frontend'i. Projenin kapsamı `PROJECT_PLAN.md`, frontend mimarisi ve değiştirilemez kuralları ise `FE-STANDARDS.md` tarafından belirlenir.

## Teknolojiler

- React 19, TypeScript ve Vite
- Tailwind CSS
- React Router
- TanStack Query
- React Hook Form
- Oxlint

## Yerel geliştirme

Node.js 22 önerilir.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

`.env.local` içindeki `VITE_API_BASE_URL`, çalışan backend adresini göstermelidir. Varsayılan yerel değer `http://localhost:8081` şeklindedir.

## Kontroller

```bash
npm run lint
npm run build
```

Her pull request'te aynı kontroller GitHub Actions tarafından çalıştırılır. `main` branch'i Vercel production deploy'una bağlıdır.

## Ortam değişkenleri

| Değişken | Açıklama |
|---|---|
| `VITE_API_BASE_URL` | Backend API'nin kök adresi; sonunda `/` olmadan tanımlanması önerilir. |

API çağrıları refresh token cookie'si için her zaman `credentials: 'include'` seçeneğiyle gönderilir. Access token ilerleyen auth diliminde yalnızca uygulama belleğinde tutulacaktır.
