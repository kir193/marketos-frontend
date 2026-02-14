import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import {
  Block3Form,
  Block4Form,
  Block5Form,
  Block6Form,
  Block7Form,
  Block8Form,
  Block9Form,
  Block10Form,
  Block11Form,
  Block12Form
} from '@/components/BriefingBlocks'
import { Mic, ChevronLeft, ChevronRight, Save, ArrowLeft, Sparkles } from "lucide-react"
import { useLocation } from "wouter"
import { briefingApi, businessApi } from "@/lib/api"

// Типы данных
interface BriefingData {
  [key: string]: any
}

const BLOCKS = [
  { id: 0, title: "Тип бизнеса" },
  { id: 1, title: "Суть бизнеса" },
  { id: 2, title: "Аудитория" },
  { id: 3, title: "Продукты и деньги" },
  { id: 4, title: "Воронка продаж" },
  { id: 5, title: "Каналы и площадки" },
  { id: 6, title: "SEO + GEO" },
  { id: 7, title: "Конкуренты и тренды" },
  { id: 8, title: "Доказательства" },
  { id: 9, title: "Контент-модель" },
  { id: 10, title: "Визуал и дизайн" },
  { id: 11, title: "Интеграции" },
  { id: 12, title: "Реквизиты" },
]

export default function Briefing() {
  const [location, navigate] = useLocation()
  const [currentBlock, setCurrentBlock] = useState(0)
  const [formData, setFormData] = useState<BriefingData>({})
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [showAiModal, setShowAiModal] = useState(false)
  const [aiContext, setAiContext] = useState("")
  const [showBulkAiModal, setShowBulkAiModal] = useState(false)
  const [bulkAiContext, setBulkAiContext] = useState("")
  const [bulkAiProgress, setBulkAiProgress] = useState<{[key: number]: 'pending' | 'loading' | 'success' | 'error'}>({})
  const [showAiReport, setShowAiReport] = useState(false)
  const [aiReport, setAiReport] = useState<{success: number[], partial: number[], failed: number[]}>({success: [], partial: [], failed: []})
  const [businessId, setBusinessId] = useState<number | null>(null)
  const [businessName, setBusinessName] = useState<string>("")

  useEffect(() => {
    loadBriefing()
  }, [])

  const loadBriefing = async () => {
    // Получаем ID из URL
    const pathParts = location.split('/')
    const idFromUrl = pathParts[pathParts.length - 1]
    
    if (idFromUrl && idFromUrl !== 'new') {
      const id = parseInt(idFromUrl)
      if (!isNaN(id)) {
        setBusinessId(id)
        try {
          const business = await businessApi.getById(id)
          setBusinessName(business.name)
          
          // Загружаем данные из brief поля
          if (business.brief) {
            // Преобразуем brief в formData формат
            const loadedData: BriefingData = {}
            Object.keys(business.brief).forEach(key => {
              if (key.startsWith('block_')) {
                const blockNum = parseInt(key.replace('block_', ''))
                loadedData[blockNum] = business.brief[key]
              }
            })
            setFormData(loadedData)
          }
        } catch (error: any) {
          console.error("Failed to load briefing:", error)
          if (error.response?.status === 404 || error.response?.status === 500) {
            setFormData({})
          } else {
            toast.error("Ошибка загрузки брифинга")
          }
        }
      }
    }
  }

  const saveBlock = async () => {
    setLoading(true)
    try {
      let currentBusinessId = businessId
      
      // Если это новый брифинг (нет businessId), создаем Business
      if (!currentBusinessId) {
        const block0Data = formData[0] || {}
        const block12Data = formData[12] || {}
        // Приоритет: companyName из блока 12 > brandName из блока 0 > "Новый проект"
        const name = block12Data.companyName || block0Data.brandName || businessName || "Новый проект"
        
        const newBusiness = await businessApi.create({ name })
        currentBusinessId = newBusiness.id
        setBusinessId(currentBusinessId)
        setBusinessName(name)
        
        // Обновляем URL
        navigate(`/briefing/${currentBusinessId}`, { replace: true })
      }
      
      if (currentBusinessId) {
        await briefingApi.saveBlock(currentBusinessId, currentBlock, formData[currentBlock] || {})
        toast.success("Блок сохранен!")
      }
    } catch (error) {
      console.error("Save error:", error)
      toast.error("Ошибка сохранения")
    } finally {
      setLoading(false)
    }
  }

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [currentBlock]: {
        ...prev[currentBlock],
        [field]: value
      }
    }))
  }

  // Расчет процента заполнения блока
  const calculateBlockCompletion = (blockData: any): number => {
    if (!blockData || Object.keys(blockData).length === 0) return 0
    
    const values = Object.values(blockData)
    const filledCount = values.filter(val => {
      if (Array.isArray(val)) return val.length > 0
      if (typeof val === 'string') return val.trim().length > 0
      if (typeof val === 'object' && val !== null) return Object.keys(val).length > 0
      return val !== null && val !== undefined && val !== ''
    }).length
    
    return values.length > 0 ? Math.round((filledCount / values.length) * 100) : 0
  }

  // Получить иконку статуса блока
  const getBlockStatusIcon = (blockId: number): string => {
    const bulkStatus = bulkAiProgress[blockId]
    if (bulkStatus === 'loading') return '⏳'
    if (bulkStatus === 'error') return '❌'
    
    const blockData = formData[blockId]
    if (!blockData) return ''
    
    // Проверяем реальную заполненность, игнорируя плейсхолдеры
    const values = Object.entries(blockData).filter(([key, value]) => {
      if (!value) return false
      const strValue = String(value)
      // Игнорируем плейсхолдеры
      if (strValue.includes('Опишите') || strValue.includes('Например') || 
          strValue.includes('...') || strValue.includes('https://competitor') ||
          strValue.includes('Выберите')) return false
      return true
    })
    
    const totalFields = Object.keys(blockData).length
    const filledFields = values.length
    
    if (filledFields === 0) return ''
    if (filledFields === totalFields) return '✅'
    return '⚠️'
  }

  // Маппинг AI ответов к значениям формы
  const normalizeAiData = (aiData: any, blockNumber: number) => {
    const normalized = { ...aiData }
    
    if (blockNumber === 0) {
      // Маппинг типов бизнеса
      const businessTypeMap: Record<string, string> = {
        'E-commerce': 'ecom',
        'Ecommerce': 'ecom',
        'E-Commerce': 'ecom',
        'Эксперт': 'expert',
        'Expert': 'expert',
        'Услуги': 'services',
        'Services': 'services',
        'SaaS': 'saas',
        'Другое': 'other',
        'Other': 'other'
      }
      
      // Маппинг типов бренда
      const brandTypeMap: Record<string, string> = {
        'Личный бренд': 'personal',
        'Personal': 'personal',
        'Компания': 'company',
        'Company': 'company'
      }
      
      // Маппинг целей
      const goalsMap: Record<string, string> = {
        'Лиды': 'leads',
        'Leads': 'leads',
        'Продажи': 'sales',
        'Sales': 'sales',
        'Подписчики': 'subscribers',
        'Subscribers': 'subscribers',
        'SEO-трафик': 'seo_traffic',
        'SEO Traffic': 'seo_traffic',
        'GEO-видимость': 'geo_visibility',
        'GEO Visibility': 'geo_visibility',
        'Запуск': 'launch',
        'Launch': 'launch'
      }
      
      // Маппинг ресурсов
      const resourcesMap: Record<string, string> = {
        'Лицо в кадре': 'faceInFrame',
        'Face in Frame': 'faceInFrame',
        'Голос доступен': 'voiceAvailable',
        'Voice Available': 'voiceAvailable',
        'Есть фотосессии': 'hasPhotoshoots',
        'Has Photoshoots': 'hasPhotoshoots',
        'Есть кейсы': 'hasCases',
        'Has Cases': 'hasCases'
      }
      
      // Нормализация businessType
      if (normalized.businessType && businessTypeMap[normalized.businessType]) {
        normalized.businessType = businessTypeMap[normalized.businessType]
      }
      
      // Нормализация brandType
      if (normalized.brandType && brandTypeMap[normalized.brandType]) {
        normalized.brandType = brandTypeMap[normalized.brandType]
      }
      
      // Нормализация goals
      if (normalized.goals && Array.isArray(normalized.goals)) {
        normalized.goals = normalized.goals.map((goal: string) => 
          goalsMap[goal] || goal.toLowerCase().replace(/[- ]/g, '_')
        )
      }
      
      // Нормализация resources - преобразуем массив в boolean поля
      if (normalized.resources && Array.isArray(normalized.resources)) {
        normalized.resources.forEach((resource: string) => {
          const key = resourcesMap[resource] || resource
          normalized[key] = true
        })
        delete normalized.resources
      }
    }
    
    return normalized
  }

  const handleBulkAiFill = async () => {
    if (!bulkAiContext.trim()) {
      toast.error("Введите описание бизнеса")
      return
    }

    // Если нет businessId, создаем новый Business
    let currentBusinessId = businessId
    if (!currentBusinessId) {
      try {
        const newBusiness = await businessApi.create({ name: "Новый проект" })
        currentBusinessId = newBusiness.id
        setBusinessId(newBusiness.id)
        navigate(`/briefing/${newBusiness.id}`)
      } catch (error) {
        toast.error("Ошибка создания проекта")
        return
      }
    }

    setAiLoading(true)
    setShowBulkAiModal(false)
    
    // Инициализируем прогресс для всех блоков
    const initialProgress: {[key: number]: 'pending' | 'loading' | 'success' | 'error'} = {}
    BLOCKS.forEach(block => {
      initialProgress[block.id] = 'pending'
    })
    setBulkAiProgress(initialProgress)

    const report = { success: [] as number[], partial: [] as number[], failed: [] as number[] }

    // Проверяем что businessId создан
    if (!currentBusinessId) {
      toast.error("Ошибка: не удалось создать проект")
      setAiLoading(false)
      return
    }

    // Последовательно заполняем все блоки
    for (const block of BLOCKS) {
      try {
        // Обновляем статус на "loading"
        setBulkAiProgress(prev => ({ ...prev, [block.id]: 'loading' }))

        const response = await briefingApi.aiFillBlock(currentBusinessId, block.id, bulkAiContext)
        const content = response.content
        let aiData: any = null

        try {
          const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/)
          if (jsonMatch) {
            aiData = JSON.parse(jsonMatch[1])
          } else {
            aiData = JSON.parse(content)
          }

          const normalizedData = normalizeAiData(aiData, block.id)

          // Проверяем качество заполнения
          const filledFields = Object.values(normalizedData).filter(v => v && v !== '').length
          const totalFields = Object.keys(normalizedData).length

          setFormData(prev => ({
            ...prev,
            [block.id]: { ...normalizedData }
          }))

          // Определяем статус блока
          if (filledFields === totalFields) {
            setBulkAiProgress(prev => ({ ...prev, [block.id]: 'success' }))
            report.success.push(block.id)
          } else if (filledFields > 0) {
            setBulkAiProgress(prev => ({ ...prev, [block.id]: 'success' }))
            report.partial.push(block.id)
          } else {
            setBulkAiProgress(prev => ({ ...prev, [block.id]: 'error' }))
            report.failed.push(block.id)
          }

          // Сохраняем блок
          await briefingApi.saveBlock(currentBusinessId, block.id, normalizedData)
        } catch (parseError) {
          console.error(`Failed to parse AI response for block ${block.id}:`, parseError)
          setBulkAiProgress(prev => ({ ...prev, [block.id]: 'error' }))
          report.failed.push(block.id)
        }
      } catch (error) {
        console.error(`AI fill error for block ${block.id}:`, error)
        setBulkAiProgress(prev => ({ ...prev, [block.id]: 'error' }))
        report.failed.push(block.id)
      }

      // Небольшая задержка между запросами
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    setAiLoading(false)
    setAiReport(report)
    setShowAiReport(true)
    setBulkAiContext("")
    toast.success(`Заполнено ${report.success.length + report.partial.length} из ${BLOCKS.length} блоков!`)
  }

  const handleAiFill = async () => {
    if (!aiContext.trim()) {
      toast.error("Введите описание бизнеса")
      return
    }

    if (!businessId) {
      toast.error("Сначала сохраните первый блок")
      return
    }

    setAiLoading(true)
    try {
      const response = await briefingApi.aiFillBlock(businessId, currentBlock, aiContext)
      
      // Парсим JSON из ответа с fallback
      const content = response.content
      let aiData: any = null
      
      try {
        // Попытка 1: Парсинг markdown code block
        const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/)
        if (jsonMatch) {
          aiData = JSON.parse(jsonMatch[1])
        } else {
          // Попытка 2: Парсинг всего content как JSON
          aiData = JSON.parse(content)
        }
        
        // Нормализуем данные от AI
        const normalizedData = normalizeAiData(aiData, currentBlock)
        
        console.log('AI raw data:', aiData)
        console.log('Normalized data:', normalizedData)
        
        // Создаем новый объект formData для триггера перерисовки
        setFormData(prev => {
          const newData = {
            ...prev,
            [currentBlock]: { ...normalizedData }
          }
          // Форсируем обновление через setTimeout для гарантии перерисовки
          setTimeout(() => {
            toast.success("Блок заполнен с помощью AI!")
          }, 100)
          return newData
        })
        setShowAiModal(false)
        setAiContext("")
      } catch (parseError) {
        console.error("Failed to parse AI response:", parseError)
        toast.error("Не удалось распарсить ответ AI")
      }
    } catch (error) {
      console.error("AI fill error:", error)
      toast.error("Ошибка AI-заполнения")
    } finally {
      setAiLoading(false)
    }
  }

  const currentData = formData[currentBlock] || {}
  const progress = ((currentBlock + 1) / BLOCKS.length) * 100

  return (
    <div className="min-h-screen" style={{ background: '#05060A' }}>
      {/* Header */}
      <div className="border-b" style={{ borderColor: 'rgba(255,255,255,0.1)', background: '#0B0E17' }}>
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Назад
              </Button>
              <h1 className="text-2xl font-semibold" style={{ color: '#FFFFFF' }}>Брифинг</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                onClick={() => setShowBulkAiModal(true)} 
                disabled={aiLoading}
                variant="outline"
                className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Заполнить весь брифинг
              </Button>
              <Button onClick={saveBlock} disabled={loading} className="bg-gradient-to-r from-cyan-500 to-blue-600">
                <Save className="w-4 h-4 mr-2" />
                Сохранить
              </Button>
            </div>
          </div>
          <Progress value={progress} className="mt-4" />
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="col-span-3">
            <div className="p-4 rounded-2xl sticky top-4" style={{ 
              background: '#0B0E17',
              border: '1px solid rgba(255,255,255,0.06)'
            }}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: '#FFFFFF' }}>Блоки</h3>
              <div className="space-y-1">
                {BLOCKS.map((block) => {
                  const statusIcon = getBlockStatusIcon(block.id)
                  return (
                    <button
                      key={block.id}
                      onClick={() => setCurrentBlock(block.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between ${
                        currentBlock === block.id
                          ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                          : "hover:bg-white/5"
                      }`}
                      style={{ color: currentBlock === block.id ? '#FFFFFF' : '#B7C0D1' }}
                    >
                      <span>{block.id}. {block.title}</span>
                      {statusIcon && <span className="text-base">{statusIcon}</span>}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="col-span-9">
            <div className="p-8 rounded-2xl backdrop-blur-xl" style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)'
            }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold" style={{ color: '#FFFFFF' }}>
                  {BLOCKS[currentBlock].title}
                </h2>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowAiModal(true)}
                    className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30 hover:border-purple-500/50"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Заполнить с AI
                  </Button>
                  <Button variant="outline" size="sm" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                    <Mic className="w-4 h-4 mr-2" />
                    Заполнить голосом
                  </Button>
                </div>
              </div>

              {/* Формы блоков */}
              {currentBlock === 0 && <Block0Form data={currentData} onChange={updateField} />}
              {currentBlock === 1 && <Block1Form data={currentData} onChange={updateField} />}
              {currentBlock === 2 && <Block2Form data={currentData} onChange={updateField} />}
              {currentBlock === 3 && <Block3Form data={currentData} onChange={updateField} />}
              {currentBlock === 4 && <Block4Form data={currentData} onChange={updateField} />}
              {currentBlock === 5 && <Block5Form data={currentData} onChange={updateField} />}
              {currentBlock === 6 && <Block6Form data={currentData} onChange={updateField} />}
              {currentBlock === 7 && <Block7Form data={currentData} onChange={updateField} />}
              {currentBlock === 8 && <Block8Form data={currentData} onChange={updateField} />}
              {currentBlock === 9 && <Block9Form data={currentData} onChange={updateField} />}
              {currentBlock === 10 && <Block10Form data={currentData} onChange={updateField} />}
              {currentBlock === 11 && <Block11Form data={currentData} onChange={updateField} />}
              {currentBlock === 12 && <Block12Form data={currentData} onChange={updateField} />}

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <Button
                  variant="outline"
                  onClick={() => setCurrentBlock(Math.max(0, currentBlock - 1))}
                  disabled={currentBlock === 0}
                  style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Назад
                </Button>
                <Button
                  onClick={() => {
                    saveBlock()
                    if (currentBlock < BLOCKS.length - 1) {
                      setCurrentBlock(currentBlock + 1)
                    }
                  }}
                  disabled={loading}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600"
                >
                  {currentBlock === BLOCKS.length - 1 ? "Завершить" : "Далее"}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)' }}>
          <div className="w-full max-w-md p-6 rounded-2xl" style={{ background: '#0B0E17', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: '#FFFFFF' }}>
              AI-автозаполнение
            </h3>
            <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Опишите ваш бизнес в нескольких словах, и AI заполнит блок за вас.
            </p>
            <Textarea
              value={aiContext}
              onChange={(e) => setAiContext(e.target.value)}
              placeholder="Например: Я маркетолог-фрилансер, помогаю малому бизнесу с продвижением в соцсетях"
              rows={4}
              className="mb-4"
              style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAiModal(false)
                  setAiContext("")
                }}
                className="flex-1"
                style={{ borderColor: 'rgba(255,255,255,0.1)' }}
              >
                Отмена
              </Button>
              <Button
                onClick={handleAiFill}
                disabled={aiLoading || !aiContext.trim()}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500"
              >
                {aiLoading ? "Заполняем..." : "Заполнить"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Модалка массового AI автозаполнения */}
      {showBulkAiModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setShowBulkAiModal(false)}>
          <div 
            className="p-6 rounded-2xl max-w-lg w-full mx-4" 
            style={{ background: '#0B0E17', border: '1px solid rgba(255,255,255,0.1)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-2" style={{ color: '#FFFFFF' }}>
              Заполнить весь брифинг с помощью AI
            </h3>
            <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Опишите ваш бизнес, и AI заполнит все 13 блоков брифинга. Это может занять 1-2 минуты.
            </p>
            <Textarea
              value={bulkAiContext}
              onChange={(e) => setBulkAiContext(e.target.value)}
              placeholder="Например: Интернет-магазин косметики с доставкой по России. Целевая аудитория - женщины 25-45 лет. Средний чек 3000₽. Цель - 100 продаж/месяц."
              rows={6}
              className="mb-4"
              style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowBulkAiModal(false)
                  setBulkAiContext("")
                }}
                className="flex-1"
                style={{ borderColor: 'rgba(255,255,255,0.1)' }}
              >
                Отмена
              </Button>
              <Button
                onClick={handleBulkAiFill}
                disabled={aiLoading || !bulkAiContext.trim()}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600"
              >
                {aiLoading ? "Заполняем..." : "Заполнить все"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Отчет после заполнения */}
      {showAiReport && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setShowAiReport(false)}>
          <div 
            className="p-6 rounded-2xl max-w-lg w-full mx-4" 
            style={{ background: '#0B0E17', border: '1px solid rgba(255,255,255,0.1)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4" style={{ color: '#FFFFFF' }}>
              Отчет о заполнении
            </h3>
            
            <div className="space-y-4 mb-6">
              {aiReport.success.length > 0 && (
                <div className="p-4 rounded-lg" style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">✅</span>
                    <span className="font-semibold" style={{ color: '#22c55e' }}>
                      Успешно заполнено: {aiReport.success.length}
                    </span>
                  </div>
                  <div className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    {aiReport.success.map(id => BLOCKS[id].title).join(', ')}
                  </div>
                </div>
              )}

              {aiReport.partial.length > 0 && (
                <div className="p-4 rounded-lg" style={{ background: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.3)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">⚠️</span>
                    <span className="font-semibold" style={{ color: '#eab308' }}>
                      Требует проверки: {aiReport.partial.length}
                    </span>
                  </div>
                  <div className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    {aiReport.partial.map(id => BLOCKS[id].title).join(', ')}
                  </div>
                </div>
              )}

              {aiReport.failed.length > 0 && (
                <div className="p-4 rounded-lg" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">❌</span>
                    <span className="font-semibold" style={{ color: '#ef4444' }}>
                      Не удалось заполнить: {aiReport.failed.length}
                    </span>
                  </div>
                  <div className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    {aiReport.failed.map(id => BLOCKS[id].title).join(', ')}
                  </div>
                </div>
              )}
            </div>

            <Button
              onClick={() => setShowAiReport(false)}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600"
            >
              Понятно
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// Компонент поля
function Field({ label, required, children, helper }: any) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium" style={{ color: '#FFFFFF' }}>
        {label}
        {required && <span style={{ color: '#FF4FD8' }} className="ml-1">*</span>}
      </Label>
      {children}
      {helper && <p className="text-xs" style={{ color: '#B7C0D1' }}>{helper}</p>}
    </div>
  )
}

// Блок 0: Тип бизнеса
function Block0Form({ data, onChange }: any) {
  return (
    <div className="space-y-6">
      <Field label="Тип бизнеса" required>
        <select
          className="w-full px-4 py-2 rounded-lg border"
          style={{ background: '#0B0E17', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
          value={data.businessType || ''}
          onChange={(e) => onChange('businessType', e.target.value)}
        >
          <option value="">Выберите тип</option>
          <option value="expert">Эксперт</option>
          <option value="services">Услуги</option>
          <option value="ecom">E-commerce</option>
          <option value="saas">SaaS</option>
          <option value="other">Другое</option>
        </select>
      </Field>

      <Field label="Бренд" required>
        <select
          className="w-full px-4 py-2 rounded-lg border"
          style={{ background: '#0B0E17', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
          value={data.brandType || ''}
          onChange={(e) => onChange('brandType', e.target.value)}
        >
          <option value="">Выберите тип</option>
          <option value="personal">Личный бренд</option>
          <option value="company">Компания</option>
        </select>
      </Field>

      <Field label="Цель на 30-90 дней" required helper="Можно выбрать несколько">
        <div className="space-y-2">
          {[
            { value: 'leads', label: 'Лиды' },
            { value: 'sales', label: 'Продажи' },
            { value: 'subscribers', label: 'Подписчики' },
            { value: 'seo_traffic', label: 'SEO-трафик' },
            { value: 'geo_visibility', label: 'GEO-видимость' },
            { value: 'launch', label: 'Запуск' }
          ].map(goal => (
            <div key={goal.value} className="flex items-center space-x-2">
              <Checkbox
                checked={data.goals?.includes(goal.value) || false}
                onCheckedChange={(checked) => {
                  const goals = data.goals || []
                  onChange('goals', checked 
                    ? [...goals, goal.value]
                    : goals.filter((g: string) => g !== goal.value)
                  )
                }}
              />
              <label className="text-sm" style={{ color: '#FFFFFF' }}>{goal.label}</label>
            </div>
          ))}
        </div>
      </Field>

      <Field label="Основной KPI" required helper="Например: 50 лидов/месяц">
        <Input
          value={data.mainKPI || ''}
          onChange={(e) => onChange('mainKPI', e.target.value)}
          placeholder="50 лидов/месяц"
          style={{ background: '#0B0E17', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
        />
      </Field>

      <Field label="Контент-ресурсы" required>
        <div className="space-y-2">
          {[
            { value: 'faceInFrame', label: 'Лицо в кадре' },
            { value: 'voiceAvailable', label: 'Голос доступен' },
            { value: 'hasPhotoshoots', label: 'Есть фотосессии' },
            { value: 'hasCases', label: 'Есть кейсы' }
          ].map(item => (
            <div key={item.value} className="flex items-center space-x-2">
              <Checkbox
                checked={data[item.value] || false}
                onCheckedChange={(checked) => onChange(item.value, checked)}
              />
              <label className="text-sm" style={{ color: '#FFFFFF' }}>{item.label}</label>
            </div>
          ))}
        </div>
      </Field>

      <Field label="Ограничения" helper="Что нельзя, сроки, бюджет рекламы">
        <Textarea
          value={data.limitations || ''}
          onChange={(e) => onChange('limitations', e.target.value)}
          placeholder="Опишите ограничения..."
          rows={3}
          style={{ background: '#0B0E17', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
        />
      </Field>
    </div>
  )
}

// Блок 1: Суть бизнеса
function Block1Form({ data, onChange }: any) {
  return (
    <div className="space-y-6">
      <Field label="Название (бренд/проект)" required>
        <Input
          value={data.brandName || ''}
          onChange={(e) => onChange('brandName', e.target.value)}
          placeholder="Например: SupaBots"
          style={{ background: '#0B0E17', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
        />
      </Field>

      {data.brandType === 'personal' && (
        <Field label="Имя + роль" required>
          <Input
            value={data.personName || ''}
            onChange={(e) => onChange('personName', e.target.value)}
            placeholder="Например: Иван Иванов, маркетолог"
            style={{ background: '#0B0E17', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
          />
        </Field>
      )}

      <Field label="Что продаёте (простыми словами)" required>
        <Textarea
          value={data.whatYouSell || ''}
          onChange={(e) => onChange('whatYouSell', e.target.value)}
          placeholder="Опишите ваш продукт или услугу..."
          rows={3}
          style={{ background: '#0B0E17', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
        />
      </Field>

      <Field label="Кому продаёте (кто покупатель)" required>
        <Input
          value={data.targetCustomer || ''}
          onChange={(e) => onChange('targetCustomer', e.target.value)}
          placeholder="Например: владельцы малого бизнеса"
          style={{ background: '#0B0E17', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
        />
      </Field>

      <Field label="Главный результат клиента" required helper="Что изменится после покупки?">
        <Textarea
          value={data.mainResult || ''}
          onChange={(e) => onChange('mainResult', e.target.value)}
          placeholder="Опишите результат..."
          rows={3}
          style={{ background: '#0B0E17', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
        />
      </Field>

      <Field label="3 причины доверия" helper="Опыт, цифры, сертификаты, кейсы, медиа">
        <Textarea
          value={data.trustReasons || ''}
          onChange={(e) => onChange('trustReasons', e.target.value)}
          placeholder="1. ...\n2. ...\n3. ..."
          rows={3}
          style={{ background: '#0B0E17', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
        />
      </Field>

      <Field label="География" helper="РФ/город/регионы/онлайн">
        <Input
          value={data.geography || ''}
          onChange={(e) => onChange('geography', e.target.value)}
          placeholder="Например: Москва и МО"
          style={{ background: '#0B0E17', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
        />
      </Field>
    </div>
  )
}

// Блок 2: Аудитория
function Block2Form({ data, onChange }: any) {
  return (
    <div className="space-y-6">
      <Field label="Тип клиентов" required>
        <select
          className="w-full px-4 py-2 rounded-lg border"
          style={{ background: '#0B0E17', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
          value={data.clientType || ''}
          onChange={(e) => onChange('clientType', e.target.value)}
        >
          <option value="">Выберите тип</option>
          <option value="b2c">B2C</option>
          <option value="b2b">B2B</option>
          <option value="mixed">Mixed</option>
        </select>
      </Field>

      <Field label="Сегменты аудитории (до 3)" required>
        <Textarea
          value={data.segments || ''}
          onChange={(e) => onChange('segments', e.target.value)}
          placeholder="Опишите основные сегменты вашей аудитории..."
          rows={4}
          style={{ background: '#0B0E17', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
        />
      </Field>

      <Field label="Боли и проблемы" required helper="Какие проблемы решаете? (1-3)">
        <Textarea
          value={data.pains || ''}
          onChange={(e) => onChange('pains', e.target.value)}
          placeholder="1. ...\n2. ...\n3. ..."
          rows={3}
          style={{ background: '#0B0E17', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
        />
      </Field>

      <Field label="Желаемый результат" required helper="Чего хочет достичь клиент?">
        <Textarea
          value={data.desiredResult || ''}
          onChange={(e) => onChange('desiredResult', e.target.value)}
          placeholder="Опишите желаемый результат..."
          rows={3}
          style={{ background: '#0B0E17', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
        />
      </Field>

      <Field label="Главные возражения (1-3)" required helper="Почему клиенты могут отказаться?">
        <Textarea
          value={data.objections || ''}
          onChange={(e) => onChange('objections', e.target.value)}
          placeholder="1. ...\n2. ...\n3. ..."
          rows={3}
          style={{ background: '#0B0E17', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
        />
      </Field>

      <Field label="Слова клиента" helper="Как клиент формулирует проблему своими словами?">
        <Textarea
          value={data.clientWords || ''}
          onChange={(e) => onChange('clientWords', e.target.value)}
          placeholder="Примеры фраз клиентов..."
          rows={3}
          style={{ background: '#0B0E17', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
        />
      </Field>

      {data.clientType === 'b2b' && (
        <>
          <Field label="ЛПР и роли" required helper="Кто принимает решение о покупке?">
            <Input
              value={data.decisionMakers || ''}
              onChange={(e) => onChange('decisionMakers', e.target.value)}
              placeholder="Например: Директор, CFO"
              style={{ background: '#0B0E17', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
            />
          </Field>

          <Field label="Критерии выбора" required helper="Цена, срок, качество, риск">
            <Textarea
              value={data.selectionCriteria || ''}
              onChange={(e) => onChange('selectionCriteria', e.target.value)}
              placeholder="Опишите критерии..."
              rows={3}
              style={{ background: '#0B0E17', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
            />
          </Field>
        </>
      )}

      <Field label="Триггеры доверия" helper="Что нужно увидеть клиенту, чтобы решиться?">
        <Textarea
          value={data.trustTriggers || ''}
          onChange={(e) => onChange('trustTriggers', e.target.value)}
          placeholder="Опишите триггеры доверия..."
          rows={3}
          style={{ background: '#0B0E17', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
        />
      </Field>
    </div>
  )
}


