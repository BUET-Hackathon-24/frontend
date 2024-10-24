To IMPORT `Aceternity UI` make sure to import cn like this

```javascript
import { cn } from '@utils'
```

Use [next-ui](https://nextui.org) for animated [components](https://nextui.org/docs/components)

In [tailwind.config.js](./tailwind.config.js),
darkMode:
class for select dark mode from classname of html
media for system preference

info on Project structure

# React Project Folder Structure Best Practices

## Root Structure

```
src/
├── assets/
├── components/
├── contexts/
├── features/
├── hooks/
├── layouts/
├── lib/
├── pages/
├── services/
├── styles/
├── types/
├── utils/
└── App.tsx
```

## Detailed Breakdown

### 1. `assets/`

Store static files like images, fonts, and global static resources

```
assets/
├── images/
├── fonts/
└── icons/
```

### 2. `components/`

Reusable UI components, organized by complexity

```
components/
├── common/          # Highly reusable, atomic components
│   ├── Button/
│   ├── Input/
│   └── Card/
├── composite/       # Components composed of multiple common components
│   ├── SearchBar/
│   └── UserCard/
└── index.ts        # Barrel exports
```

### 3. `features/`

Feature-based modules containing domain-specific components and logic

```
features/
├── auth/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── types/
└── dashboard/
    ├── components/
    ├── hooks/
    └── types/
```

### 4. `contexts/`

React Context providers and related logic

```
contexts/
├── AuthContext/
├── ThemeContext/
└── index.ts
```

### 5. `hooks/`

Custom React hooks

```
hooks/
├── useLocalStorage.ts
├── useDebounce.ts
└── index.ts
```

### 6. `layouts/`

Page layout components

```
layouts/
├── MainLayout/
├── DashboardLayout/
└── AuthLayout/
```

### 7. `lib/`

Third-party library configurations

```
lib/
├── axios.ts
└── firebase.ts
```

### 8. `pages/`

Route-level components

```
pages/
├── Home/
├── Dashboard/
└── Profile/
```

### 9. `services/`

API and external service integrations

```
services/
├── api/
│   ├── auth.ts
│   └── users.ts
└── external/
    └── analytics.ts
```

### 10. `styles/`

Global styles and theme configurations

```
styles/
├── theme/
├── global.css
└── variables.css
```

### 11. `types/`

TypeScript type definitions

```
types/
├── common.ts
├── api.ts
└── index.ts
```

### 12. `utils/`

Utility functions and helpers

```
utils/
├── formatting.ts
├── validation.ts
└── testing.ts
```

## Best Practices

1. **Component Organization**

   - Each component should have its own folder
   - Include related files (styles, tests, types) in the component folder
   - Use index.ts for clean exports

2. **Naming Conventions**

   - Use PascalCase for components and their folders
   - Use camelCase for utilities and hooks
   - Use kebab-case for asset files

3. **Module Organization**

   - Use barrel exports (index.ts) to simplify imports
   - Keep related files close together
   - Follow the principle of colocation

4. **File Organization**

```
ComponentName/
├── ComponentName.tsx
├── ComponentName.test.tsx
├── ComponentName.styles.ts
├── ComponentName.types.ts
└── index.ts
```

5. **Import Guidelines**
   - Use absolute imports from the root
   - Avoid deep relative imports (../../)
   - Group imports by type (external, internal, styles)

## Example tsconfig.json Paths

```json
{
  "compilerOptions": {
    "baseUrl": "src",
    "paths": {
      "@components/*": ["components/*"],
      "@features/*": ["features/*"],
      "@hooks/*": ["hooks/*"],
      "@utils/*": ["utils/*"]
    }
  }
}
```
