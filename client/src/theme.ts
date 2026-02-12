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
          500: { value: "#6420aa" },
          600: { value: "#4e19b4" },
          700: { value: "#381282" },
          800: { value: "#220b50" },
          900: { value: "#0c041e" },
        },
      },
      fonts: {
        heading: { value: "'Space Grotesk', sans-serif" },
        body: { value: "'Inter', sans-serif" },
      },
    },
    semanticTokens: {
      colors: {
        "bg.canvas": {
          value: {
            base: "#ffffff",
            _dark: "#0f0f1a",
          },
        },
        "bg.surface": {
          value: {
            base: "#f7f7f7",
            _dark: "#1a1a2e",
          },
        },
        "bg.muted": {
          value: {
            base: "#e7e7e7",
            _dark: "#252541",
          },
        },
        "fg.default": {
          value: {
            base: "#1a1a1a",
            _dark: "#e7e7e7",
          },
        },
        "fg.muted": {
          value: {
            base: "#666666",
            _dark: "#a0a0a0",
          },
        },
        "border.default": {
          value: {
            base: "#e0e0e0",
            _dark: "#2a2a3e",
          },
        },
      },
    },
  },
})

export const system = createSystem(defaultConfig, config)
