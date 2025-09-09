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

  ## 📋 Requisitos do Sistema

  ### 🎯 **Requisitos Funcionais (RF)**

  #### **RF01 - Sistema de Autenticação**
  - **RF01.1** - O sistema deve permitir o registro de nutricionistas com nome, email e senha
  - **RF01.2** - O sistema deve validar senhas com mínimo de 8 caracteres
  - **RF01.3** - O sistema deve autenticar usuários com email e senha
  - **RF01.4** - O sistema deve gerar tokens JWT (access + refresh) para sessões
  - **RF01.5** - O sistema deve permitir logout seguro invalidando tokens
  - **RF01.6** - O sistema deve permitir atualização de perfil (nome e senha)
  - **RF01.7** - O sistema deve validar senha atual antes de alteração

  #### **RF02 - Gestão de Pacientes**
  - **RF02.1** - O sistema deve permitir cadastro de pacientes com dados pessoais completos
  - **RF02.2** - O sistema deve validar que email do paciente seja único por nutricionista
  - **RF02.3** - O sistema deve impedir cadastro de paciente com email do próprio nutricionista
  - **RF02.4** - O sistema deve calcular idade automaticamente incluindo meses
  - **RF02.5** - O sistema deve validar que data de nascimento não seja futura
  - **RF02.6** - O sistema deve permitir edição de todos os dados do paciente
  - **RF02.7** - O sistema deve permitir exclusão de pacientes
  - **RF02.8** - O sistema deve listar pacientes com paginação e filtros
  - **RF02.9** - O sistema deve permitir busca por nome, email ou objetivo
  - **RF02.10** - O sistema deve permitir cadastro de alergias e restrições alimentares
  - **RF02.11** - O sistema deve permitir definição de objetivos nutricionais

  #### **RF03 - Sistema de Agendamentos**
  - **RF03.1** - O sistema deve permitir agendamento de consultas com data/hora
  - **RF03.2** - O sistema deve associar consultas a pacientes específicos
  - **RF03.3** - O sistema deve permitir definição de status (agendada, realizada, cancelada)
  - **RF03.4** - O sistema deve permitir reagendamento de consultas não finalizadas
  - **RF03.5** - O sistema deve impedir reagendamento de consultas realizadas
  - **RF03.6** - O sistema deve permitir exclusão de consultas
  - **RF03.7** - O sistema deve listar consultas com filtros por data e status
  - **RF03.8** - O sistema deve permitir adição de observações pós-consulta
  - **RF03.9** - O sistema deve exibir histórico completo de atendimentos

  #### **RF04 - Controle de Medições**
  - **RF04.1** - O sistema deve permitir registro de medições corporais (peso, altura, etc.)
  - **RF04.2** - O sistema deve calcular IMC automaticamente
  - **RF04.3** - O sistema deve validar que data da medição não seja futura
  - **RF04.4** - O sistema deve manter histórico cronológico de medições
  - **RF04.5** - O sistema deve permitir edição e exclusão de medições
  - **RF04.6** - O sistema deve exibir gráficos de evolução das medições
  - **RF04.7** - O sistema deve identificar automaticamente a última medição
  - **RF04.8** - O sistema deve permitir registro de circunferências corporais
  - **RF04.9** - O sistema deve permitir registro de percentual de gordura

  #### **RF05 - Planos Alimentares Inteligentes**
  - **RF05.1** - O sistema deve permitir criação manual de planos alimentares
  - **RF05.2** - O sistema deve integrar IA (Google Gemini) para geração automática
  - **RF05.3** - O sistema deve considerar alergias e restrições na geração por IA
  - **RF05.4** - O sistema deve calcular calorias e macronutrientes automaticamente
  - **RF05.5** - O sistema deve permitir apenas um plano ativo por paciente
  - **RF05.6** - O sistema deve permitir ativação/desativação de planos
  - **RF05.7** - O sistema deve permitir edição completa de planos gerados
  - **RF05.8** - O sistema deve permitir exclusão de planos
  - **RF05.9** - O sistema deve normalizar dados da IA para formato consistente
  - **RF05.10** - O sistema deve ter fallback quando IA não estiver disponível

  #### **RF06 - Dashboard e Analytics**
  - **RF06.1** - O sistema deve exibir métricas em tempo real no dashboard
  - **RF06.2** - O sistema deve contar total de pacientes por nutricionista
  - **RF06.3** - O sistema deve exibir consultas do dia atual
  - **RF06.4** - O sistema deve mostrar atividade recente do sistema
  - **RF06.5** - O sistema deve listar próximas consultas agendadas
  - **RF06.6** - O sistema deve contar total de planos alimentares criados
  - **RF06.7** - O sistema deve exibir estatísticas de uso do consultório

  #### **RF07 - Sistema de Busca Global**
  - **RF07.1** - O sistema deve permitir busca unificada por pacientes e consultas
  - **RF07.2** - O sistema deve implementar busca com debounce (300ms)
  - **RF07.3** - O sistema deve categorizar resultados de busca
  - **RF07.4** - O sistema deve permitir navegação direta aos resultados
  - **RF07.5** - O sistema deve limitar resultados para performance
  - **RF07.6** - O sistema deve buscar por múltiplos campos simultaneamente

  #### **RF08 - Interface e Experiência do Usuário**
  - **RF08.1** - O sistema deve ser responsivo para desktop e mobile
  - **RF08.2** - O sistema deve implementar sistema de notificações (toasts)
  - **RF08.3** - O sistema deve implementar modais de confirmação
  - **RF08.4** - O sistema deve ter animações suaves entre transições
  - **RF08.5** - O sistema deve manter sidebar fixa em desktop
  - **RF08.6** - O sistema deve implementar componentes acessíveis
  - **RF08.7** - O sistema deve validar formulários em tempo real
  - **RF08.8** - O sistema deve mascarar campos de entrada (telefone, etc.)

  ### ⚙️ **Requisitos Não Funcionais (RNF)**

  #### **RNF01 - Segurança**
  - **RNF01.1** - Senhas devem ser criptografadas com bcrypt (salt rounds: 12)
  - **RNF01.2** - Tokens JWT devem ter expiração (access: 15min, refresh: 7 dias)
  - **RNF01.3** - Sistema deve implementar rate limiting (200 req/15min por IP)
  - **RNF01.4** - Headers de segurança devem ser configurados (Helmet)
  - **RNF01.5** - CORS deve ser configurado adequadamente
  - **RNF01.6** - Dados sensíveis devem ser validados e sanitizados
  - **RNF01.7** - Logs de sistema devem ser estruturados e seguros
  - **RNF01.8** - Variáveis de ambiente devem ser protegidas

  #### **RNF02 - Performance**
  - **RNF02.1** - Listagens devem implementar paginação
  - **RNF02.2** - Buscas devem ter debounce para evitar requisições excessivas
  - **RNF02.3** - Componentes pesados devem usar lazy loading
  - **RNF02.4** - Cálculos complexos devem ser memoizados
  - **RNF02.5** - Banco de dados deve ter índices otimizados
  - **RNF02.6** - Respostas da API devem ser comprimidas
  - **RNF02.7** - Frontend deve usar build otimizado (Vite)

  #### **RNF03 - Disponibilidade**
  - **RNF03.1** - Sistema deve ter endpoint de health check
  - **RNF03.2** - Erros devem ser tratados graciosamente
  - **RNF03.3** - Sistema deve ter fallbacks para serviços externos
  - **RNF03.4** - Banco de dados deve ter connection pooling
  - **RNF03.5** - Sistema deve ser tolerante a falhas da IA

  #### **RNF04 - Usabilidade**
  - **RNF04.1** - Interface deve ser intuitiva e moderna
  - **RNF04.2** - Sistema deve fornecer feedback visual imediato
  - **RNF04.3** - Formulários devem ter validação em tempo real
  - **RNF04.4** - Sistema deve ser acessível (WCAG guidelines)
  - **RNF04.5** - Navegação deve ser consistente em todas as páginas
  - **RNF04.6** - Sistema deve funcionar offline para operações básicas

  #### **RNF05 - Escalabilidade**
  - **RNF05.1** - Arquitetura deve suportar múltiplos nutricionistas
  - **RNF05.2** - Banco de dados deve suportar crescimento horizontal
  - **RNF05.3** - API deve ser stateless para balanceamento de carga
  - **RNF05.4** - Sistema deve suportar cache distribuído

  #### **RNF06 - Manutenibilidade**
  - **RNF06.1** - Código deve seguir padrões de clean code
  - **RNF06.2** - Sistema deve ter cobertura de testes adequada
  - **RNF06.3** - Migrações de banco devem ser versionadas
  - **RNF06.4** - Logs devem ser estruturados para análise
  - **RNF06.5** - Documentação deve ser mantida atualizada

  #### **RNF07 - Compatibilidade**
  - **RNF07.1** - Sistema deve funcionar em navegadores modernos
  - **RNF07.2** - API deve seguir padrões REST
  - **RNF07.3** - Frontend deve ser compatível com dispositivos móveis
  - **RNF07.4** - Sistema deve suportar diferentes resoluções de tela

  #### **RNF08 - Integração**
  - **RNF08.1** - Integração com IA deve ter timeout configurado
  - **RNF08.2** - APIs externas devem ter circuit breaker
  - **RNF08.3** - Sistema deve validar dados de APIs externas
  - **RNF08.4** - Integrações devem ter retry automático

  #### **RNF09 - Limites e Capacidade**
  - **RNF09.1** - Upload de arquivos limitado a 1MB
  - **RNF09.2** - Máximo 5000 calorias por plano alimentar
  - **RNF09.3** - Máximo 50 pacientes por página de listagem
  - **RNF09.4** - Busca global limitada a 10 resultados por categoria
  - **RNF09.5** - Sessões JWT com renovação automática

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
