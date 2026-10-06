# Backend Hermex

API REST da **Hermex Locadora de Veículos**, alinhada ao Figma e ao frontend Vite/React.

## Stack

- Node.js + Express + TypeScript
- Prisma + SQLite
- Zod (validação)
- Docker / Docker Compose

## Setup local

```bash
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

API em `http://localhost:3333`.

## Setup com Docker

```bash
docker compose up --build
```

A API sobe em `http://localhost:3333`, aplica as migrations e executa o seed automaticamente.

Para não reseedar a cada start:

```bash
SEED_ON_START=false docker compose up --build
```

O SQLite fica persistido no volume Docker `hermex_data`.

## Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/health` | Health check |
| GET | `/api/cars` | Catálogo bruto (`?category=&q=`) |
| GET | `/api/cars/categories` | Categorias para filtro |
| GET | `/api/cars/:id` | Detalhe (id ou slug) |
| GET | `/api/availability` | Frota disponível no período |
| GET | `/api/locations` | Locais de retirada/devolução |
| GET | `/api/protections` | Planos Básica / Padrão / Avançada |
| POST | `/api/protections` | Cria plano de proteção |
| PUT | `/api/protections/:id` | Atualiza plano de proteção |
| DELETE | `/api/protections/:id` | Remove plano de proteção |
| POST | `/api/reservations/quote` | Simula diárias e total |
| GET | `/api/reservations` | Lista reservas |
| POST | `/api/reservations` | Confirma reserva |
| GET | `/api/reservations/:id` | Detalhe (id ou código) |
| PATCH | `/api/reservations/:id/cancel` | Cancela reserva |

Nenhuma rota exige autenticação.

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
