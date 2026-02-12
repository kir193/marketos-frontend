// GLOBAL DESIGN RULES: Dark premium #05060A, Inter, glassmorphism cards, cyan→blue→violet gradients

import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Input,
  Textarea,
  createToaster,
  Toaster,
} from "@chakra-ui/react"
import { ArrowLeft, ArrowRight, Check, Mic } from "lucide-react"
import { useState } from "react"
import { Link } from "wouter"

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
  const [currentBlock, setCurrentBlock] = useState(0)
  const [formData, setFormData] = useState<Record<string, any>>({})

  const progress = ((currentBlock + 1) / BLOCKS.length) * 100

  const handleSave = () => {
    toaster.create({
      title: "Блок сохранен",
      type: "success",
    })
  }

  return (
    <Box minH="100vh" bg="bg.canvas" color="fg.default">
      <Toaster toaster={toaster}>
        {(toast) => <Box>{toast.title}</Box>}
      </Toaster>

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
            <VStack align="start" gap="1">
              <Heading fontSize="h3" fontWeight="semibold">Брифинг проекта</Heading>
              <Text fontSize="caption" color="fg.muted">Шаг {currentBlock + 1} из {BLOCKS.length}</Text>
            </VStack>
            <Button
              bgGradient="linear(to-r, #00E5FF, #2D5BFF)"
              color="white"
              borderRadius="card"
              px="6"
              onClick={handleSave}
              _hover={{ transform: 'translateY(-1px)' }}
            >
              Сохранить
            </Button>
          </HStack>

          {/* Progress Bar */}
          <Box mt="4">
            <Box position="relative" h="2" bg="bg.card" borderRadius="full" overflow="hidden">
              <Box
                position="absolute"
                top="0"
                left="0"
                h="full"
                w={`${progress}%`}
                bgGradient="linear(to-r, #00E5FF, #2D5BFF, #8A3FFC)"
                borderRadius="full"
                transition="all 0.3s"
              />
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxW="7xl" py="8">
        <HStack align="start" gap="8">
          {/* Sidebar - Blocks Navigator */}
          <Box
            w="280px"
            p="6"
            bg="bg.glass"
            borderWidth="1px"
            borderColor="border.default"
            borderRadius="cardLg"
            backdropFilter="blur(30px)"
            position="sticky"
            top="120px"
            maxH="calc(100vh - 140px)"
            overflowY="auto"
          >
            <VStack align="stretch" gap="2">
              {BLOCKS.map((block) => (
                <Button
                  key={block.id}
                  onClick={() => setCurrentBlock(block.id)}
                  variant="ghost"
                  justifyContent="start"
                  p="3"
                  borderRadius="card"
                  bg={currentBlock === block.id ? 'bg.card' : 'transparent'}
                  borderWidth={currentBlock === block.id ? '1px' : '0'}
                  borderColor="border.solid"
                  _hover={{ bg: 'bg.card' }}
                >
                  <HStack w="full" gap="3">
                    <Box
                      w="6"
                      h="6"
                      borderRadius="full"
                      bg={currentBlock === block.id ? 'linear-gradient(135deg, #00E5FF, #2D5BFF)' : 'bg.card'}
                      borderWidth="1px"
                      borderColor="border.solid"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontSize="caption"
                      fontWeight="medium"
                    >
                      {block.id + 1}
                    </Box>
                    <VStack align="start" gap="0" flex="1">
                      <Text fontSize="caption" fontWeight="medium" color="fg.default">
                        {block.title}
                      </Text>
                      <Text fontSize="xs" color="fg.muted">
                        {block.description}
                      </Text>
                    </VStack>
                  </HStack>
                </Button>
              ))}
            </VStack>
          </Box>

          {/* Main Form */}
          <Box flex="1">
            <Box
              p="8"
              bg="bg.glass"
              borderWidth="1px"
              borderColor="border.default"
              borderRadius="cardLg"
              backdropFilter="blur(30px)"
            >
              <VStack align="stretch" gap="6">
                <VStack align="start" gap="2">
                  <Heading fontSize="h3" fontWeight="semibold">
                    {BLOCKS[currentBlock].title}
                  </Heading>
                  <Text fontSize="body" color="fg.muted">
                    {BLOCKS[currentBlock].description}
                  </Text>
                </VStack>

                {/* Block 0: Basic Info */}
                {currentBlock === 0 && (
                  <VStack align="stretch" gap="4">
                    <Box>
                      <Text fontSize="caption" fontWeight="medium" mb="2" color="fg.default">
                        Название бизнеса
                      </Text>
                      <Input
                        placeholder="Например: SupaBots"
                        bg="bg.card"
                        borderColor="border.solid"
                        borderRadius="card"
                        _focus={{ borderColor: '#00E5FF' }}
                      />
                    </Box>
                    <Box>
                      <Text fontSize="caption" fontWeight="medium" mb="2" color="fg.default">
                        Сфера деятельности
                      </Text>
                      <Input
                        placeholder="Например: Wellness & Health"
                        bg="bg.card"
                        borderColor="border.solid"
                        borderRadius="card"
                        _focus={{ borderColor: '#00E5FF' }}
                      />
                    </Box>
                    <Box>
                      <Text fontSize="caption" fontWeight="medium" mb="2" color="fg.default">
                        Сайт
                      </Text>
                      <Input
                        type="url"
                        placeholder="https://example.com"
                        bg="bg.card"
                        borderColor="border.solid"
                        borderRadius="card"
                        _focus={{ borderColor: '#00E5FF' }}
                      />
                    </Box>
                    <Box>
                      <Text fontSize="caption" fontWeight="medium" mb="2" color="fg.default">
                        Краткое описание
                      </Text>
                      <Textarea
                        placeholder="Расскажите о вашем бизнесе..."
                        rows={4}
                        bg="bg.card"
                        borderColor="border.solid"
                        borderRadius="card"
                        _focus={{ borderColor: '#00E5FF' }}
                      />
                    </Box>
                  </VStack>
                )}

                {/* Other blocks - placeholder */}
                {currentBlock > 0 && (
                  <Box p="8" textAlign="center" color="fg.muted">
                    <Text>Форма для блока {currentBlock + 1} будет добавлена</Text>
                  </Box>
                )}

                {/* Voice Input Button */}
                <Button
                  variant="outline"
                  borderColor="border.default"
                  color="fg.default"
                  borderRadius="card"
                  _hover={{ bg: 'bg.card', borderColor: '#00E5FF' }}
                >
                  <HStack gap="2">
                    <Mic size={16} />
                    <Text>Заполнить голосом</Text>
                  </HStack>
                </Button>

                {/* Navigation */}
                <HStack justify="space-between" pt="4">
                  <Button
                    variant="ghost"
                    disabled={currentBlock === 0}
                    onClick={() => setCurrentBlock(currentBlock - 1)}
                    color="fg.muted"
                    _hover={{ color: 'fg.default', bg: 'bg.card' }}
                  >
                    <HStack gap="2">
                      <ArrowLeft size={16} />
                      <Text>Назад</Text>
                    </HStack>
                  </Button>
                  <Button
                    bgGradient="linear(to-r, #00E5FF, #2D5BFF)"
                    color="white"
                    borderRadius="card"
                    onClick={() => {
                      if (currentBlock < BLOCKS.length - 1) {
                        setCurrentBlock(currentBlock + 1)
                      }
                    }}
                    _hover={{ transform: 'translateY(-1px)' }}
                  >
                    <HStack gap="2">
                      <Text>{currentBlock === BLOCKS.length - 1 ? 'Завершить' : 'Далее'}</Text>
                      {currentBlock === BLOCKS.length - 1 ? <Check size={16} /> : <ArrowRight size={16} />}
                    </HStack>
                  </Button>
                </HStack>
              </VStack>
            </Box>
          </Box>
        </HStack>
      </Container>
    </Box>
  )
}
