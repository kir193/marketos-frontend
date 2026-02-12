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
import { Plus, Briefcase, TrendingUp, FileText, Share2 } from "lucide-react"
import { Link } from "wouter"

export default function Dashboard() {
  const projects = [
    {
      id: 1,
      name: "SupaBots — Ортопедические подушки",
      progress: 85,
      status: "active",
      lastUpdated: "2 часа назад"
    }
  ]

  const stats = [
    { label: "Проектов", value: "1", icon: Briefcase, trend: "+0%" },
    { label: "Артефактов", value: "12", icon: FileText, trend: "+25%" },
    { label: "Публикаций", value: "48", icon: Share2, trend: "+12%" },
    { label: "Охват", value: "24.5K", icon: TrendingUp, trend: "+18%" }
  ]

  return (
    <Box minH="100vh" bg="bg.canvas" color="fg.default">
      {/* Header */}
      <Box
        borderBottomWidth="1px"
        borderColor="border.default"
        bg="bg.surface/50"
        backdropFilter="blur(8px)"
        position="sticky"
        top={0}
        zIndex={10}
      >
        <Container maxW="7xl" py={4}>
          <Flex align="center" justify="space-between">
            <VStack align="start" gap={0.5}>
              <Heading
                fontSize="2xl"
                fontWeight="bold"
                bgGradient="to-r"
                gradientFrom="brand.400"
                gradientTo="purple.400"
                bgClip="text"
                fontFamily="heading"
              >
                Marketos
              </Heading>
              <Text fontSize="sm" color="fg.muted">
                AI Marketing Platform
              </Text>
            </VStack>
            <Link href="/briefing/new">
              <Button size="lg" colorPalette="brand">
                <Icon mr={2}>
                  <Plus size={16} />
                </Icon>
                Новый проект
              </Button>
            </Link>
          </Flex>
        </Container>
      </Box>

      <Container maxW="7xl" py={8}>
        {/* Stats */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={4} mb={8}>
          {stats.map((stat) => (
            <Box
              key={stat.label}
              bg="bg.surface/50"
              backdropFilter="blur(8px)"
              borderWidth="1px"
              borderColor="border.default"
              borderRadius="lg"
              p={6}
            >
              <Flex align="center" justify="space-between">
                <VStack align="start" gap={1}>
                  <Text fontSize="sm" color="fg.muted">
                    {stat.label}
                  </Text>
                  <Text fontSize="3xl" fontWeight="bold">
                    {stat.value}
                  </Text>
                  <Text fontSize="xs" color="green.500">
                    {stat.trend}
                  </Text>
                </VStack>
                <Flex
                  w={12}
                  h={12}
                  borderRadius="lg"
                  bg="brand.500/10"
                  align="center"
                  justify="center"
                >
                  <Icon color="brand.400">
                    <stat.icon size={24} />
                  </Icon>
                </Flex>
              </Flex>
            </Box>
          ))}
        </SimpleGrid>

        {/* Projects */}
        <VStack align="stretch" gap={4}>
          <Flex align="center" justify="space-between" mb={4}>
            <Heading fontSize="xl" fontWeight="semibold">
              Мои проекты
            </Heading>
          </Flex>
          
          {projects.map((project) => (
            <Box
              key={project.id}
              bg="bg.surface/50"
              backdropFilter="blur(8px)"
              borderWidth="1px"
              borderColor="border.default"
              borderRadius="lg"
              _hover={{ borderColor: "brand.500/50" }}
              transition="all 0.2s"
              cursor="pointer"
            >
              <Box p={6} borderBottomWidth="1px" borderColor="border.default">
                <Flex align="start" justify="space-between">
                  <VStack align="start" gap={1}>
                    <Heading fontSize="lg">{project.name}</Heading>
                    <Text fontSize="sm" color="fg.muted">
                      Обновлено {project.lastUpdated}
                    </Text>
                  </VStack>
                  <HStack gap={2}>
                    <Link href={`/briefing/${project.id}`}>
                      <Button variant="outline" size="sm">
                        Открыть
                      </Button>
                    </Link>
                  </HStack>
                </Flex>
              </Box>
              <Box p={6}>
                <VStack align="stretch" gap={2}>
                  <Flex align="center" justify="space-between" fontSize="sm">
                    <Text color="fg.muted">Прогресс брифинга</Text>
                    <Text fontWeight="medium">{project.progress}%</Text>
                  </Flex>
                  <Box position="relative">
                    <Box
                      w="full"
                      h={2}
                      bg="bg.muted"
                      borderRadius="full"
                      overflow="hidden"
                    >
                      <Box
                        h="full"
                        w={`${project.progress}%`}
                        bgGradient="to-r"
                        gradientFrom="brand.500"
                        gradientTo="purple.500"
                        transition="all 0.3s"
                      />
                    </Box>
                  </Box>
                </VStack>
              </Box>
            </Box>
          ))}
        </VStack>
      </Container>
    </Box>
  )
}
