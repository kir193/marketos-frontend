import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Input,
  Textarea,
  Icon,
  createToaster,
} from "@chakra-ui/react"
import { Toaster } from "@chakra-ui/react"
import { ArrowLeft, ArrowRight, Check, Mic } from "lucide-react"
import { useState, useEffect } from "react"
import { Link, useParams } from "wouter"
import { briefingApi } from "@/lib/api"

const toaster = createToaster({
  placement: "bottom-end",
  pauseOnPageIdle: true,
})

const BLOCKS = [
  { id: 0, title: "Базовая информация", description: "Название, сфера, сайт" },
  { id: 1, title: "Суть бизнеса", description: "Персона и позиционирование" },
  { id: 2, title: "Аудитория", description: "Целевая аудитория" },
  { id: 3, title: "Продукты", description: "Продуктовая линейка" },
  { id: 4, title: "Воронка продаж", description: "Путь клиента" },
  { id: 5, title: "Площадки и каналы", description: "Социальные сети" },
  { id: 6, title: "SEO и GEO", description: "Поисковая оптимизация" },
  { id: 7, title: "Голос бренда", description: "Тон коммуникации" },
  { id: 8, title: "Визуальная идентичность", description: "Фирменный стиль" },
  { id: 9, title: "Источники данных", description: "Материалы для контента" },
  { id: 10, title: "Интеграции", description: "Подключения и API" },
  { id: 11, title: "Настройки публикации", description: "Автопостинг" },
  { id: 12, title: "NDA и конфиденциальность", description: "Юридические данные" }
]

export default function Briefing() {
  const params = useParams()
  const businessId = params.id || "new"
  const [currentBlock, setCurrentBlock] = useState(0)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(false)

  const progress = ((currentBlock + 1) / BLOCKS.length) * 100

  const handleNext = async () => {
    await handleSave()
    if (currentBlock < BLOCKS.length - 1) {
      setCurrentBlock(currentBlock + 1)
    }
  }

  const handlePrev = () => {
    if (currentBlock > 0) {
      setCurrentBlock(currentBlock - 1)
    }
  }

  const handleSave = async () => {
    try {
      setIsLoading(true)
      const businessIdNum = businessId === "new" ? 1 : parseInt(businessId)
      await briefingApi.saveBlock(businessIdNum, currentBlock, formData)
      toaster.create({
        title: "Блок сохранен",
        type: "success",
      })
    } catch (error) {
      console.error("Error saving block:", error)
      toaster.create({
        title: "Ошибка при сохранении",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Загрузка существующего брифинга
  useEffect(() => {
    if (businessId !== "new") {
      const loadBriefing = async () => {
        try {
          const data = await briefingApi.getBriefing(parseInt(businessId))
          if (data && data.length > 0) {
            const loadedData: Record<string, any> = {}
            data.forEach((block: any) => {
              Object.assign(loadedData, block.data)
            })
            setFormData(loadedData)
          }
        } catch (error) {
          console.error("Error loading briefing:", error)
        }
      }
      loadBriefing()
    }
  }, [businessId])

  const updateField = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value })
  }

  return (
    <Box minH="100vh" bg="bg.canvas" color="fg.default">
      <Toaster toaster={toaster}>
        {(toast) => (
          <div>{toast.title}</div>
        )}
      </Toaster>
      
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
            <HStack gap={4}>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <Icon>
                    <ArrowLeft size={16} />
                  </Icon>
                </Button>
              </Link>
              <VStack align="start" gap={0}>
                <Heading fontSize="xl" fontWeight="semibold">
                  Брифинг проекта
                </Heading>
                <Text fontSize="sm" color="fg.muted">
                  Шаг {currentBlock + 1} из {BLOCKS.length}
                </Text>
              </VStack>
            </HStack>
            <Button onClick={handleSave} variant="outline" loading={isLoading}>
              Сохранить
            </Button>
          </Flex>
          <Box mt={4}>
            <Box w="full" h={1} bg="bg.muted" borderRadius="full" overflow="hidden">
              <Box
                h="full"
                w={`${progress}%`}
                bgGradient="to-r"
                gradientFrom="brand.500"
                gradientTo="purple.500"
                transition="all 0.3s"
              />
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxW="4xl" py={8}>
        {/* Stepper */}
        <Box mb={8}>
          <HStack gap={2} overflowX="auto" pb={4}>
            {BLOCKS.map((block, index) => (
              <Button
                key={block.id}
                onClick={() => setCurrentBlock(index)}
                variant={index === currentBlock ? "solid" : index < currentBlock ? "subtle" : "outline"}
                colorPalette={index <= currentBlock ? "brand" : "gray"}
                size="sm"
                flexShrink={0}
              >
                <HStack gap={2}>
                  <Flex
                    w={6}
                    h={6}
                    borderRadius="full"
                    align="center"
                    justify="center"
                    fontSize="xs"
                    fontWeight="medium"
                    bg={index < currentBlock ? "brand.500" : "transparent"}
                  >
                    {index < currentBlock ? <Icon><Check size={16} /></Icon> : index + 1}
                  </Flex>
                  <Text fontSize="sm" fontWeight="medium">
                    {block.title}
                  </Text>
                </HStack>
              </Button>
            ))}
          </HStack>
        </Box>

        {/* Form Card */}
        <Box
          bg="bg.surface/50"
          backdropFilter="blur(8px)"
          borderWidth="1px"
          borderColor="border.default"
          borderRadius="lg"
        >
          <Box p={6} borderBottomWidth="1px" borderColor="border.default">
            <Heading fontSize="xl">{BLOCKS[currentBlock].title}</Heading>
            <Text fontSize="sm" color="fg.muted" mt={1}>
              {BLOCKS[currentBlock].description}
            </Text>
          </Box>
          <Box p={6}>
            <VStack gap={6} align="stretch">
              {/* Block 0: Базовая информация */}
              {currentBlock === 0 && (
                <>
                  <VStack align="stretch" gap={2}>
                    <Text fontSize="sm" fontWeight="medium">Название бизнеса</Text>
                    <Input
                      placeholder="Например: SupaBots"
                      value={formData.businessName || ""}
                      onChange={(e) => updateField("businessName", e.target.value)}
                    />
                  </VStack>
                  <VStack align="stretch" gap={2}>
                    <Text fontSize="sm" fontWeight="medium">Сфера деятельности</Text>
                    <Input
                      placeholder="Например: Wellness & Health"
                      value={formData.industry || ""}
                      onChange={(e) => updateField("industry", e.target.value)}
                    />
                  </VStack>
                  <VStack align="stretch" gap={2}>
                    <Text fontSize="sm" fontWeight="medium">Сайт</Text>
                    <Input
                      type="url"
                      placeholder="https://example.com"
                      value={formData.website || ""}
                      onChange={(e) => updateField("website", e.target.value)}
                    />
                  </VStack>
                  <VStack align="stretch" gap={2}>
                    <Text fontSize="sm" fontWeight="medium">Краткое описание</Text>
                    <Textarea
                      placeholder="Расскажите о вашем бизнесе..."
                      rows={4}
                      value={formData.description || ""}
                      onChange={(e) => updateField("description", e.target.value)}
                    />
                  </VStack>
                  <Box pt={4} borderTopWidth="1px" borderColor="border.default">
                    <Button variant="outline" w="full">
                      <Icon mr={2}>
                        <Mic size={16} />
                      </Icon>
                      Заполнить голосом
                    </Button>
                  </Box>
                </>
              )}

              {/* Block 1: Суть бизнеса */}
              {currentBlock === 1 && (
                <>
                  <VStack align="stretch" gap={2}>
                    <Text fontSize="sm" fontWeight="medium">Персона бренда</Text>
                    <Textarea
                      placeholder="Опишите характер и личность вашего бренда..."
                      rows={4}
                      value={formData.brandPersona || ""}
                      onChange={(e) => updateField("brandPersona", e.target.value)}
                    />
                  </VStack>
                  <VStack align="stretch" gap={2}>
                    <Text fontSize="sm" fontWeight="medium">Позиционирование</Text>
                    <Textarea
                      placeholder="Как вы позиционируете свой бренд на рынке..."
                      rows={4}
                      value={formData.positioning || ""}
                      onChange={(e) => updateField("positioning", e.target.value)}
                    />
                  </VStack>
                  <VStack align="stretch" gap={2}>
                    <Text fontSize="sm" fontWeight="medium">Уникальное торговое предложение (УТП)</Text>
                    <Textarea
                      placeholder="Что делает ваш продукт уникальным..."
                      rows={3}
                      value={formData.usp || ""}
                      onChange={(e) => updateField("usp", e.target.value)}
                    />
                  </VStack>
                </>
              )}

              {/* Block 2: Аудитория */}
              {currentBlock === 2 && (
                <>
                  <VStack align="stretch" gap={2}>
                    <Text fontSize="sm" fontWeight="medium">Целевая аудитория</Text>
                    <Textarea
                      placeholder="Опишите вашу целевую аудиторию (возраст, пол, интересы)..."
                      rows={4}
                      value={formData.targetAudience || ""}
                      onChange={(e) => updateField("targetAudience", e.target.value)}
                    />
                  </VStack>
                  <VStack align="stretch" gap={2}>
                    <Text fontSize="sm" fontWeight="medium">Боли и потребности аудитории</Text>
                    <Textarea
                      placeholder="Какие проблемы решает ваш продукт..."
                      rows={4}
                      value={formData.painPoints || ""}
                      onChange={(e) => updateField("painPoints", e.target.value)}
                    />
                  </VStack>
                  <VStack align="stretch" gap={2}>
                    <Text fontSize="sm" fontWeight="medium">Портрет идеального клиента</Text>
                    <Textarea
                      placeholder="Детальное описание вашего идеального клиента..."
                      rows={4}
                      value={formData.idealCustomer || ""}
                      onChange={(e) => updateField("idealCustomer", e.target.value)}
                    />
                  </VStack>
                </>
              )}

              {/* Other blocks - simplified forms */}
              {currentBlock > 2 && (
                <Box py={12} textAlign="center" color="fg.muted">
                  <Text>Форма для блока "{BLOCKS[currentBlock].title}"</Text>
                  <Text fontSize="sm" mt={2}>
                    Блок {currentBlock + 1} из {BLOCKS.length}
                  </Text>
                  <Text fontSize="xs" mt={4} color="fg.muted">
                    Формы для блоков 3-12 будут добавлены в следующей итерации
                  </Text>
                </Box>
              )}
            </VStack>
          </Box>
        </Box>

        {/* Navigation */}
        <Flex align="center" justify="space-between" mt={6}>
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentBlock === 0}
          >
            <Icon mr={2}>
              <ArrowLeft size={16} />
            </Icon>
            Назад
          </Button>
          <Button
            onClick={handleNext}
            disabled={currentBlock === BLOCKS.length - 1}
            colorPalette="brand"
            loading={isLoading}
          >
            Далее
            <Icon ml={2}>
              <ArrowRight size={16} />
            </Icon>
          </Button>
        </Flex>
      </Container>
    </Box>
  )
}
