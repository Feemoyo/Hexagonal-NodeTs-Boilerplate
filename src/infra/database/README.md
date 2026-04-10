# Database (Infra)

Implementação concreta da camada de persistência usando **Prisma**.

## Estrutura

- **PrismaClient.ts** - Inicialização e singleton do cliente Prisma
- **schema.prisma** - Schema do banco (Prisma DSL)
- **migrations/** - Migrações auto-geradas pelo Prisma
- **seed.ts** - Script para popular dados iniciais
- **index.ts** - Re-exports públicos

## Comandos

### Gerar cliente Prisma
```bash
npm run db:generate
```

### Criar nova migração
```bash
npm run db:migrate
```

### Aplicar migrações em produção
```bash
npm run db:migrate:prod
```

### Popular banco com dados
```bash
npm run db:seed
```

### Abrir Prisma Studio
```bash
npm run db:studio
```

## Padrão Hexagonal

Esta camada é uma **implementação de infra** - adaptador de persistência.
Depende de abstrações do `domain/ports` e `application/ports` para não acoplar regras de negócio ao ORM.

## Migrações

As migrações são auto-geradas pelo Prisma e armazenadas em `migrations/`.
Sempre execute migrações antes de iniciar a aplicação em ambiente novo.
