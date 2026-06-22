# Documentação do Sistema de Agendamento - Trimly

Esta documentação descreve as implementações de cadastro, login, agendamentos e dashboards adicionadas ao projeto Trimly, em conformidade com as especificações do banco de dados (`TrimlyBD.sql`) e os requisitos descritos nos documentos PDF do projeto.

---

## 🏗️ Resumo das Implementações

1. **Banco de Dados em Local Storage (`src/utils/storage.js`)**:
   - Criação de uma camada de simulação de banco de dados persistida em `localStorage`.
   - Mecanismo de **seeding** automático: caso o banco esteja vazio, ele é populado com dados padrão compatíveis com a estrutura SQL original.
   - Implementação de restrições de integridade, como a **prevenção de conflitos de horário**: impede que o mesmo barbeiro possua dois agendamentos no mesmo horário e dia.

2. **Cadastro e Login Multifuncional (`src/views/Login.vue`)**:
   - Cadastro unificado que permite criar contas de **Cliente** ou **Administrador**.
   - Ao se cadastrar como Administrador, o usuário seleciona qual das 6 barbearias irá gerenciar.
   - Autenticação e persistência de sessão de usuário em `localStorage` para todos os papéis (Cliente, Barbeiro e Administrador).

3. **Detalhes da Barbearia & Agendamentos (`src/views/BarbeariaDetalhes.vue`)**:
   - Exibição de informações sobre a barbearia selecionada e listagem de barbeiros disponíveis nela.
   - Formulário de agendamento reativo para clientes.
   - **Validação de Slots de Horários**: Quando uma data e um barbeiro são selecionados, a interface exibe apenas horários livres. Horários já agendados para aquele barbeiro na data selecionada são bloqueados e desabilitados automaticamente.
   - Suporte para inclusão de instruções e observações adicionais sobre o corte (Requisito R4).

4. **Painel do Cliente (`src/views/ClienteAgendamentos.vue`)**:
   - Histórico completo de agendamentos do cliente.
   - Status do atendimento atualizado em tempo real (Agendado, Concluído, Cancelado).
   - Opção para o cliente cancelar agendamentos ativos.

5. **Painel do Administrador (`src/views/AdminDashboard.vue`)**:
   - Dashboard exclusivo para o administrador gerenciar sua barbearia específica.
   - **Cadastro de Barbeiros**: Formulário para cadastrar novos barbeiros, associando-os automaticamente à sua barbearia.
   - **Visualização de Agenda**: Lista completa de agendamentos de todos os barbeiros daquela filial.
   - **Controle Total**: Ações para cancelar e reagendar compromissos (com verificação de conflitos).

6. **Painel do Barbeiro (`src/views/BarbeiroDashboard.vue`)**:
   - Dashboard exclusivo para o barbeiro visualizar sua própria agenda de cortes.
   - Exibição das notas e observações enviadas pelos clientes.
   - Ações rápidas para marcar corte como "Concluído", cancelar agendamento ou reagendar horário.

---

## 💾 Estrutura do Banco no Local Storage

As tabelas originais do `TrimlyBD.sql` foram modeladas em JSON sob as seguintes chaves do Local Storage:

*   **`trimly_barbearias`**: Lista de barbearias ativas (id, nome, categoria, imagem).
*   **`trimly_cortes`**: Lista de serviços disponíveis (id, descCorte, valor).
*   **`trimly_horarios`**: Lista de horários fixos de funcionamento (de 08:00 a 17:30).
*   **`trimly_usuarios`**: Armazena clientes, barbeiros e administradores. Contém o campo `cargo` ('Cliente', 'Barbeiro', 'Administrador') e `barbeariaId` (apenas para barbeiros e admins).
*   **`trimly_agendamentos`**: Armazena os registros de agendamentos realizados, incluindo IDs e nomes dos clientes/barbeiros, data, hora, observações, preço e status ('Agendado', 'Concluído', 'Cancelado').

---

## 🔑 Credenciais Pré-Seadas para Teste Rápido

Para facilitar a verificação dos fluxos e dashboards, o sistema já é inicializado com as seguintes credenciais de teste (senha padrão para todos é `123`):

### 1. Administradores (Responsáveis por cadastrar novos barbeiros e gerenciar agendamentos de sua respectiva barbearia)
*   **Barbearia Mr Cutts (ID 1)**: `admin1@trimly.com`
*   **Barbearia MW Barber Studio (ID 2)**: `admin2@trimly.com`
*   **Barbearia Visão Barbearia (ID 3)**: `admin3@trimly.com`
*   **Barbearia Ocimar Hair Barbearia (ID 4)**: `admin4@trimly.com`
*   **Barbearia Kleber Rosa Barbearia (ID 5)**: `admin5@trimly.com`
*   **Barbearia Santta Madre Barbearia (ID 6)**: `admin6@trimly.com`

### 2. Barbeiros (Visualizam sua própria agenda e marcam serviços como concluídos)
*   **Henrique Barbeiro (associado à Mr Cutts)**: `henrique@trimly.com`
*   **Thales Barbeiro (associado à Mr Cutts)**: `thales@trimly.com`

### 3. Clientes (Realizam agendamentos e cancelam os próprios horários)
*   **Kawan Cliente**: `kawan@trimly.com`
*   **Jean Cliente**: `jean@trimly.com`

---

## 🛠️ Arquivos Modificados/Criados

*   **Novo** `src/utils/storage.js`: Camada de acesso e gerenciamento do Local Storage.
*   **Novo** `src/views/BarbeariaDetalhes.vue`: Exibe detalhes e formulário de reserva de horários livres.
*   **Novo** `src/views/ClienteAgendamentos.vue`: Histórico e cancelamento de agendamentos para clientes.
*   **Novo** `src/views/AdminDashboard.vue`: Cadastro de barbeiros e controle de agendamentos de uma barbearia.
*   **Novo** `src/views/BarbeiroDashboard.vue`: Agenda de cortes e finalização de atendimentos por barbeiro.
*   **Modificado** `src/main.js`: Inicialização e seeding do Local Storage no carregamento da aplicação.
*   **Modificado** `src/views/Login.vue`: Telas de login e cadastro com seleção de perfil/barbearia.
*   **Modificado** `src/components/Header.vue`: Navegação dinâmica baseada no perfil autenticado.
*   **Modificado** `src/views/home.vue`: Roteamento e gerenciamento de estados globais de telas.
*   **Modificado** `src/views/Barbearias.vue`: Torna os cards clicáveis para abrir o agendamento da respectiva barbearia.
