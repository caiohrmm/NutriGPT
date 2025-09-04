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

  ## 🛠️ Stack Utilizada

  - **Node.js**: `>=18`
  - **Linguagem**: JavaScript
  - **Framework**: Express
  - **ORM**: Sequelize
  - **Banco de Dados**: MySQL
  - **Autenticação**: JWT (Access + Refresh) + bcrypt
  - **Validação de dados**: Zod
  - **Armazenamento de arquivos**: Local / S3 (MinIO)
  - **Documentação da API**: Gemini (YAML) + Postman Collection

  ---

  ## 📌 Funcionalidades Principais

  - 📅 **Agendamento de consultas**
  - 👨‍⚕️ **Gestão de pacientes** (dados pessoais, restrições, objetivos)
  - 🥗 **Planos alimentares gerados por IA**, com edição manual pelo nutricionista
  - 📂 **Armazenamento seguro de documentos e relatórios**
  - 🔑 **Autenticação com JWT** (access + refresh)
  - 🧩 **API bem estruturada com documentação YAML e coleção Postman**

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

  **Modo desenvolvimento (ambos simultaneamente):**
  ```bash
  npm run dev
  ```

  **Ou execute separadamente:**

  **Backend:**
  ```bash
  npm run server
  ```

  **Frontend:**
  ```bash
  npm run client
  ```

  ### **6. Acesse o sistema**

  - **Frontend:** http://localhost:5173
  - **Backend API:** http://localhost:3000

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

  ## 🔒 Segurança

  ### **Implementado:**
  - ✅ **JWT** com access e refresh tokens
  - ✅ **bcrypt** para hash de senhas
  - ✅ **Middleware** de autenticação em rotas protegidas
  - ✅ **Rate limiting** para prevenir ataques
  - ✅ **Validação** rigorosa de dados com Zod
  - ✅ **CORS** configurado adequadamente
  - ✅ **Sanitização** de entradas

  ### **Boas Práticas:**
  - ✅ Senhas com mínimo de 8 caracteres
  - ✅ Tokens JWT com expiração
  - ✅ Validação de datas (não permitir datas futuras)
  - ✅ Controle de unicidade por nutricionista
