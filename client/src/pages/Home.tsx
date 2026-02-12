// GLOBAL DESIGN RULES: Dark premium #05060A, Inter, glassmorphism cards, cyan→blue→violet gradients

import { Box, Button, Container, Heading, Text, VStack, HStack, SimpleGrid } from '@chakra-ui/react'
import { Link } from 'wouter'
import { Sparkles, Target, Zap } from 'lucide-react'

export default function Home() {
  return (
    <Box minH="100vh" bg="bg.canvas" color="fg.default">
      {/* Hero Section */}
      <Container maxW="7xl" pt="120px" pb="80px">
        <VStack gap="8" textAlign="center">
          <Box
            px="6"
            py="2"
            bg="bg.glass"
            borderWidth="1px"
            borderColor="border.default"
            borderRadius="full"
            backdropFilter="blur(20px)"
          >
            <HStack gap="2">
              <Sparkles size={16} color="#00E5FF" />
              <Text fontSize="caption" color="fg.muted">AI-powered Marketing Platform</Text>
            </HStack>
          </Box>

          <Heading
            fontSize="h1"
            fontWeight="bold"
            lineHeight="1.1"
            bgGradient="linear(to-r, #00E5FF, #2D5BFF, #8A3FFC)"
            bgClip="text"
          >
            Marketos
          </Heading>

          <Text fontSize="h3" color="fg.muted" maxW="2xl">
            Автоматизируйте маркетинг с помощью AI.
            <br />
            От брифинга до публикации — всё в одной платформе.
          </Text>

          <HStack gap="4" mt="8">
            <Link href="/dashboard">
              <Button
                size="lg"
                px="8"
                py="6"
                fontSize="body"
                bgGradient="linear(to-r, #00E5FF, #2D5BFF)"
                color="white"
                borderRadius="card"
                _hover={{ transform: 'translateY(-2px)', shadow: '0 20px 40px rgba(0, 229, 255, 0.3)' }}
                transition="all 0.3s"
              >
                Начать работу →
              </Button>
            </Link>
            <Button
              size="lg"
              px="8"
              py="6"
              fontSize="body"
              bg="bg.glass"
              color="fg.default"
              borderWidth="1px"
              borderColor="border.default"
              borderRadius="card"
              backdropFilter="blur(20px)"
              _hover={{ bg: 'rgba(255, 255, 255, 0.05)' }}
            >
              Узнать больше
            </Button>
          </HStack>
        </VStack>
      </Container>

      {/* Features Section */}
      <Container maxW="7xl" py="80px">
        <VStack gap="16">
          <Heading fontSize="h2" fontWeight="semibold" textAlign="center">
            Всё что нужно для маркетинга
          </Heading>

          <SimpleGrid columns={{ base: 1, md: 3 }} gap="6" w="full">
            {[
              {
                icon: Target,
                title: 'Умный брифинг',
                description: 'AI анализирует ваш бизнес и создаёт персонализированную стратегию контента',
                gradient: 'linear(to-br, #00E5FF, #2D5BFF)',
              },
              {
                icon: Sparkles,
                title: 'Генерация контента',
                description: 'Автоматическое создание постов, изображений и видео для всех платформ',
                gradient: 'linear(to-br, #2D5BFF, #8A3FFC)',
              },
              {
                icon: Zap,
                title: 'Мультиканальная публикация',
                description: 'Публикуйте контент одновременно в 7+ социальных сетей',
                gradient: 'linear(to-br, #8A3FFC, #FF4FD8)',
              },
            ].map((feature, i) => (
              <Box
                key={i}
                p="8"
                bg="bg.glass"
                borderWidth="1px"
                borderColor="border.default"
                borderRadius="cardLg"
                backdropFilter="blur(30px)"
                position="relative"
                overflow="hidden"
                _hover={{ borderColor: 'border.solid', transform: 'translateY(-4px)' }}
                transition="all 0.3s"
              >
                <Box
                  position="absolute"
                  top="0"
                  left="0"
                  w="full"
                  h="2px"
                  bgGradient={feature.gradient}
                />
                <VStack align="start" gap="4">
                  <Box
                    p="3"
                    bg="bg.card"
                    borderRadius="card"
                    borderWidth="1px"
                    borderColor="border.solid"
                  >
                    <feature.icon size={24} color="#00E5FF" />
                  </Box>
                  <Heading fontSize="h3" fontWeight="semibold">
                    {feature.title}
                  </Heading>
                  <Text fontSize="body" color="fg.muted" lineHeight="1.6">
                    {feature.description}
                  </Text>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  )
}
