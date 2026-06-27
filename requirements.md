# Documento de Requisitos (requirements.md)

Este documento define os requisitos funcionais e não funcionais para o cadastro de Clubes de Desbravadores no **SGC-SDD (Sistema de Gerenciamento de Clube de Desbravadores)**.

---

## 1. Visão Geral da Funcionalidade
A funcionalidade permite que um Administrador de Clube (função administrativa primária) realize o cadastro inicial de um Clube de Desbravadores no sistema. Cada clube é uma entidade administrativa ligada a uma estrutura regional (Associação/Missão, Distrito, Igreja Local). O cadastro do clube é o passo inicial para que outras funcionalidades do sistema (gestão de membros, unidades, especialidades, classes) possam ser utilizadas.

---

## 2. Atores
*   **Administrador do Clube**: Usuário responsável pelo clube que executa o cadastro e gerencia suas informações.
*   **Sistema**: A plataforma SGC-SDD.

---

## 3. Requisitos Funcionais (Histórias de Usuário no Formato EARS)

O formato EARS (Easy Approach to Requirements Syntax) segue a estrutura: 
*   **Geral (Ubiquitous)**: `THE SYSTEM SHALL [comportamento]`
*   **Orientado a Evento (Event-driven)**: `WHEN [evento], THE SYSTEM SHALL [comportamento]`
*   **Tratamento de Erros (Unwanted Behavior)**: `IF [condição indesejada], THEN THE SYSTEM SHALL [comportamento]`
*   **Orientado a Estado (State-driven)**: `WHILE [estado ativo], THE SYSTEM SHALL [comportamento]`

### 3.1. Autenticação e Autorização do Administrador
1.  **EARS-01 (Event-driven)**: WHEN an unauthenticated user attempts to access the club registration form, THE SYSTEM SHALL redirect the user to the login or registration page.
2.  **EARS-02 (State-driven)**: WHILE a user is authenticated as a Club Administrator, THE SYSTEM SHALL permit access to the club registration interface.
3.  **EARS-03 (Unwanted Behavior)**: IF an authenticated user without administrative privileges attempts to register a club, THEN THE SYSTEM SHALL display an "Access Denied" error message and block the operation.

### 3.2. Fluxo de Cadastro do Clube
4.  **EARS-04 (Event-driven)**: WHEN the Club Administrator submits the club registration form with all required valid data, THE SYSTEM SHALL persist the club records in the database.
5.  **EARS-05 (Event-driven)**: WHEN a club registration is successfully saved, THE SYSTEM SHALL associate the authenticated Club Administrator as the primary owner/director of that club.
6.  **EARS-06 (Event-driven)**: WHEN the club is successfully registered, THE SYSTEM SHALL generate a unique, non-sequential Club Identification Code (e.g., CLB-XXXXXX).

### 3.3. Validação de Dados
7.  **EARS-07 (Unwanted Behavior)**: IF the Club Administrator submits the registration form with a club name that already exists in the database, THEN THE SYSTEM SHALL reject the submission and display a validation error: "O nome do clube já está cadastrado".
8.  **EARS-08 (Unwanted Behavior)**: IF any required field (e.g., Club Name, Association, Local Church, City, State) is empty during submission, THEN THE SYSTEM SHALL reject the transaction and highlight the missing fields.
9.  **EARS-09 (Unwanted Behavior)**: IF the provided founding date is in the future, THEN THE SYSTEM SHALL reject the form and display a validation error: "A data de fundação não pode ser posterior à data atual".

---

## 4. Requisitos Não Funcionais
*   **Segurança**: Senhas de administradores devem ser criptografadas utilizando algoritmos modernos (e.g., bcrypt com fator de custo >= 10). A comunicação deve ser estritamente via HTTPS.
*   **Usabilidade**: A interface do formulário deve ser responsiva (mobile-friendly), considerando que muitos usuários acessam via celular.
*   **Desempenho**: O tempo de resposta para a submissão e registro de um clube não deve exceder 2 segundos sob condições normais de rede.
*   **Escalabilidade**: O design do banco de dados deve suportar relacionamentos de multi-inquilinato (multi-tenancy), preparando a arquitetura para múltiplos clubes no mesmo banco isolados logicamente.

---

## 5. Fora de Escopo
Para manter este ciclo de entrega focado e incremental, os seguintes itens estão **explicitamente fora de escopo** nesta fase:
*   Cadastro de membros (Desbravadores), unidades (e.g., Unidade Águia, Leão) e classes/especialidades.
*   Importação ou sincronização automatizada com o banco de dados oficial da Divisão Sul-Americana (S.A.D.).
*   Relatórios financeiros ou controle de pagamentos de mensalidades.
*   Envio de emails de confirmação ou SMS (será simulado no console nesta fase).
