// GLOBAL DESIGN RULES: Dark premium #05060A, Inter, glassmorphism cards, cyan→blue→violet gradients

import { Box, Button, Container, Heading, Text, VStack, HStack, SimpleGrid } from '@chakra-ui/react'
import { Link } from 'wouter'
import { TrendingUp, Users, FileText, Zap } from 'lucide-react'

export default function Dashboard() {
  const stats = [
    { label: 'Активные проекты', value: '3', change: '+12%', icon: FileText, color: '#00E5FF' },
    { label: 'Публикаций', value: '127', change: '+23%', icon: Zap, color: '#2D5BFF' },
    { label: 'Охват', value: '45.2K', change: '+18%', icon: Users, color: '#8A3FFC' },
    { label: 'Конверсия', value: '3.8%', change: '+0.4%', icon: TrendingUp, color: '#FF4FD8' },
  ]

  return (
    <Box minH="100vh" bg="bg.canvas" color="fg.default">
      {/* Header */}
      <Box
        borderBottomWidth="1px"
        borderColor="border.default"
        backdropFilter="blur(20px)"
        bg="rgba(5, 6, 10, 0.8)"
        position="sticky"
        top="0"
        zIndex="10"
      >
        <Container maxW="7xl" py="4">
          <HStack justify="space-between">
            <Heading fontSize="h3" fontWeight="semibold">Dashboard</Heading>
            <Link href="/briefing">
              <Button
                bgGradient="linear(to-r, #00E5FF, #2D5BFF)"
                color="white"
                borderRadius="card"
                px="6"
                _hover={{ transform: 'translateY(-1px)' }}
              >
                Новый проект
              </Button>
            </Link>
          </HStack>
        </Container>
      </Box>

      <Container maxW="7xl" py="12">
        <VStack gap="8" align="stretch">
          {/* Stats Grid */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap="6">
            {stats.map((stat, i) => (
              <Box
                key={i}
                p="6"
                bg="bg.glass"
                borderWidth="1px"
                borderColor="border.default"
                borderRadius="cardLg"
                backdropFilter="blur(30px)"
                position="relative"
                overflow="hidden"
              >
                <Box
                  position="absolute"
                  top="0"
                  left="0"
                  w="full"
                  h="2px"
                  bg={stat.color}
                />
                <VStack align="start" gap="3">
                  <HStack justify="space-between" w="full">
                    <Box p="2" bg="bg.card" borderRadius="card" borderWidth="1px" borderColor="border.solid">
                      <stat.icon size={20} color={stat.color} />
                    </Box>
                    <Text fontSize="caption" color="#00E5FF" fontWeight="medium">
                      {stat.change}
                    </Text>
                  </HStack>
                  <Text fontSize="caption" color="fg.muted">{stat.label}</Text>
                  <Heading fontSize="h2" fontWeight="bold">{stat.value}</Heading>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>

          {/* Project Card */}
          <Box
            p="8"
            bg="bg.glass"
            borderWidth="1px"
            borderColor="border.default"
            borderRadius="cardLg"
            backdropFilter="blur(30px)"
          >
            <VStack align="stretch" gap="6">
              <HStack justify="space-between">
                <VStack align="start" gap="2">
                  <Heading fontSize="h3" fontWeight="semibold">Проект "Eco Store"</Heading>
                  <Text fontSize="body" color="fg.muted">Онлайн магазин эко-товаров</Text>
                </VStack>
                <Link href="/briefing">
                  <Button
                    variant="outline"
                    borderColor="border.default"
                    color="fg.default"
                    borderRadius="card"
                    _hover={{ bg: 'bg.card' }}
                  >
                    Открыть
                  </Button>
                </Link>
              </HStack>

              <Box>
                <HStack justify="space-between" mb="2">
                  <Text fontSize="caption" color="fg.muted">Прогресс брифинга</Text>
                  <Text fontSize="caption" fontWeight="medium" color="fg.default">85%</Text>
                </HStack>
                <Box position="relative" h="2" bg="bg.card" borderRadius="full" overflow="hidden">
                  <Box
                    position="absolute"
                    top="0"
                    left="0"
                    h="full"
                    w="85%"
                    bgGradient="linear(to-r, #00E5FF, #2D5BFF, #8A3FFC)"
                    borderRadius="full"
                  />
                </Box>
              </Box>

              <SimpleGrid columns={{ base: 1, md: 3 }} gap="4">
                {[
                  { label: 'Брифинг', value: '11/13' },
                  { label: 'Контент', value: '24 поста' },
                  { label: 'Публикации', value: '18 шт' },
                ].map((item, i) => (
                  <Box key={i} p="4" bg="bg.card" borderRadius="card" borderWidth="1px" borderColor="border.solid">
                    <Text fontSize="caption" color="fg.muted" mb="1">{item.label}</Text>
                    <Text fontSize="body" fontWeight="semibold">{item.value}</Text>
                  </Box>
                ))}
              </SimpleGrid>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  )
}
