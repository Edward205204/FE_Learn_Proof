import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettierConfig from 'eslint-config-prettier' // Import bản config xóa bỏ xung đột
import prettierPlugin from 'eslint-plugin-prettier' // Import plugin để chạy prettier như 1 rule

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Tích hợp Prettier
  {
    plugins: {
      prettier: prettierPlugin
    },
    rules: {
      'prettier/prettier': [
        'warn',
        {
          arrowParens: 'always',
          semi: false,
          trailingComma: 'none',
          tabWidth: 2,
          endOfLine: 'auto',
          useTabs: false,
          singleQuote: true,
          printWidth: 120,
          jsxSingleQuote: true
        }
      ]
    }
  },
  prettierConfig, // Quan trọng: Phải nằm cuối cùng
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts'])
])

export default eslintConfig
