# Hexagonal Architecture Boilerplate - Node.js + TypeScript + Fastify

Uma estrutura pronta para produção baseada em **arquitetura hexagonal (ports and adapters)** com Node.js, TypeScript, Fastify, Prisma, PostgreSQL, Redis, BullMQ e JWT.

## 🎯 Características

- ✅ **Arquitetura Hexagonal** - Separação clara entre domínio, aplicação e infraestrutura
- ✅ **Framework HTTP** - Fastify rápido e eficiente
- ✅ **ORM** - Prisma para bancos de dados
- ✅ **Autenticação** - JWT pronta para uso
- ✅ **Cache** - Redis integrado
- ✅ **Filas** - BullMQ para processamento assíncrono
- ✅ **Observabilidade** - OpenTelemetry com Jaeger
- ✅ **Testes** - Vitest com testes unitários e integração
- ✅ **Docker Compose** - Ambiente local pronto

## 📦 Stack Tecnológico

| Camada | Tecnologia |
|--------|-----------|
| Runtime | Node.js 18+ |
| Linguagem | TypeScript |
| Framework HTTP | Fastify |
| ORM | Prisma |
| Banco Dados | PostgreSQL |
| Cache | Redis |
| Filas | BullMQ |
| Auth | JWT |
| Testes | Vitest |
| Observabilidade | OpenTelemetry + Jaeger |

## 🏗️ Estrutura do Projeto

```
src/
├── domain/                    # Entidades, Value Objects, Regras de negócio
│   ├── entities/             # BaseEntity
│   └── ports/                # Interfaces de contrato
├── application/              # Casos de uso, DTOs, Portas da aplicação
│   ├── dtos/
│   ├── ports/
│   └── use-cases/
├── infra/                     # Implementações concretas
│   ├── database/
│   │   ├── PrismaClient.ts    # Cliente Prisma
│   │   ├── schema.prisma      # Schema do banco (aqui!)
│   │   ├── seed.ts            # Seed do banco (aqui!)
│   │   ├── migrations/        # Migrações Prisma (aqui!)
│   │   └── index.ts           # Re-exports
│   ├── repositories/          # Repositórios
│   ├── auth/                  # JWT
│   ├── cache/                 # Redis
│   ├── queue/                 # BullMQ
│   └── observability/         # OpenTelemetry
├── api/                       # Camada HTTP organizada por feature
│   ├── features/
│   │   ├── auth/
│   │   ├── health/
│   │   └── profile/
│   └── middlewares/
├── main/              # Bootstrap, DI Container
│   ├── server.ts
│   └── container.ts
└── config/            # Variáveis de ambiente

tests/
├── unit/              # Testes unitários
└── integration/       # Testes de integração

prisma/               # Apenas .prismarc.json (configuração CLI)
  └── migrations/    # Espelho de src/infra/database/migrations
```

## 🚀 Quick Start

### 1. Instalar Dependências

```bash
npm install
```

### 2. Iniciar Infraestrutura (Docker Compose)

```bash
docker-compose up -d
```

Isso inicia:
- PostgreSQL (porta 5432)
- Redis (porta 6379)
- OpenTelemetry Collector (porta 4318)
- Jaeger (porta 16686)

### 3. Configurar Banco de Dados

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

### 4. Executar em Desenvolvimento

```bash
npm run dev
```

Server rodará em `http://localhost:3000`

## 📝 Endpoints Disponíveis

### Health Check
```bash
GET /health
```

Retorna:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Gerar Token JWT
```bash
POST /auth/generate-token
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe"
}
```

Retorna:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "payload": {
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Acessar Endpoint Protegido
```bash
GET /profile
Authorization: Bearer <TOKEN>
```

Retorna os dados decodificados do JWT:
```json
{
  "success": true,
  "user": {
    "email": "user@example.com",
    "name": "John Doe",
    "iat": 1705317000,
    "exp": 1705403400
  }
}
```

## 🧪 Testes

### Rodar Testes Unitários e Integração
```bash
npm test
```

### Modo Watch
```bash
npm run test:watch
```

### UI do Vitest
```bash
npm run test:ui
```

## 🔨 Scripts Disponíveis

```bash
npm run dev              # Executar em desenvolvimento
npm run build            # Build para produção
npm start                # Iniciar versão compilada

npm test                 # Rodar testes
npm run test:watch       # Rodar testes em modo watch
npm run test:ui          # Abrir UI do Vitest

npm run lint             # Verificar linting
npm run format           # Formatar código

npm run db:generate      # Gerar cliente Prisma
npm run db:migrate       # Executar migrações
npm run db:migrate:prod  # Executar migrações em produção
npm run db:seed          # Popular banco com dados iniciais
npm run db:studio        # Abrir Prisma Studio
```

## 🔐 Segurança

### Variáveis de Ambiente

Crie um arquivo `.env.local` baseado em `.env.example`:

```bash
cp .env.example .env.local
```

### JWT

- **JWT_SECRET**: Chave para assinar tokens (MUDE EM PRODUÇÃO)
- **JWT_EXPIRES_IN**: Tempo de expiração do token (padrão: 24h)

## 🐳 Docker Compose

### Iniciar Serviços
```bash
docker-compose up -d
```

### Parar Serviços
```bash
docker-compose down
```

### Ver Logs
```bash
docker-compose logs -f
```

### Acessar Jaeger UI
```
http://localhost:16686
```

## 🧠 Arquitetura Hexagonal Explicada

### Camadas

1. **Domain**: Regras de negócio puras, desacopladas de qualquer framework
2. **Application**: Casos de uso que orquestram serviços do domínio
3. **Infra**: Implementações técnicas (ORM, cache, HTTP clients)
4. **API**: Controllers e rotas HTTP

### Fluxo de Requisição

```
HTTP Request
    ↓
Route Handler
    ↓
Feature Handler (API)
    ↓
Use Case (Application)
    ↓
Domain Logic
    ↓
Repository (Infra - Port implementation)
    ↓
Database
```

## 📊 Observabilidade

O projeto inclui OpenTelemetry com exportação para Jaeger:

1. **Traces**: Rastreamento distribuído de requisições
2. **Logs**: Logging estruturado com Pino
3. **Métricas**: Base para implementação de métricas Prometheus

### Acessar Jaeger
```
http://localhost:16686
```

## 🤝 Dependência Injeção

A injeção de dependências é feita manualmente no `src/main/container.ts`:

```typescript
// Criação de instâncias
const jwtAuth = new JwtAuth();

// Injeção nas rotas/handlers por feature
await registerAuthRoutes(app, jwtAuth);
await registerProfileRoutes(app, jwtAuth);
```

Isso mantém o código simples e sem magic, sem necessidade de decorators ou frameworks pesados.

## 📈 Próximos Passos

1. **Implementar mais Use Cases**: Estenda a lógica de negócio em `src/application/use-cases`
2. **Adicionar Repositórios**: Crie repositórios em `src/infra/repositories` implementando as portas
3. **Expandir Features HTTP**: Adicione novos módulos em `src/api/features`
4. **Filas Assíncronas**: Use `queueManager` para processar tarefas em background
5. **Cache**: Utilize Redis através de `getRedis()` para cache de dados
6. **Testes**: Adicione fixtures e mocks conforme necessário

## 📚 Referências

- [Arquitetura Hexagonal](https://en.wikipedia.org/wiki/Hexagonal_architecture)
- [Fastify Documentation](https://www.fastify.io/)
- [Prisma ORM](https://www.prisma.io/)
- [Vitest](https://vitest.dev/)
- [OpenTelemetry](https://opentelemetry.io/)

## 📄 License

MIT
# Hexagonal-NodeTs-Boilerplate
