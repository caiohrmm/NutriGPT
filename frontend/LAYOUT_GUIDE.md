# 🎨 NutriGPT Layout System - Guia de Uso

## 📁 Estrutura de Componentes

```
src/
├── layouts/
│   └── DashboardLayout.jsx      # Layout principal com sidebar
├── components/
│   ├── layout/
│   │   ├── Sidebar.jsx          # Menu lateral com navegação
│   │   ├── Header.jsx           # Cabeçalho com busca e notificações
│   │   └── Footer.jsx           # Rodapé com branding
│   └── ui/
│       └── nutrigpt-logo.jsx    # Logo e marca d'água
└── pages/
    ├── DashboardPage.jsx        # Página inicial
    ├── PatientsPage.jsx         # Gerenciar pacientes
    ├── AppointmentsPage.jsx     # Agenda de consultas
    └── ProfilePage.jsx          # Perfil do usuário
```

## 🎨 Paleta de Cores

### Cores Principais
- **Primary**: `hsl(142.1 70.6% 45.3%)` - Verde principal
- **Secondary**: `hsl(142.1 76.2% 96.3%)` - Verde claro
- **Background**: `hsl(0 0% 100%)` - Branco

### Cores Personalizadas NutriGPT
- `nutrigpt-50`: Verde muito claro
- `nutrigpt-100`: Verde claro
- `nutrigpt-200`: Verde médio claro
- `nutrigpt-500`: Verde principal
- `nutrigpt-600`: Verde escuro
- `nutrigpt-700`: Verde muito escuro

## 🚀 Como Usar o Layout

### 1. Criando uma Nova Página

```jsx
import { DashboardLayout } from '../layouts/DashboardLayout'

export function MinhaNovaPage() {
  return (
    <DashboardLayout title="Título da Página">
      <div className="space-y-6">
        {/* Seu conteúdo aqui */}
      </div>
    </DashboardLayout>
  )
}
```

### 2. Adicionando Nova Rota no Sidebar

Edite `src/components/layout/Sidebar.jsx`:

```jsx
const navigation = [
  // ... rotas existentes
  {
    name: 'Nova Seção',
    href: '/nova-secao',
    icon: IconeDoLucide,
  },
]
```

### 3. Registrando Nova Rota

Edite `src/App.jsx`:

```jsx
<Route
  path="/nova-secao"
  element={
    <PrivateRoute>
      <MinhaNovaPage />
    </PrivateRoute>
  }
/>
```

## 🎯 Recursos do Layout

### ✅ Sidebar Responsiva
- **Desktop**: Sempre visível (320px de largura)
- **Mobile**: Colapsável com overlay
- **Animações**: Transições suaves com Framer Motion

### ✅ Header Inteligente
- **Logo mobile**: Aparece quando sidebar está fechada
- **Busca global**: Campo de pesquisa centralizado
- **Notificações**: Badge com contador
- **Perfil do usuário**: Avatar e informações

### ✅ Footer com Branding
- **Logo**: Marca NutriGPT
- **Copyright**: Ano atual automático
- **Versão**: Controle de versão do sistema

### ✅ Marca d'Água
- **Logo sutil**: Fundo discreto em todas as páginas
- **Opacity baixa**: Não interfere no conteúdo
- **Posicionamento fixo**: Centralizado na tela

## 🎨 Componentes de UI Disponíveis

### NutriGPTLogo
```jsx
import { NutriGPTLogo } from '../components/ui/nutrigpt-logo'

// Uso básico
<NutriGPTLogo size={32} />

// Com classes personalizadas
<NutriGPTLogo size={48} className="text-primary" />
```

### NutriGPTWatermark
```jsx
import { NutriGPTWatermark } from '../components/ui/nutrigpt-logo'

// Marca d'água de fundo
<NutriGPTWatermark />
```

## 📱 Responsividade

### Breakpoints TailwindCSS
- **sm**: 640px+
- **md**: 768px+
- **lg**: 1024px+ (sidebar sempre visível)
- **xl**: 1280px+

### Comportamento Mobile
- Sidebar colapsável com botão de menu
- Header adaptado para telas pequenas
- Cards e grids responsivos
- Texto e espaçamentos otimizados

## 🎭 Animações

### Framer Motion
- **Sidebar**: Slide in/out suave
- **Páginas**: Fade in com delay
- **Cards**: Hover effects
- **Transições**: Spring physics

### Classes de Animação
```jsx
// Entrada de página
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
```

## 🔧 Customização

### Alterando Cores
Edite `src/index.css` e `tailwind.config.js`:

```css
:root {
  --primary: 142.1 70.6% 45.3%; /* Seu verde personalizado */
}
```

### Modificando Layout
- **Sidebar width**: Altere em `DashboardLayout.jsx`
- **Header height**: Modifique classes `h-16`
- **Espaçamentos**: Ajuste `space-y-*` e `p-*`

## 🎯 Boas Práticas

### 1. Estrutura de Página
```jsx
<DashboardLayout title="Página">
  <div className="space-y-6">
    {/* Header da página */}
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold">Título</h2>
        <p className="text-gray-600">Descrição</p>
      </div>
      <Button>Ação Principal</Button>
    </div>

    {/* Conteúdo principal */}
    <Card>
      {/* Seu conteúdo */}
    </Card>
  </div>
</DashboardLayout>
```

### 2. Estados Vazios
Use o padrão das páginas existentes:
- Ícone grande centralizado
- Título descritivo
- Texto explicativo
- Botão de ação principal

### 3. Loading States
```jsx
{loading ? (
  <div className="animate-pulse">
    {/* Skeleton loading */}
  </div>
) : (
  <div>
    {/* Conteúdo real */}
  </div>
)}
```

## 🚀 Próximos Passos

1. **Adicionar novas páginas** usando o `DashboardLayout`
2. **Personalizar cores** se necessário
3. **Implementar funcionalidades** específicas
4. **Adicionar mais componentes** de UI conforme necessário

---

**✨ O layout está pronto para ser usado como base para todo o sistema NutriGPT!**
