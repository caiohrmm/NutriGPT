# 🥗 NutriGPT CRM

  **NutriGPT** é um sistema **CRM especializado para nutricionistas**, desenvolvido para simplificar e automatizar a gestão de pacientes, consultas e planos alimentares. O sistema combina funcionalidades de controle clínico com recursos de **Inteligência Artificial** para auxiliar o nutricionista na criação de planos personalizados, relatórios e no acompanhamento da evolução dos pacientes.

  ---

  ## 🚀 Objetivo do Sistema

  - Organizar pacientes e consultas em uma plataforma única.
  - Gerar planos alimentares **com apoio da IA**, permitindo que o nutricionista edite e valide antes de entregar ao paciente.
  - Facilitar a gestão da agenda de atendimentos.
  - Centralizar documentos e relatórios de pacientes.
  - Melhorar a experiência do nutricionista e do paciente com um sistema moderno e acessível.

  ---

  ## 🛠️ Tecnologias

### **Backend**
- **Node.js** `>=18` - Runtime JavaScript
- **Express.js** `4.19.2` - Framework web
- **Sequelize** `6.37.3` - ORM para banco de dados
- **MySQL2** `3.11.0` - Driver MySQL
- **JWT** `9.0.2` - Autenticação com tokens
- **bcryptjs** `2.4.3` - Hash de senhas
- **Zod** `3.23.8` - Validação de dados
- **Google Generative AI** `0.20.0` - Integração com IA
- **Express Rate Limit** `7.1.5` - Rate limiting
- **Helmet** `7.1.0` - Segurança HTTP
- **CORS** `2.8.5` - Controle de acesso
- **Pino** `9.2.0` - Sistema de logs

### **Frontend**
- **React** `19.1.1` - Biblioteca de interface
- **Vite** `7.1.2` - Build tool e dev server
- **React Router DOM** `7.8.2` - Roteamento
- **React Hook Form** `7.62.0` - Gerenciamento de formulários
- **Zod** `4.1.5` - Validação do lado cliente
- **Tailwind CSS** `3.4.17` - Framework CSS
- **Recharts** `3.1.2` - Gráficos e visualizações
- **Framer Motion** `12.23.12` - Animações
- **Axios** `1.11.0` - Cliente HTTP
- **Lucide React** `0.542.0` - Ícones
- **Radix UI** - Componentes acessíveis
- **TanStack Query** `5.85.9` - Gerenciamento de estado server

### **Ferramentas de Desenvolvimento**
- **Sequelize CLI** `6.6.2` - Migrações e seeders
- **Nodemon** `3.1.4` - Hot reload no desenvolvimento
- **ESLint** `9.33.0` - Linting de código
- **PostCSS** `8.5.6` - Processamento CSS
- **Autoprefixer** `10.4.21` - Prefixos CSS automáticos

  ---

  ## ✨ Funcionalidades Implementadas

  ### 🔐 **Sistema de Autenticação**
  - ✅ Login e registro de nutricionistas
  - ✅ JWT com access e refresh tokens
  - ✅ Middleware de autenticação
  - ✅ Rate limiting para segurança
  - ✅ Atualização de perfil (nome e senha)

  ### 👥 **Gestão Completa de Pacientes**
  - ✅ CRUD completo de pacientes
  - ✅ Dados pessoais (nome, email, telefone, nascimento)
  - ✅ Informações nutricionais (objetivo, alergias, observações)
  - ✅ Cálculo automático de idade com meses
  - ✅ Validação de dados (datas futuras, emails únicos por nutricionista)
  - ✅ Busca e filtros por objetivo
  - ✅ Prevenção de cadastro com email do próprio nutricionista

  ### 📅 **Sistema de Agendamentos**
  - ✅ CRUD completo de consultas
  - ✅ Status de consultas (agendada, realizada, cancelada)
  - ✅ Reagendamento de consultas
  - ✅ Prevenção de reagendamento de consultas finalizadas
  - ✅ Exclusão de consultas
  - ✅ Histórico completo de atendimentos

  ### 📏 **Controle de Medições e Métricas**
  - ✅ Registro de peso, altura, gordura corporal, massa muscular
  - ✅ Cálculo automático de IMC
  - ✅ Histórico completo de medições
  - ✅ Gráficos profissionais de evolução (Recharts)
  - ✅ Validação de datas (não permite datas futuras)
  - ✅ Visualização de dados da última medição

  ### 🍽️ **Planos Alimentares Inteligentes**
  - ✅ Criação manual de planos
  - ✅ **Geração automática com IA (Google Gemini)**
  - ✅ Consideração de alergias e restrições
  - ✅ Cálculo de calorias e macronutrientes
  - ✅ Sistema de planos ativos/inativos
  - ✅ Edição e exclusão de planos
  - ✅ Normalização inteligente de dados da IA

  ### 📊 **Dashboard e Analytics**
  - ✅ Métricas em tempo real
  - ✅ Total de pacientes e consultas
  - ✅ Consultas do dia
  - ✅ Atividade recente
  - ✅ Estatísticas do consultório
  - ✅ Gráficos de evolução dos pacientes

  ### 🔍 **Sistema de Busca Global**
  - ✅ Busca unificada por pacientes e consultas
  - ✅ Navegação rápida entre páginas
  - ✅ Filtros inteligentes
  - ✅ Integração com URLs para navegação direta

  ### 🎨 **Interface e UX**
  - ✅ Design moderno com Tailwind CSS
  - ✅ Componentes reutilizáveis (Radix UI)
  - ✅ Sistema de toasts personalizado
  - ✅ Modais de confirmação
  - ✅ Animações suaves (Framer Motion)
  - ✅ Layout responsivo
  - ✅ Sidebar fixa com scroll independente

  ---

  ## 📊 Diagramas do Sistema

  ### 🗄️ Diagrama MER (Modelo Entidade-Relacionamento)

  ```mermaid
  erDiagram
      NUTRITIONIST {
          int id PK
          string fullName
          string email UK
          string password
          string crn
          datetime createdAt
          datetime updatedAt
      }
      
      PATIENT {
          int id PK
          string fullName
          string email
          string phone
          date birthDate
          string gender
          string goal
          text allergies
          text notes
          int nutritionistId FK
          datetime createdAt
          datetime updatedAt
      }
      
      APPOINTMENT {
          int id PK
          datetime dateTime
          string status
          text notes
          int patientId FK
          int nutritionistId FK
          datetime createdAt
          datetime updatedAt
      }
      
      MEASUREMENT {
          int id PK
          float weight
          float height
          float bodyFat
          float muscleMass
          float bmi
          date date
          text notes
          int patientId FK
          datetime createdAt
          datetime updatedAt
      }
      
      PLAN {
          int id PK
          string name
          text description
          int totalCalories
          boolean isActive
          boolean aiGenerated
          int patientId FK
          datetime createdAt
          datetime updatedAt
      }
      
      MEAL {
          int id PK
          string time
          string title
          json items
          int calories
          int planId FK
          datetime createdAt
          datetime updatedAt
      }
      
      MACROS {
          int id PK
          int protein
          int carbs
          int fats
          int mealId FK
          datetime createdAt
          datetime updatedAt
      }
      
      %% Relacionamentos
      NUTRITIONIST ||--o{ PATIENT : "1:N"
      NUTRITIONIST ||--o{ APPOINTMENT : "1:N"
      PATIENT ||--o{ APPOINTMENT : "1:N"
      PATIENT ||--o{ MEASUREMENT : "1:N"
      PATIENT ||--o{ PLAN : "1:N"
      PLAN ||--o{ MEAL : "1:N"
      MEAL ||--|| MACROS : "1:1"
      
      %% Índices e Constraints
      PATIENT ||--|| NUTRITIONIST : "email unique per nutritionist"
      PLAN ||--|| PATIENT : "only one active plan per patient"
  ```

  ### 📋 Diagrama de Classes

  ```mermaid
  classDiagram
      class Nutritionist {
          +Long id
          +String fullName
          +String email
          +String password
          +String crn
          +Date createdAt
          +Date updatedAt
          +login()
          +updateProfile()
          +changePassword()
          +getPatients()
          +getAppointments()
      }
      
      class Patient {
          +Long id
          +String fullName
          +String email
          +String phone
          +Date birthDate
          +String gender
          +String goal
          +String allergies
          +String notes
          +Long nutritionistId
          +Date createdAt
          +Date updatedAt
          +calculateAge()
          +getLatestMeasurement()
          +getMeasurementHistory()
          +getActivePlan()
      }
      
      class Appointment {
          +Long id
          +Date dateTime
          +String status
          +String notes
          +Long patientId
          +Long nutritionistId
          +Date createdAt
          +Date updatedAt
          +reschedule()
          +cancel()
          +complete()
      }
      
      class Measurement {
          +Long id
          +Float weight
          +Float height
          +Float bodyFat
          +Float muscleMass
          +Float bmi
          +Date date
          +String notes
          +Long patientId
          +Date createdAt
          +Date updatedAt
          +calculateBMI()
          +getEvolutionData()
      }
      
      class Plan {
          +Long id
          +String name
          +String description
          +Integer totalCalories
          +Boolean isActive
          +Boolean aiGenerated
          +Long patientId
          +Date createdAt
          +Date updatedAt
          +activate()
          +deactivate()
          +calculateTotalCalories()
      }
      
      class Meal {
          +Long id
          +String time
          +String title
          +String[] items
          +Integer calories
          +Long planId
          +getMacros()
          +addItem()
          +removeItem()
      }
      
      class Macros {
          +Integer protein
          +Integer carbs
          +Integer fats
          +calculate()
          +getPercentages()
      }
      
      %% Relacionamentos
      Nutritionist "1" --> "*" Patient : manages
      Nutritionist "1" --> "*" Appointment : schedules
      Patient "1" --> "*" Appointment : attends
      Patient "1" --> "*" Measurement : has
      Patient "1" --> "*" Plan : follows
      Plan "1" --> "*" Meal : contains
      Meal "1" --> "1" Macros : has
  ```

  ### 🏗️ Diagrama de Arquitetura

  ```mermaid
  flowchart TD
      subgraph Frontend["🖥️ Frontend - React"]
          UI[Interface do Usuário]
          Components[Componentes Reutilizáveis]
          State[Gerenciamento de Estado]
          Router[Roteamento]
      end
      
      subgraph Communication["📡 Comunicação"]
          HTTP[HTTP/REST]
          JWT[Autenticação JWT]
      end
      
      subgraph Backend["⚙️ Backend - Node.js/Express"]
          API[API REST]
          Auth[Autenticação]
          Validation[Validação Zod]
          AIService[Serviço de IA]
      end
      
      subgraph Persistence["💾 Persistência"]
          MySQL[(MySQL Database)]
          Sequelize[Sequelize ORM]
          Migrations[Migrações]
      end
      
      subgraph Storage["📁 Armazenamento"]
          FileSystem[Sistema de Arquivos]
          Uploads[Upload de Arquivos]
      end
      
      subgraph External["🌐 Serviços Externos"]
          Gemini[Google Gemini API]
      end
      
      Frontend --> Communication
      Communication --> Backend
      Backend --> Persistence
      Backend --> Storage
      Backend --> External
      
      classDef frontend fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
      classDef backend fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
      classDef database fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
      classDef external fill:#fff3e0,stroke:#f57c00,stroke-width:2px
      
      class Frontend,UI,Components,State,Router frontend
      class Backend,API,Auth,Validation,AIService backend
      class Persistence,MySQL,Sequelize,Migrations database
      class External,Gemini external
  ```

  ### 👤 Diagrama de Casos de Uso

  ```mermaid
  flowchart LR
      %% Ator Principal
      N[👨‍⚕️<br/>NUTRICIONISTA]
      
      %% Grupos de Funcionalidades
      subgraph AUTH[🔐 AUTENTICAÇÃO]
          L[Fazer Login]
          R[Registrar-se]
          P[Atualizar Perfil]
          S[Alterar Senha]
          O[Logout]
      end
      
      subgraph PAT[👥 PACIENTES]
          PC[Cadastrar Paciente]
          PL[Listar Pacientes]
          PV[Ver Detalhes]
          PE[Editar Paciente]
          PD[Excluir Paciente]
          PF[Filtrar por Objetivo]
      end
      
      subgraph CONS[📅 CONSULTAS]
          CA[Agendar Consulta]
          CL[Listar Consultas]
          CR[Reagendar]
          CC[Cancelar]
          CF[Finalizar]
          CD[Excluir]
      end
      
      subgraph MED[📏 MEDIÇÕES]
          MR[Registrar Medição]
          MH[Ver Histórico]
          ME[Editar Medição]
          MD[Excluir Medição]
          MI[Calcular IMC]
          MG[Ver Gráficos]
      end
      
      subgraph PLAN[🍽️ PLANOS]
          PM[Criar Plano Manual]
          PA[Gerar com IA]
          PV2[Ver Planos]
          PE2[Editar Plano]
          PD2[Excluir Plano]
          PAT2[Ativar/Desativar]
      end
      
      subgraph DASH[📊 DASHBOARD]
          DV[Ver Dashboard]
          DM[Métricas do Dia]
          DA[Atividade Recente]
          DE[Estatísticas]
          DG[Gráficos]
      end
      
      subgraph SEARCH[🔍 BUSCA]
          SG[Busca Global]
          SF[Filtrar Resultados]
          SN[Navegação Rápida]
      end
      
      %% Sistemas Externos
      AI[🤖<br/>SISTEMA IA]
      DB[🗄️<br/>BANCO DADOS]
      
      %% Relacionamentos Principais
      N --> AUTH
      N --> PAT
      N --> CONS
      N --> MED
      N --> PLAN
      N --> DASH
      N --> SEARCH
      
      %% Relacionamentos com Sistemas
      AI --> PA
      DB --> MI
      DB --> L
      
      %% Relacionamentos Internos
      PA -.-> PM
      MR --> MI
      PV --> MG
      PC --> PV
      
      %% Estilos
      classDef actor fill:#e1f5fe,stroke:#0277bd,stroke-width:3px,color:#000,font-weight:bold
      classDef system fill:#e8f5e8,stroke:#4caf50,stroke-width:3px,color:#000,font-weight:bold
      classDef usecase fill:#fff9c4,stroke:#f57f17,stroke-width:1px,color:#000
      
      %% Aplicar estilos
      class N,AI,DB actor
      class L,R,P,S,O,PC,PL,PV,PE,PD,PF,CA,CL,CR,CC,CF,CD,MR,MH,ME,MD,MI,MG,PM,PA,PV2,PE2,PD2,PAT2,DV,DM,DA,DE,DG,SG,SF,SN usecase
  ```

  ---

  ## 📁 Estrutura do Projeto

  ```
  nutrigpt/
  ├── 📁 src/                           # Backend
  │   ├── 📁 middleware/               # Middlewares (auth, logger)
  │   ├── 📁 models/                   # Modelos Sequelize
  │   ├── 📁 routes/                   # Rotas da API
  │   │   ├── auth.routes.js          # Autenticação
  │   │   ├── patient.routes.js       # Pacientes
  │   │   ├── appointment.routes.js   # Consultas
  │   │   ├── measurement.routes.js   # Medições
  │   │   └── plan.routes.js          # Planos alimentares
  │   ├── 📁 utils/                    # Utilitários
  │   │   ├── ai.js                   # Integração IA
  │   │   ├── jwt.js                  # JWT helpers
  │   │   ├── password.js             # Hash de senhas
  │   │   └── logger.js               # Sistema de logs
  │   ├── 📁 migrations/              # Migrações do banco
  │   └── server.js                   # Servidor principal
  ├── 📁 frontend/                     # Frontend React
  │   ├── 📁 src/
  │   │   ├── 📁 components/          # Componentes React
  │   │   │   ├── 📁 appointments/    # Componentes de consultas
  │   │   │   ├── 📁 layout/          # Layout (Header, Sidebar, etc)
  │   │   │   ├── 📁 patients/        # Componentes de pacientes
  │   │   │   └── 📁 ui/              # Componentes de UI base
  │   │   ├── 📁 pages/               # Páginas da aplicação
  │   │   ├── 📁 hooks/               # Hooks customizados
  │   │   ├── 📁 utils/               # Utilitários (dateUtils, etc)
  │   │   ├── 📁 lib/                 # API client, configurações
  │   │   ├── 📁 context/             # Contexts (AuthContext)
  │   │   └── 📁 layouts/             # Layouts da aplicação
  │   ├── index.html                  # HTML principal
  │   └── vite.config.js              # Configuração Vite
  ├── 📄 documentacao.md              # Documentação completa
  ├── 📄 diagramamer.mmd              # Diagrama MER
  ├── 📄 diagramadeclasses.mmd        # Diagrama de classes
  ├── 📄 diagramadearquitetura.mmd    # Diagrama de arquitetura
  ├── 📄 diagramacasosdeuso.mmd       # Diagrama de casos de uso
  ├── 📄 package.json                 # Dependências backend
  ├── 📄 sequelize.config.js          # Configuração Sequelize
  └── 📄 .env                         # Variáveis de ambiente
  ```

  ---

  ## 📈 Roadmap (Próximas Features)

  ### ✅ **Concluído**
  - [x] Sistema de autenticação completo
  - [x] CRUD de pacientes com validações
  - [x] CRUD de consultas e agendamentos  
  - [x] Sistema de medições com gráficos
  - [x] Planos alimentares com IA
  - [x] Dashboard com métricas em tempo real
  - [x] Busca global no sistema

  ### 🚧 **Em Desenvolvimento**
  - [ ] Exportação de planos em PDF
  - [ ] Portal do paciente (visualização do plano e histórico)
  - [ ] Notificações por email

  ### 📋 **Próximas Features**
  - [ ] Integração com WhatsApp
  - [ ] App mobile (React Native)
  - [ ] Sistema de lembretes

  ---

  ## 🚀 Instalação e Configuração

  ### **Pré-requisitos**
  - Node.js >= 18
  - MySQL >= 8.0
  - npm ou yarn

  ### **1. Clone o repositório**
  ```bash
  git clone https://github.com/seu-usuario/nutrigpt.git
  cd nutrigpt
  ```

  ### **2. Instale as dependências**

  **Backend:**
  ```bash
  npm install
  ```

  **Frontend:**
  ```bash
  cd frontend
  npm install
  cd ..
  ```

  ### **3. Configuração do ambiente**

  Crie um arquivo `.env` na raiz do projeto:

  ```env
  # Banco de dados
  DB_HOST=localhost
  DB_PORT=3306
  DB_NAME=nutrigpt
  DB_USER=root
  DB_PASS=sua_senha

  # JWT
  JWT_SECRET=seu_jwt_secret_muito_seguro
  JWT_REFRESH_SECRET=seu_refresh_secret_muito_seguro

  # IA (Google Gemini)
  GEMINI_API_KEY=sua_chave_api_gemini

  # Servidor
  PORT=3000
  NODE_ENV=development
  ```

  ### **4. Configure o banco de dados**

  ```bash
  # Criar banco de dados
  npm run db:create

  # Executar migrações
  npm run db:migrate

  # (Opcional) Executar seeders
  npm run db:seed
  ```

  ### **5. Execute o sistema**

  **Backend (API):**
  ```bash
  npm run dev
  ```

  **Frontend (Interface):**
  ```bash
  cd frontend
  npm run dev
  cd ..
  ```

  **Ou em terminais separados:**

  **Terminal 1 - Backend:**
  ```bash
  npm run dev
  ```

  **Terminal 2 - Frontend:**
  ```bash
  cd frontend && npm run dev
  ```

  ### **6. Acesse o sistema**

  - **Frontend:** http://localhost:5173
  - **Backend API:** http://localhost:3000

  ---

  ## 🚀 API Endpoints

  ### **Autenticação**
  ```
  POST /api/auth/register     # Registro de nutricionista
  POST /api/auth/login        # Login
  POST /api/auth/refresh      # Renovar tokens
  POST /api/auth/logout       # Logout
  PUT  /api/auth/me           # Atualizar perfil
  ```

  ### **Pacientes**
  ```
  GET    /api/patients        # Listar pacientes
  POST   /api/patients        # Criar paciente
  GET    /api/patients/:id    # Obter paciente
  PUT    /api/patients/:id    # Atualizar paciente
  DELETE /api/patients/:id    # Excluir paciente
  ```

  ### **Consultas**
  ```
  GET    /api/appointments           # Listar consultas
  POST   /api/appointments           # Criar consulta
  GET    /api/appointments/:id       # Obter consulta
  PUT    /api/appointments/:id       # Atualizar consulta
  DELETE /api/appointments/:id       # Excluir consulta
  ```

  ### **Medições**
  ```
  GET    /api/measurements               # Listar medições
  POST   /api/measurements               # Criar medição
  GET    /api/measurements/:id           # Obter medição
  PUT    /api/measurements/:id           # Atualizar medição
  DELETE /api/measurements/:id           # Excluir medição
  GET    /api/measurements/patient/:id   # Medições por paciente
  ```

  ### **Planos Alimentares**
  ```
  GET    /api/plans                    # Listar planos
  POST   /api/plans                    # Criar plano
  GET    /api/plans/:id                # Obter plano
  PUT    /api/plans/:id                # Atualizar plano
  DELETE /api/plans/:id                # Excluir plano
  PATCH  /api/plans/:id/toggle-active  # Ativar/desativar plano
  POST   /api/plans/generate           # Gerar plano com IA
  GET    /api/plans/patient/:id        # Planos por paciente
  ```

  ### **Busca Global**
  ```
  GET    /api/search/global?q=termo    # Busca global no sistema
  ```

  ---

  ## 📚 Documentação Adicional

  - 📖 **[Documentação Técnica Completa](./documentacao.md)**
  - 🗄️ **[Diagrama MER - Banco de Dados](./diagramamer.mmd)**
  - 🏗️ **[Diagrama de Classes](./diagramadeclasses.mmd)**
  - 🔄 **[Diagrama de Arquitetura](./diagramadearquitetura.mmd)**
  - 👤 **[Diagrama de Casos de Uso](./diagramacasosdeuso.mmd)**

  ### **Como visualizar os diagramas Mermaid:**

  1. **GitHub/GitLab**: Os diagramas são renderizados automaticamente
  2. **VS Code**: Use a extensão "Mermaid Preview"
  3. **Mermaid Live Editor**: Cole o código em [mermaid.live](https://mermaid.live)
  4. **Exportar PNG**: Use `mmdc -i arquivo.mmd -o arquivo.png`

  ---

  ## 🤖 Integração com IA

  ### **Google Gemini API**

  O sistema utiliza a API do Google Gemini para gerar sugestões de planos alimentares:

  **Funcionalidades:**
  - ✅ Geração baseada no perfil do paciente
  - ✅ Consideração de alergias e restrições
  - ✅ Cálculo automático de calorias e macros
  - ✅ Sugestões personalizadas por objetivo
  - ✅ Fallback para planos padrão

  **Como obter a chave da API:**
  1. Acesse [Google AI Studio](https://makersuite.google.com/app/apikey)
  2. Crie uma nova chave de API
  3. Adicione no arquivo `.env` como `GEMINI_API_KEY`

  ---

  ## 🔒 Segurança e Validações

  ### **Autenticação e Autorização**
  - ✅ **JWT duplo**: Access token (15min) + Refresh token (7 dias)
  - ✅ **bcryptjs**: Hash seguro de senhas (salt rounds: 12)
  - ✅ **Middleware de autenticação**: Proteção de rotas sensíveis
  - ✅ **Rate limiting**: 100 requests por 15 minutos por IP
  - ✅ **Helmet**: Headers de segurança HTTP
  - ✅ **CORS**: Controle de origem configurado

  ### **Validação de Dados**
  - ✅ **Zod schemas**: Validação tanto no frontend quanto backend
  - ✅ **Sanitização**: Prevenção de XSS e injection
  - ✅ **Validação de datas**: Não permite datas futuras para nascimento/medições
  - ✅ **Unicidade controlada**: Email único por nutricionista (não global)
  - ✅ **Prevenção de autoregistro**: Nutricionista não pode cadastrar paciente com próprio email

  ### **Logging e Monitoramento**
  - ✅ **Pino logger**: Sistema de logs estruturado
  - ✅ **Request logging**: Rastreamento de requisições
  - ✅ **Error handling**: Tratamento centralizado de erros
  - ✅ **Environment variables**: Configurações sensíveis protegidas

  ### **Validações de Negócio**
  - ✅ **Senhas**: Mínimo 8 caracteres obrigatório
  - ✅ **Datas de nascimento**: Não podem ser futuras
  - ✅ **Datas de medição**: Limitadas até hoje
  - ✅ **Reagendamento**: Bloqueado para consultas finalizadas
  - ✅ **Planos ativos**: Apenas um por paciente
  - ✅ **Calorias e macros**: Valores mínimos e máximos definidos
