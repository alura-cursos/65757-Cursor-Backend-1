# Backend Hermex

API REST da **Hermex Locadora de Veículos**, alinhada ao Figma e ao frontend Vite/React.

## Stack

- Node.js + Express + TypeScript
- Prisma + SQLite
- JWT (auth)
- Zod (validação)

## Setup

```bash
npm install
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

API em `http://localhost:3333`.

Usuário de teste do seed:

- e-mail: `cliente@hermex.com`
- senha: `123456`

## Endpoints

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/health` | não | Health check |
| POST | `/api/auth/register` | não | Cadastro |
| POST | `/api/auth/login` | não | Login |
| GET | `/api/auth/me` | sim | Usuário autenticado |
| GET | `/api/cars` | não | Catálogo bruto (`?category=&q=`) |
| GET | `/api/cars/categories` | não | Categorias para filtro |
| GET | `/api/cars/:id` | não | Detalhe (id ou slug) |
| GET | `/api/availability` | não | Frota disponível no período |
| GET | `/api/locations` | não | Locais de retirada/devolução |
| GET | `/api/protections` | não | Planos Básica / Padrão / Avançada |
| POST | `/api/reservations/quote` | não | Simula diárias e total |
| GET | `/api/reservations` | sim | Minhas reservas |
| POST | `/api/reservations` | sim | Confirma reserva |
| GET | `/api/reservations/:id` | sim | Detalhe (id ou código) |
| PATCH | `/api/reservations/:id/cancel` | sim | Cancela reserva |

### `GET /api/availability`

Query obrigatória: `pickupLocationId`, `returnLocationId`, `pickupDate`, `returnDate` (`YYYY-MM-DD`).  
Opcional: `category`, `q`.  
Resposta: mesmo shape de `GET /api/cars` (array de carros sem overlap com reservas `CONFIRMED`).

## Fluxo do front (Figma)

1. **Home** → `GET /api/cars` + `GET /api/cars/categories`
2. **Buscar** → `GET /api/locations` + `GET /api/availability?...`
3. **Detalhes** → `GET /api/cars/:slug`
4. **Reserva** → `GET /api/protections` + `POST /api/reservations/quote`
5. **Confirmação** → `POST /api/reservations` (retorna `code` tipo `XYZH6013`)
6. **Cancelar** → `PATCH /api/reservations/:code/cancel`

## Exemplo de reserva

```http
POST /api/reservations
Authorization: Bearer <token>
Content-Type: application/json

{
  "carId": "hb20",
  "pickupLocationId": "<id>",
  "returnLocationId": "<id>",
  "pickupDate": "2025-09-20",
  "pickupTime": "10:00",
  "returnDate": "2025-09-24",
  "returnTime": "10:00",
  "protectionId": "basica"
}
```

Resposta inclui `days`, `carSubtotal`, `protectionSubtotal` e `totalPrice` (ex.: 4×R$120 + 4×R$45 = R$660).

## Integração com o frontend

No Vite, use `VITE_API_URL=http://localhost:3333/api` e troque o mock de `src/services/cars.ts` por `fetch`.

CORS está liberado para qualquer origem.
