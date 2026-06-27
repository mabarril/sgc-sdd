# Quadro de Tarefas Técnicas (tasks.md)

Este documento detalha o planejamento de execução da funcionalidade em tarefas atômicas, sequenciais e rastreáveis. Cada tarefa possui critérios de aceitação específicos e indicações de execução paralela.

---

## Legenda de Execução
*   **Paralelizável (PA)**: Tarefa que pode ser executada por um sub-agente em paralelo, sem bloquear outras atividades em andamento.
*   **Sequencial (SEQ)**: Tarefa que exige a conclusão das dependências listadas antes de iniciar.

---

## Fase 1: Setup do Ambiente e Infraestrutura

### [ ] Task 1.1: Inicialização do Workspace Monorepo
*   **Tipo**: SEQ
*   **Descrição**: Criar a estrutura básica de pastas do projeto (`apps/api` e `apps/web`), inicializar o arquivo `package.json` raiz com suporte a Workspaces NPM e configurar o TypeScript para ambos os subprojetos.
*   **Critérios de Aceite**:
    *   Execução de `npm run dev` na raiz inicia ambos os servidores (Backend e Frontend) de forma concorrente.
    *   TypeScript compila sem erros nos projetos `api` e `web`.
*   **Dependências**: Nenhuma

### [ ] Task 1.2: Configuração do Banco de Dados (Docker + Prisma)
*   **Tipo**: SEQ (Pode rodar em paralelo com Task 1.3 após Task 1.1)
*   **Descrição**: Criar um arquivo `docker-compose.yml` para levantar a instância local do PostgreSQL e inicializar o Prisma ORM no projeto `apps/api`.
*   **Critérios de Aceite**:
    *   `docker compose up -d` ativa um banco PostgreSQL na porta 5432.
    *   Arquivo `schema.prisma` criado na pasta `apps/api/prisma` contendo a conexão parametrizada pelas variáveis de ambiente.
*   **Dependências**: Task 1.1

---

## Fase 2: Banco de Dados e Modelagem

### [ ] Task 2.1: Implementação do Schema e Migrations
*   **Tipo**: SEQ
*   **Descrição**: Transcrever os modelos `User` e `Club` definidos no [design.md](file:///home/userland/projetos/sgc-sdd/design.md) para o arquivo `schema.prisma` e executar a primeira migration.
*   **Critérios de Aceite**:
    *   Comando `npx prisma migrate dev --name init_db` executado com sucesso.
    *   Tabelas `User` e `Club` geradas fisicamente no PostgreSQL com todas as chaves primárias, estrangeiras e restrições de unicidade.
*   **Dependências**: Task 1.2

---

## Fase 3: Backend - Autenticação & Autorização

### [ ] Task 3.1: Registro de Usuários (`POST /api/auth/register`)
*   **Tipo**: SEQ
*   **Descrição**: Criar o endpoint de cadastro de administradores de clubes. Inclui criptografia da senha usando `bcryptjs` e validação de formato de e-mail e força de senha com `zod`.
*   **Critérios de Aceite**:
    *   Envio de requisição válida retorna HTTP 201 e dados do usuário (excluindo o hash da senha).
    *   Tentativa de cadastrar e-mail duplicado retorna HTTP 409.
    *   Testes unitários ou de integração provam o comportamento.
*   **Dependências**: Task 2.1

### [ ] Task 3.2: Login e Geração de Token JWT (`POST /api/auth/login`)
*   **Tipo**: PA (Pode ser feito em paralelo à Task 3.1)
*   **Descrição**: Criar o endpoint para autenticação do administrador, validando as credenciais contra a tabela do Prisma e retornando um Token JWT assinado.
*   **Critérios de Aceite**:
    *   Login bem-sucedido retorna HTTP 200 contendo o token JWT válido com expiração definida (e.g., 24h).
    *   Senha errada ou usuário não cadastrado retorna HTTP 401.
*   **Dependências**: Task 2.1

### [ ] Task 3.3: Middleware de Proteção de Rotas (Auth Middleware)
*   **Tipo**: SEQ
*   **Descrição**: Desenvolver o middleware Express que lê o cabeçalho `Authorization: Bearer <token>`, valida a assinatura e expiração do JWT e anexa as claims do usuário autenticado no objeto de requisição (e.g., `req.user`).
*   **Critérios de Aceite**:
    *   Requisição sem token ou token expirado em rota protegida resulta em HTTP 401 Unauthorized.
    *   Requisição com token válido prossegue para o próximo handler e injeta dados do usuário autenticado.
*   **Dependências**: Task 3.2

---

## Fase 4: Backend - Registro do Clube

### [ ] Task 4.1: Caso de Uso e Lógica de Geração do Código do Clube
*   **Tipo**: SEQ
*   **Descrição**: Criar o caso de uso `RegisterClubUseCase` que contém as regras de negócio: validação de unicidade de nome do clube, validação de data retroativa e geração do código único não sequencial (ex: `CLB-` + 6 dígitos aleatórios).
*   **Critérios de Aceite**:
    *   Caso de uso lança erros de negócio apropriados em caso de violação de regras (e.g. `ConflictError`, `ValidationError`).
    *   A geração de código é garantida como única ou possui lógica de retry caso haja colisão (embora improvável para 6 dígitos aleatórios).
    *   Cobertura com testes unitários para a lógica de negócio.
*   **Dependências**: Task 3.1, Task 3.3

### [ ] Task 4.2: Controller e Rota Protegida de Cadastro (`POST /api/clubs`)
*   **Tipo**: SEQ
*   **Descrição**: Conectar o middleware de autenticação à rota de POST `/api/clubs` e expor o controller que aciona o `RegisterClubUseCase`.
*   **Critérios de Aceite**:
    *   Apenas usuários autenticados com o papel `ADMIN_CLUB` podem cadastrar o clube.
    *   Submissão com sucesso persiste o clube e vincula o ID do usuário como diretor do clube, retornando HTTP 201 com o DTO do clube.
*   **Dependências**: Task 4.1

---

## Fase 5: Frontend - Sistema de Design e Layout

### [ ] Task 5.1: Setup de Design System (CSS Variables) & Layout Base
*   **Tipo**: PA (Pode rodar em paralelo com toda a Fase 3 e Fase 4 por sub-agente)
*   **Descrição**: Configurar o arquivo global de estilos (`index.css`) no projeto `apps/web` com variáveis CSS estruturadas para cores modernas (tons escuros ricos/glassmorphism ou tema claro e escuro automatizados), fontes e animações de botões. Desenvolver a estrutura de layout básica da aplicação.
*   **Critérios de Aceite**:
    *   Definição de paleta de cores (primária, secundária, background, texto, estados de erro e sucesso).
    *   Estilização consistente de inputs de formulário, botões com animação hover/focus e caixas de alerta.
*   **Dependências**: Task 1.1

---

## Fase 6: Frontend - Páginas e Integração

### [ ] Task 6.1: Páginas de Autenticação (Login e Cadastro de Usuário)
*   **Tipo**: SEQ
*   **Descrição**: Construir a página de registro do administrador e a página de login no frontend, implementando validações visuais nos campos de entrada e chamando as APIs correspondentes.
*   **Critérios de Aceite**:
    *   Fluxo de registro e login funciona no frontend, salvando o JWT retornado no LocalStorage/SessionState.
    *   Feedback visual imediato é exibido em caso de erros na validação do formulário ou erros da API (e.g., e-mail duplicado).
*   **Dependências**: Task 3.1, Task 3.2, Task 5.1

### [ ] Task 6.2: Página de Formulário de Cadastro do Clube
*   **Tipo**: SEQ
*   **Descrição**: Criar a página protegida que exibe o formulário de cadastro do clube de desbravadores, com campos de Nome, Associação, Igreja Local, Cidade, UF (Estado) e Data de Fundação.
*   **Critérios de Aceite**:
    *   Exibe validações dinâmicas (e.g. data inválida, UF vazia).
    *   Ao enviar com sucesso, mostra uma tela moderna de confirmação exibindo de forma destacada o código de identificação gerado (CLB-XXXXXX).
*   **Dependências**: Task 4.2, Task 6.1

---

## Fase 7: Integração, Teste e Verificação E2E

### [ ] Task 7.1: Fluxo Ponta a Ponta e Validação de Erros
*   **Tipo**: SEQ
*   **Descrição**: Executar testes ponta a ponta integrando o frontend com o backend real. Simular tentativas de erro no fluxo para verificar o tratamento global de erros.
*   **Critérios de Aceite**:
    *   O fluxo completo: Registrar Admin -> Fazer Login -> Cadastrar Clube -> Exibir Confirmação funciona sem erros no console.
    *   Tentativa de cadastrar clube com nome já existente é barrada pela API e exibida amigavelmente na interface do usuário.
*   **Dependências**: Todas as tarefas anteriores.
