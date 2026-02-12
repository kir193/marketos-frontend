import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

// GLOBAL DESIGN RULES
// Background: #05060A
// Typography: Inter (geometric sans-serif)
// Text: primary #FFFFFF, secondary #B7C0D1
// Accents: cyan #00E5FF, blue #2D5BFF, violet #8A3FFC, magenta #FF4FD8
// Cards: glassmorphism with blur, thin stroke
// Style: calm, enterprise, high-tech, minimal, premium

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          bg: { value: "#05060A" },
          card: { value: "#0B0E17" },
          glass: { value: "rgba(255, 255, 255, 0.03)" },
          stroke: { value: "rgba(255, 255, 255, 0.08)" },
          strokeSolid: { value: "rgba(255, 255, 255, 0.06)" },
          text: {
            primary: { value: "#FFFFFF" },
            secondary: { value: "#B7C0D1" },
          },
          accent: {
            cyan: { value: "#00E5FF" },
            blue: { value: "#2D5BFF" },
            violet: { value: "#8A3FFC" },
            magenta: { value: "#FF4FD8" },
          },
        },
      },
      fonts: {
        heading: { value: "Inter, system-ui, sans-serif" },
        body: { value: "Inter, system-ui, sans-serif" },
      },
      fontSizes: {
        h1: { value: "72px" },
        h2: { value: "48px" },
        h3: { value: "28px" },
        body: { value: "18px" },
        caption: { value: "14px" },
      },
      radii: {
        card: { value: "20px" },
        cardLg: { value: "24px" },
      },
    },
    semanticTokens: {
      colors: {
        "bg.canvas": {
          value: { base: "#05060A", _dark: "#05060A" },
        },
        "bg.card": {
          value: { base: "#0B0E17", _dark: "#0B0E17" },
        },
        "bg.glass": {
          value: { base: "rgba(255, 255, 255, 0.03)", _dark: "rgba(255, 255, 255, 0.03)" },
        },
        "fg.default": {
          value: { base: "#FFFFFF", _dark: "#FFFFFF" },
        },
        "fg.muted": {
          value: { base: "#B7C0D1", _dark: "#B7C0D1" },
        },
        "border.default": {
          value: { base: "rgba(255, 255, 255, 0.08)", _dark: "rgba(255, 255, 255, 0.08)" },
        },
        "border.solid": {
          value: { base: "rgba(255, 255, 255, 0.06)", _dark: "rgba(255, 255, 255, 0.06)" },
        },
      },
    },
  },
})

export const system = createSystem(defaultConfig, config)
