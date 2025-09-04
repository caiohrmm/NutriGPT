# 📋 NutriGPT - Sistema CRM para Nutricionistas

## 📝 Visão Geral

O **NutriGPT** é um sistema completo de CRM (Customer Relationship Management) desenvolvido especificamente para nutricionistas. O sistema oferece uma plataforma integrada para gerenciamento de pacientes, consultas, medições corporais e criação de planos alimentares personalizados com auxílio de Inteligência Artificial.

## 🎯 Objetivo do Sistema

Facilitar o trabalho de nutricionistas através de uma plataforma digital que centraliza:
- Cadastro e gestão de pacientes
- Agendamento e controle de consultas
- Acompanhamento de medições e evolução corporal
- Criação de planos alimentares personalizados com IA
- Análise de dados e relatórios visuais

## 🏗️ Arquitetura do Sistema

### Backend (API REST)
- **Linguagem**: Node.js
- **Framework**: Express.js
- **Banco de Dados**: MySQL
- **ORM**: Sequelize
- **Autenticação**: JWT (JSON Web Tokens)
- **Validação**: Zod
- **IA**: Google Gemini API
- **Segurança**: Helmet, CORS, Rate Limiting

### Frontend (SPA)
- **Framework**: React 19
- **Roteamento**: React Router DOM
- **Estilização**: Tailwind CSS
- **Animações**: Framer Motion
- **Formulários**: React Hook Form + Zod
- **Gráficos**: Recharts
- **Ícones**: Lucide React
- **Build Tool**: Vite

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais

#### 1. **Nutritionist** (Nutricionistas)
- `id` (UUID, Primary Key)
- `name` (String) - Nome completo
- `email` (String, Unique) - Email para login
- `password` (String) - Senha criptografada
- `role` (String) - Função (sempre 'nutritionist')
- `createdAt`, `updatedAt` (Timestamps)

#### 2. **Patient** (Pacientes)
- `id` (UUID, Primary Key)
- `nutritionistId` (UUID, Foreign Key) - Referência ao nutricionista
- `fullName` (String) - Nome completo do paciente
- `email` (String, Nullable) - Email do paciente
- `phone` (String, Nullable) - Telefone
- `birthDate` (Date, Nullable) - Data de nascimento
- `sex` (String, Nullable) - Sexo (M/F)
- `weight` (Float, Nullable) - Peso atual em kg
- `height` (Float, Nullable) - Altura em cm
- `goal` (String, Nullable) - Objetivo (perda de peso, ganho de massa, etc.)
- `allergies` (JSON, Nullable) - Lista de alergias/restrições
- `notes` (Text, Nullable) - Observações gerais
- `createdAt`, `updatedAt` (Timestamps)

**Constraint Única**: Email deve ser único por nutricionista (não globalmente)

#### 3. **Appointment** (Consultas)
- `id` (UUID, Primary Key)
- `nutritionistId` (UUID, Foreign Key)
- `patientId` (UUID, Foreign Key)
- `startAt` (DateTime) - Data/hora de início
- `endAt` (DateTime) - Data/hora de fim
- `status` (String) - Status: 'scheduled', 'completed', 'cancelled', 'done'
- `notes` (Text, Nullable) - Observações da consulta
- `createdAt`, `updatedAt` (Timestamps)

#### 4. **Measurement** (Medições)
- `id` (UUID, Primary Key)
- `patientId` (UUID, Foreign Key)
- `date` (DateTime) - Data da medição
- `weight` (Float, Nullable) - Peso em kg
- `heightCm` (Float, Nullable) - Altura em cm
- `bmi` (Float, Nullable) - IMC calculado automaticamente
- `bodyFatPercentage` (Float, Nullable) - % de gordura corporal
- `waistCircumference` (Float, Nullable) - Circunferência da cintura
- `hipCircumference` (Float, Nullable) - Circunferência do quadril
- `armCircumference` (Float, Nullable) - Circunferência do braço
- `notes` (Text, Nullable) - Observações
- `createdAt`, `updatedAt` (Timestamps)

#### 5. **Plan** (Planos Alimentares)
- `id` (UUID, Primary Key)
- `patientId` (UUID, Foreign Key)
- `appointmentId` (UUID, Foreign Key, Nullable) - Consulta relacionada
- `nutritionistId` (UUID, Foreign Key)
- `name` (String) - Nome do plano
- `description` (Text, Nullable) - Descrição/orientações
- `meals` (JSON) - Array de refeições estruturadas
- `totalCalories` (Integer, Nullable) - Total de calorias
- `macros` (JSON) - Macronutrientes (proteína, carboidratos, gorduras)
- `aiGenerated` (Boolean) - Indica se foi gerado por IA
- `isActive` (Boolean) - Indica se é o plano ativo do paciente
- `createdAt`, `updatedAt` (Timestamps)

#### 6. **File** (Arquivos)
- `id` (UUID, Primary Key)
- `patientId` (UUID, Foreign Key, Nullable)
- `nutritionistId` (UUID, Foreign Key, Nullable)
- `filename` (String) - Nome original do arquivo
- `url` (String) - URL de acesso
- `mime` (String) - Tipo MIME
- `size` (Integer) - Tamanho em bytes
- `uploadedAt` (DateTime) - Data do upload

## 🔐 Sistema de Autenticação

### Funcionalidades
- **Registro de nutricionistas** com validação de email único
- **Login seguro** com JWT tokens
- **Sessões persistentes** com refresh tokens
- **Proteção de rotas** com middleware de autenticação
- **Validação de senhas** (mínimo 8 caracteres)
- **Logout seguro** com invalidação de tokens

### Middleware de Segurança
- Helmet para headers de segurança
- CORS configurado
- Rate limiting para prevenir ataques
- Validação de entrada com Zod
- Senhas criptografadas com bcrypt

## 📱 Funcionalidades do Frontend

### 🏠 Dashboard
**Página**: `/dashboard`
**Funcionalidades**:
- Visão geral com métricas em tempo real
- Contadores: Total de pacientes, consultas hoje, planos criados, próximas consultas
- Atividade recente: Novos pacientes e consultas agendadas
- Cards informativos com primeiros passos
- Interface responsiva e animada

### 👥 Gestão de Pacientes
**Página**: `/patients`
**Funcionalidades**:
- **Listagem paginada** com busca e filtros
- **Cadastro de novos pacientes** com formulário completo
- **Edição de dados** existentes
- **Exclusão** com confirmação
- **Busca por nome** com debounce
- **Filtro por objetivo** (perda de peso, ganho de massa, etc.)
- **Visualização de idade** calculada automaticamente (anos e meses)
- **Agendamento rápido** de consultas
- **Navegação para detalhes** do paciente

#### Campos do Cadastro de Pacientes:
- Nome completo (obrigatório)
- Email (opcional, único por nutricionista)
- Telefone (com máscara de formatação)
- Data de nascimento (não pode ser futura)
- Sexo (Masculino/Feminino)
- Peso inicial
- Altura
- Objetivo (seleção de opções pré-definidas)
- Alergias e restrições alimentares
- Observações gerais

### 📊 Detalhes do Paciente
**Página**: `/patients/:id`
**Funcionalidades**:
- **Informações completas** do paciente
- **Métricas atuais** (peso, altura, IMC)
- **Gráficos profissionais** com Recharts:
  - Evolução do peso ao longo do tempo
  - Evolução do IMC
  - Composição corporal
- **Histórico de medições** com tabela detalhada
- **Gestão de medições** (adicionar, editar, excluir)
- **Planos alimentares** do paciente
- **Seção de alergias e observações**

#### Medições Corporais:
- Data da medição (não pode ser futura)
- Peso
- Altura
- IMC (calculado automaticamente)
- Percentual de gordura
- Circunferências (cintura, quadril, braço)
- Observações

### 🍽️ Planos Alimentares
**Integrado na página do paciente**
**Funcionalidades**:
- **Criação manual** de planos alimentares
- **Geração automática com IA** (Google Gemini)
- **Estrutura completa** de refeições:
  - Horário da refeição
  - Nome da refeição (café da manhã, almoço, etc.)
  - Lista de alimentos com quantidades
  - Calorias por refeição
  - Macronutrientes (proteína, carboidratos, gorduras)
- **Cálculos automáticos** de totais
- **Sistema de planos ativos** (apenas um por paciente)
- **Edição e exclusão** de planos
- **Identificação visual** de planos gerados por IA

#### Geração de IA:
- Baseada nos dados do paciente (idade, peso, altura, objetivo)
- Considera alergias e restrições
- Permite preferências personalizadas
- Gera 5-6 refeições balanceadas
- Calcula calorias e macronutrientes automaticamente
- Fallback para plano padrão se IA indisponível

### 📅 Gestão de Consultas
**Página**: `/appointments`
**Funcionalidades**:
- **Listagem paginada** de consultas
- **Agendamento** de novas consultas
- **Reagendamento** (exceto consultas finalizadas)
- **Cancelamento e exclusão** de consultas
- **Finalização** de consultas
- **Filtros por status**: Agendada, Concluída, Cancelada, Finalizada
- **Busca por paciente**
- **Visualização detalhada** com informações do paciente
- **Confirmações modais** para ações críticas

#### Status de Consultas:
- **Scheduled** (Agendada): Consulta marcada
- **Completed** (Concluída): Consulta realizada
- **Cancelled** (Cancelada): Consulta cancelada
- **Done** (Finalizada): Consulta finalizada (não pode ser reagendada)

### 👤 Perfil do Nutricionista
**Página**: `/profile`
**Funcionalidades**:
- **Visualização** dos dados do nutricionista
- **Edição do nome** do profissional
- **Alteração de senha** com validação
- **Informações profissionais** em cards visuais
- **Validação de senha atual** para alterações
- **Feedback visual** com toasts

### 🔍 Busca Global
**Componente**: Header
**Funcionalidades**:
- **Busca em tempo real** com debounce
- **Resultados categorizados**:
  - Pacientes (nome, email, telefone, objetivo)
  - Consultas (paciente, data, horário, status)
- **Navegação direta** aos resultados
- **Links para visualizar todos** os resultados
- **Interface dropdown** responsiva

## 🛠️ Funcionalidades do Backend (API)

### 🔐 Autenticação (`/auth`)
- `POST /register` - Registro de nutricionista
- `POST /login` - Login com email/senha
- `PUT /me` - Atualizar perfil (nome/senha)
- `POST /logout` - Logout seguro

### 👥 Pacientes (`/patients`)
- `GET /patients` - Listar pacientes (paginado, com busca/filtros)
- `POST /patients` - Criar novo paciente
- `GET /patients/:id` - Detalhes de um paciente
- `PUT /patients/:id` - Atualizar paciente
- `DELETE /patients/:id` - Excluir paciente
- `GET /patients/:id/plans` - Planos do paciente

### 📅 Consultas (`/appointments`)
- `GET /appointments` - Listar consultas (paginado, com filtros)
- `POST /appointments` - Agendar consulta
- `GET /appointments/:id` - Detalhes da consulta
- `PUT /appointments/:id` - Reagendar consulta
- `PATCH /appointments/:id/status` - Alterar status
- `DELETE /appointments/:id` - Excluir consulta

### 📏 Medições (`/measurements`)
- `GET /measurements` - Listar medições
- `POST /measurements` - Adicionar medição
- `GET /measurements/:id` - Detalhes da medição
- `PUT /measurements/:id` - Atualizar medição
- `DELETE /measurements/:id` - Excluir medição

### 🍽️ Planos Alimentares (`/plans`)
- `POST /plans/ai/suggestion` - Gerar sugestão com IA
- `POST /plans` - Criar plano alimentar
- `GET /plans/:id` - Detalhes do plano
- `PUT /plans/:id` - Atualizar plano
- `PATCH /plans/:id/toggle-active` - Ativar/desativar plano
- `DELETE /plans/:id` - Excluir plano

### 🔍 Busca Global (`/search`)
- Busca integrada em pacientes e consultas
- Resultados categorizados
- Suporte a múltiplos termos

## 🎨 Interface e UX

### Design System
- **Paleta de cores**: Verde (tema nutrição e saúde)
- **Tipografia**: Inter (legibilidade e modernidade)
- **Componentes**: Reutilizáveis e consistentes
- **Animações**: Suaves com Framer Motion
- **Responsividade**: Mobile-first design

### Componentes UI Principais
- **Cards informativos** com métricas
- **Tabelas paginadas** com ações
- **Formulários validados** com feedback
- **Modais de confirmação** para ações críticas
- **Sistema de toasts** para notificações
- **Gráficos profissionais** para análise
- **Sidebar fixa** com navegação
- **Header com busca global**

### Experiência do Usuário
- **Navegação intuitiva** com sidebar sempre visível
- **Feedback imediato** para todas as ações
- **Confirmações** para ações destrutivas
- **Loading states** durante operações
- **Mensagens informativas** quando não há dados
- **Validação em tempo real** nos formulários
- **Busca instantânea** com resultados em tempo real

## 🤖 Integração com IA

### Google Gemini API
- **Modelo**: gemini-1.5-flash
- **Funcionalidade**: Geração de planos alimentares personalizados
- **Entrada**: Dados do paciente + preferências
- **Saída**: Plano estruturado com refeições, calorias e macros

### Personalização da IA
- **Dados considerados**:
  - Idade, peso, altura, sexo
  - Objetivo nutricional
  - Alergias e restrições
  - Preferências específicas
- **Validação**: Resposta da IA é validada e normalizada
- **Fallback**: Plano padrão caso a IA falhe
- **Identificação**: Planos gerados por IA são marcados

## 📊 Análise de Dados

### Métricas do Dashboard
- Total de pacientes cadastrados
- Consultas do dia atual
- Planos alimentares criados
- Próximas consultas agendadas
- Atividade recente do sistema

### Gráficos de Evolução
- **Evolução do peso**: Linha temporal com peso do paciente
- **Evolução do IMC**: Acompanhamento do índice de massa corporal
- **Composição corporal**: Visualização de medidas corporais
- **Responsividade**: Gráficos adaptáveis a diferentes telas

## 🔒 Segurança e Privacidade

### Medidas de Segurança
- **Autenticação JWT** com tokens seguros
- **Criptografia de senhas** com bcrypt
- **Validação de entrada** em todos os endpoints
- **Rate limiting** para prevenir abuso
- **CORS configurado** para domínios autorizados
- **Headers de segurança** com Helmet
- **Sanitização de dados** antes do armazenamento

### Privacidade dos Dados
- **Isolamento por nutricionista**: Cada profissional acessa apenas seus dados
- **Validação de propriedade**: Verificação de ownership em todas as operações
- **Emails únicos por contexto**: Pacientes podem ter mesmo email para diferentes nutricionistas
- **Logs de auditoria**: Registro de operações importantes

## 🚀 Instalação e Configuração

### Pré-requisitos
- Node.js >= 18
- MySQL >= 8.0
- NPM ou Yarn

### Backend
```bash
# Instalar dependências
npm install

# Configurar banco de dados
npm run db:create
npm run db:migrate

# Configurar variáveis de ambiente (.env)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=nutrigpt
DB_USER=root
DB_PASS=
JWT_SECRET=your-secret-key
GEMINI_API_KEY=your-gemini-api-key

# Executar
npm run dev  # Desenvolvimento
npm start    # Produção
```

### Frontend
```bash
cd frontend

# Instalar dependências
npm install

# Executar
npm run dev   # Desenvolvimento
npm run build # Build para produção
```

## 🔧 Scripts Disponíveis

### Backend
- `npm run dev` - Servidor de desenvolvimento com nodemon
- `npm start` - Servidor de produção
- `npm run db:migrate` - Executar migrações
- `npm run db:migrate:undo` - Desfazer última migração

### Frontend
- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview do build
- `npm run lint` - Análise de código

## 📝 Validações e Regras de Negócio

### Pacientes
- Nome é obrigatório (mínimo 2 caracteres)
- Email único por nutricionista (opcional)
- Telefone formatado automaticamente
- Data de nascimento não pode ser futura
- Idade calculada automaticamente com meses

### Consultas
- Data/hora não pode ser no passado
- Duração mínima de 15 minutos
- Não é possível reagendar consultas finalizadas
- Status controlado por workflow

### Medições
- Data não pode ser futura
- IMC calculado automaticamente
- Valores numéricos validados
- Histórico cronológico

### Planos Alimentares
- Nome obrigatório (2-255 caracteres)
- Pelo menos uma refeição
- Calorias e macros opcionais mas validados
- Apenas um plano ativo por paciente

## 🎯 Casos de Uso Principais

### Para o Nutricionista
1. **Cadastro inicial** de pacientes com dados completos
2. **Agendamento** e gestão de consultas
3. **Acompanhamento** da evolução corporal com gráficos
4. **Criação de planos alimentares** personalizados
5. **Uso da IA** para sugestões de cardápios
6. **Análise de progresso** através de métricas visuais
7. **Busca rápida** de informações de pacientes
8. **Gestão do próprio perfil** profissional

### Fluxo Típico de Trabalho
1. Nutricionista faz login no sistema
2. Visualiza dashboard com resumo do dia
3. Cadastra novo paciente com dados iniciais
4. Agenda primeira consulta
5. Durante/após consulta, registra medições
6. Cria plano alimentar (manual ou com IA)
7. Acompanha evolução através de gráficos
8. Ajusta planos conforme progresso

## 🚀 Tecnologias e Dependências

### Backend Dependencies
- **@google/generative-ai**: Integração com IA do Google
- **bcryptjs**: Criptografia de senhas
- **cors**: Cross-Origin Resource Sharing
- **express**: Framework web
- **helmet**: Headers de segurança
- **jsonwebtoken**: Autenticação JWT
- **mysql2**: Driver MySQL
- **sequelize**: ORM para banco de dados
- **zod**: Validação de schemas

### Frontend Dependencies
- **react**: Biblioteca principal
- **react-router-dom**: Roteamento SPA
- **react-hook-form**: Gestão de formulários
- **framer-motion**: Animações
- **recharts**: Gráficos e visualizações
- **tailwindcss**: Framework CSS
- **lucide-react**: Ícones
- **axios**: Cliente HTTP

## 📈 Métricas e Performance

### Otimizações Implementadas
- **Paginação** em todas as listagens
- **Debounce** nas buscas em tempo real
- **Lazy loading** de componentes pesados
- **Memoização** de cálculos complexos
- **Compressão** de respostas da API
- **Índices** otimizados no banco de dados

### Limites do Sistema
- **Pacientes**: Ilimitados por nutricionista
- **Consultas**: Ilimitadas
- **Medições**: Ilimitadas por paciente
- **Planos**: Ilimitados (1 ativo por paciente)
- **Calorias**: Máximo 5000 por plano
- **Macros**: Limites realistas por nutriente

## 🔄 Atualizações e Manutenção

### Sistema de Migrações
- Controle de versão do banco de dados
- Migrações reversíveis
- Histórico de alterações documentado
- Scripts de manutenção automatizados

### Logs e Monitoramento
- Logs estruturados com Pino
- Rastreamento de erros
- Métricas de performance
- Auditoria de operações críticas

---

## 📞 Suporte e Documentação

Este sistema foi desenvolvido com foco na experiência do usuário e na eficiência do trabalho do nutricionista. Todas as funcionalidades foram pensadas para otimizar o atendimento e acompanhamento de pacientes, proporcionando uma ferramenta profissional e confiável para a prática nutricional.

**Versão**: 1.0.0
**Licença**: MIT
**Desenvolvido em**: 2025
