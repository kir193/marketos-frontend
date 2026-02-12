import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Icon,
} from "@chakra-ui/react"
import { ArrowRight, Sparkles, Zap, Target, TrendingUp } from "lucide-react"
import { Link } from "wouter"

export default function Home() {
  const features = [
    {
      icon: Sparkles,
      title: "AI-брифинг",
      description: "Интеллектуальный сбор информации о бизнесе с поддержкой голосового ввода"
    },
    {
      icon: Zap,
      title: "Автогенерация контента",
      description: "Создание контент-планов, постов и визуалов на основе брифинга"
    },
    {
      icon: Target,
      title: "Мультиканальность",
      description: "Публикация в 7+ социальных сетей одновременно"
    },
    {
      icon: TrendingUp,
      title: "Аналитика",
      description: "Отслеживание эффективности контента и охвата аудитории"
    }
  ]

  return (
    <Box minH="100vh" bg="bg.canvas" color="fg.default">
      {/* Hero */}
      <Box position="relative" overflow="hidden">
        {/* Gradient background */}
        <Box
          position="absolute"
          inset="0"
          bgGradient="to-br"
          gradientFrom="brand.500/20"
          gradientVia="purple.500/10"
          gradientTo="transparent"
        />
        
        <Container maxW="7xl" position="relative" py={{ base: 24, md: 32 }}>
          <VStack gap={6} maxW="3xl" mx="auto" textAlign="center">
            <HStack
              gap={2}
              px={4}
              py={2}
              borderRadius="full"
              bg="brand.500/10"
              borderWidth="1px"
              borderColor="brand.500/20"
            >
              <Icon color="brand.400">
                <Sparkles size={16} />
              </Icon>
              <Text fontSize="sm" fontWeight="medium" color="brand.400">
                AI-powered Marketing Platform
              </Text>
            </HStack>
            
            <Heading
              fontSize={{ base: "5xl", md: "6xl", lg: "7xl" }}
              fontWeight="bold"
              fontFamily="heading"
              bgGradient="to-r"
              gradientFrom="fg.default"
              gradientVia="fg.default"
              gradientTo="fg.muted"
              bgClip="text"
            >
              Marketos
            </Heading>
            
            <Text fontSize={{ base: "xl", md: "2xl" }} color="fg.muted" lineHeight="relaxed">
              Автоматизируйте маркетинг с помощью AI.
              <br />
              От брифинга до публикации — всё в одной платформе.
            </Text>
            
            <HStack gap={4} flexDir={{ base: "column", sm: "row" }}>
              <Link href="/dashboard">
                <Button size="lg" colorPalette="brand" fontSize="lg" px={8}>
                  Начать работу
                  <Icon ml={2}>
                    <ArrowRight size={20} />
                  </Icon>
                </Button>
              </Link>
              <Button size="lg" variant="outline" fontSize="lg" px={8}>
                Узнать больше
              </Button>
            </HStack>
          </VStack>
        </Container>
      </Box>

      {/* Features */}
      <Box py={20} bg="bg.surface/30">
        <Container maxW="7xl">
          <VStack gap={12} mb={12} textAlign="center">
            <Heading
              fontSize={{ base: "3xl", md: "4xl" }}
              fontWeight="bold"
              fontFamily="heading"
            >
              Всё что нужно для маркетинга
            </Heading>
            <Text fontSize="lg" color="fg.muted">
              Комплексное решение для управления контентом и публикациями
            </Text>
          </VStack>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6}>
            {features.map((feature, index) => (
              <Box
                key={index}
                bg="bg.surface/50"
                backdropFilter="blur(8px)"
                borderWidth="1px"
                borderColor="border.default"
                borderRadius="lg"
                p={6}
                transition="all 0.2s"
                _hover={{ borderColor: "brand.500/50", transform: "translateY(-2px)" }}
              >
                <VStack align="start" gap={4}>
                  <Flex
                    w={12}
                    h={12}
                    borderRadius="lg"
                    bg="brand.500/10"
                    align="center"
                    justify="center"
                  >
                    <Icon color="brand.400">
                      <feature.icon size={24} />
                    </Icon>
                  </Flex>
                  <Heading fontSize="lg" fontWeight="semibold">
                    {feature.title}
                  </Heading>
                  <Text fontSize="sm" color="fg.muted" lineHeight="relaxed">
                    {feature.description}
                  </Text>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* CTA */}
      <Box py={20}>
        <Container maxW="7xl">
          <Box
            bgGradient="to-r"
            gradientFrom="brand.500/10"
            gradientVia="purple.500/10"
            gradientTo="brand.500/10"
            borderWidth="1px"
            borderColor="brand.500/20"
            borderRadius="lg"
            p={12}
            textAlign="center"
          >
            <VStack gap={8}>
              <Heading
                fontSize={{ base: "3xl", md: "4xl" }}
                fontWeight="bold"
                fontFamily="heading"
              >
                Готовы начать?
              </Heading>
              <Text fontSize="lg" color="fg.muted" maxW="2xl" mx="auto">
                Создайте свой первый проект и убедитесь, как AI может трансформировать ваш маркетинг
              </Text>
              <Link href="/dashboard">
                <Button size="lg" colorPalette="brand" fontSize="lg" px={8}>
                  Создать проект
                  <Icon ml={2}>
                    <ArrowRight size={20} />
                  </Icon>
                </Button>
              </Link>
            </VStack>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}
