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
import { Mic, ChevronLeft, ChevronRight, Save, ArrowLeft } from "lucide-react"
import { useLocation } from "wouter"
import { briefingApi } from "@/lib/api"

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
  const [, navigate] = useLocation()
  const [currentBlock, setCurrentBlock] = useState(0)
  const [formData, setFormData] = useState<BriefingData>({})
  const [loading, setLoading] = useState(false)
  const businessId = 1 // TODO: получать из контекста/роута

  useEffect(() => {
    loadBriefing()
  }, [])

  const loadBriefing = async () => {
    try {
      const data = await briefingApi.getBriefing(businessId)
      setFormData(data)
    } catch (error) {
      console.error("Failed to load briefing:", error)
    }
  }

  const saveBlock = async () => {
    setLoading(true)
    try {
      await briefingApi.saveBlock(businessId, currentBlock, formData[currentBlock] || {})
      toast.success("Блок сохранен!")
    } catch (error) {
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
            <Button onClick={saveBlock} disabled={loading} className="bg-gradient-to-r from-cyan-500 to-blue-600">
              <Save className="w-4 h-4 mr-2" />
              Сохранить
            </Button>
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
                {BLOCKS.map((block) => (
                  <button
                    key={block.id}
                    onClick={() => setCurrentBlock(block.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      currentBlock === block.id
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                        : "hover:bg-white/5"
                    }`}
                    style={{ color: currentBlock === block.id ? '#FFFFFF' : '#B7C0D1' }}
                  >
                    {block.id}. {block.title}
                  </button>
                ))}
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
                <Button variant="outline" size="sm" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                  <Mic className="w-4 h-4 mr-2" />
                  Заполнить голосом
                </Button>
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
                checked={data.goals?.includes(goal.value)}
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
                checked={data[item.value]}
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


