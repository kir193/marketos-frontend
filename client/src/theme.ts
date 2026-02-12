import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "#f0e7ff" },
          100: { value: "#d4bfff" },
          200: { value: "#b794ff" },
          300: { value: "#9a69ff" },
          400: { value: "#7d3eff" },
          500: { value: "#6420e6" },
          600: { value: "#4e19b4" },
          700: { value: "#381282" },
          800: { value: "#220b50" },
          900: { value: "#0c041e" },
        },
      },
    },
    semanticTokens: {
      colors: {
        "bg.canvas": {
          value: {
            base: "#0f0f1a",
            _dark: "#0f0f1a",
          },
        },
        "bg.surface": {
          value: {
            base: "#1a1a2e",
            _dark: "#1a1a2e",
          },
        },
        "bg.muted": {
          value: {
            base: "#252541",
            _dark: "#252541",
          },
        },
      },
    },
  },
})

export const system = createSystem(defaultConfig, config)
