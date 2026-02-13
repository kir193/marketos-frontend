// Блоки 3-12 брифинга
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

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

// Блок 3: Продукты и деньги
export function Block3Form({ data, onChange }: any) {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl" style={{ background: '#0B0E17', border: '1px solid rgba(255,255,255,0.06)' }}>
        <h3 className="text-sm font-semibold mb-4" style={{ color: '#FFFFFF' }}>Основной продукт (флагман)</h3>
        
        <div className="space-y-4">
          <Field label="Название" required>
            <Input
              value={data.productName || ''}
              onChange={(e) => onChange('productName', e.target.value)}
              placeholder="Название продукта"
              style={{ background: '#05060A', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
            />
          </Field>

          <Field label="Формат" required>
            <select
              className="w-full px-4 py-2 rounded-lg border"
              style={{ background: '#05060A', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
              value={data.productFormat || ''}
              onChange={(e) => onChange('productFormat', e.target.value)}
            >
              <option value="">Выберите формат</option>
              <option value="online">Онлайн</option>
              <option value="offline">Офлайн</option>
              <option value="subscription">Подписка</option>
              <option value="delivery">Доставка</option>
            </select>
          </Field>

          <Field label="Цена/диапазон" required>
            <Input
              value={data.price || ''}
              onChange={(e) => onChange('price', e.target.value)}
              placeholder="Например: 50 000 ₽"
              style={{ background: '#05060A', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
            />
          </Field>

          <Field label="Что входит (5-10 пунктов)" required>
            <Textarea
              value={data.productIncludes || ''}
              onChange={(e) => onChange('productIncludes', e.target.value)}
              placeholder="1. ...\n2. ...\n3. ..."
              rows={5}
              style={{ background: '#05060A', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
            />
          </Field>

          <Field label="Срок до результата / SLA" required>
            <Input
              value={data.resultTime || ''}
              onChange={(e) => onChange('resultTime', e.target.value)}
              placeholder="Например: 30 дней"
              style={{ background: '#05060A', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
            />
          </Field>

          <Field label="Гарантии/условия возврата">
            <Textarea
              value={data.guarantees || ''}
              onChange={(e) => onChange('guarantees', e.target.value)}
              placeholder="Опишите гарантии..."
              rows={2}
              style={{ background: '#05060A', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
            />
          </Field>
        </div>
      </div>

      <Field label="Топ-3 'самые маржинальные / самые частые' продукта" required>
        <Textarea
          value={data.topProducts || ''}
          onChange={(e) => onChange('topProducts', e.target.value)}
          placeholder="1. ...\n2. ...\n3. ..."
          rows={3}
          style={{ background: '#0B0E17', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
        />
      </Field>

      <Field label="Что нельзя обещать/ограничения по нише">
        <Textarea
          value={data.restrictions || ''}
          onChange={(e) => onChange('restrictions', e.target.value)}
          placeholder="Опишите ограничения..."
          rows={2}
          style={{ background: '#0B0E17', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
        />
      </Field>
    </div>
  )
}

// Блок 4: Воронка продаж
export function Block4Form({ data, onChange }: any) {
  return (
    <div className="space-y-6">
      <Field label="Модель продаж" required>
        <select
          className="w-full px-4 py-2 rounded-lg border"
          style={{ background: '#0B0E17', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
          value={data.salesModel || ''}
          onChange={(e) => onChange('salesModel', e.target.value)}
        >
          <option value="">Выберите модель</option>
          <option value="dm">В личку</option>
          <option value="call">Созвон</option>
          <option value="site_pay">Сайт-оплата</option>
          <option value="marketplace">Маркетплейс</option>
          <option value="managers">Менеджеры</option>
        </select>
      </Field>

      <Field label="Текущие этапы (3-7)" required helper="вход → квалификация → оффер → оплата → онбординг">
        <Textarea
          value={data.stages || ''}
          onChange={(e) => onChange('stages', e.target.value)}
          placeholder="Опишите этапы..."
          rows={5}
          style={{ background: '#0B0E17', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
        />
      </Field>

      {data.salesModel === 'call' && (
        <Field label="Критерии квалификации лида" required>
          <Textarea
            value={data.qualificationCriteria || ''}
            onChange={(e) => onChange('qualificationCriteria', e.target.value)}
            placeholder="Опишите критерии..."
            rows={3}
            style={{ background: '#0B0E17', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
          />
        </Field>
      )}

      <Field label="Средняя конверсия по этапам" helper="Если знаете">
        <Textarea
          value={data.conversion || ''}
          onChange={(e) => onChange('conversion', e.target.value)}
          placeholder="Например: Лид → Созвон: 30%, Созвон → Оплата: 50%"
          rows={3}
          style={{ background: '#0B0E17', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
        />
      </Field>

      <Field label="Повторные продажи" helper="Когда и что предлагают">
        <Textarea
          value={data.repeatSales || ''}
          onChange={(e) => onChange('repeatSales', e.target.value)}
          placeholder="Опишите повторные продажи..."
          rows={2}
          style={{ background: '#0B0E17', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
        />
      </Field>
    </div>
  )
}

// Блок 5: Каналы и площадки
export function Block5Form({ data, onChange }: any) {
  return (
    <div className="space-y-6">
      <Field label="Площадки MVP" required helper="Можно выбрать несколько">
        <div className="grid grid-cols-2 gap-2">
          {['FB', 'IG', 'Threads', 'YT', 'TikTok', 'Pinterest', 'X', 'VK', 'OK', 'Дзен'].map(platform => (
            <div key={platform} className="flex items-center space-x-2">
              <Checkbox
                checked={data.platforms?.includes(platform)}
                onCheckedChange={(checked) => {
                  const platforms = data.platforms || []
                  onChange('platforms', checked 
                    ? [...platforms, platform]
                    : platforms.filter((p: string) => p !== platform)
                  )
                }}
              />
              <label className="text-sm" style={{ color: '#FFFFFF' }}>{platform}</label>
            </div>
          ))}
        </div>
      </Field>

      <Field label="Ссылки на аккаунты" required>
        <Textarea
          value={data.platformLinks || ''}
          onChange={(e) => onChange('platformLinks', e.target.value)}
          placeholder="IG: @username\nYT: youtube.com/..."
          rows={5}
          style={{ background: '#0B0E17', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
        />
      </Field>

      <Field label="Готовые форматы" required helper="Можно выбрать несколько">
        <div className="grid grid-cols-2 gap-2">
          {['пост', 'карусель', 'сторис', 'shorts', 'reels', 'лонгрид'].map(format => (
            <div key={format} className="flex items-center space-x-2">
              <Checkbox
                checked={data.formats?.includes(format)}
                onCheckedChange={(checked) => {
                  const formats = data.formats || []
                  onChange('formats', checked 
                    ? [...formats, format]
                    : formats.filter((f: string) => f !== format)
                  )
                }}
              />
              <label className="text-sm" style={{ color: '#FFFFFF' }}>{format}</label>
            </div>
          ))}
        </div>
      </Field>

      <Field label="Желаемая частота постинга">
        <Input
          value={data.frequency || ''}
          onChange={(e) => onChange('frequency', e.target.value)}
          placeholder="Например: 3-5 постов в неделю"
          style={{ background: '#0B0E17', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
        />
      </Field>
    </div>
  )
}

// Блок 6: SEO + GEO
export function Block6Form({ data, onChange }: any) {
  return (
    <div className="space-y-6">
      <Field label="Есть сайт/лендинг?" required>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={data.hasSite}
              onCheckedChange={(checked) => onChange('hasSite', checked)}
            />
            <label className="text-sm" style={{ color: '#FFFFFF' }}>Да</label>
          </div>
        </div>
      </Field>

      {data.hasSite && (
        <Field label="URL сайта" required>
          <Input
            value={data.siteUrl || ''}
            onChange={(e) => onChange('siteUrl', e.target.value)}
            placeholder="https://example.com"
            style={{ background: '#0B0E17', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
          />
        </Field>
      )}

      <Field label="GEO-география" required helper="Города/регионы РФ">
        <Input
          value={data.geoRegions || ''}
          onChange={(e) => onChange('geoRegions', e.target.value)}
          placeholder="Например: Москва, Санкт-Петербург"
          style={{ background: '#0B0E17', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
        />
      </Field>

      <Field label="Приоритетные услуги/категории (5-20)" required>
        <Textarea
          value={data.services || ''}
          onChange={(e) => onChange('services', e.target.value)}
          placeholder="1. ...\n2. ...\n3. ..."
          rows={5}
          style={{ background: '#0B0E17', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
        />
      </Field>

      <Field label="Сезонность/пики спроса">
        <Textarea
          value={data.seasonality || ''}
          onChange={(e) => onChange('seasonality', e.target.value)}
          placeholder="Опишите сезонность..."
          rows={2}
          style={{ background: '#0B0E17', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
        />
      </Field>

      <Field label="Конкуренты в поиске" helper="Ссылки">
        <Textarea
          value={data.competitors || ''}
          onChange={(e) => onChange('competitors', e.target.value)}
          placeholder="https://competitor1.com\nhttps://competitor2.com"
          rows={3}
          style={{ background: '#0B0E17', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
        />
      </Field>
    </div>
  )
}

// Блок 7: Конкуренты и тренды
export function Block7Form({ data, onChange }: any) {
  return (
    <div className="space-y-6">
      <Field label="5-15 конкурентов" required helper="Ссылки/ники по площадкам">
        <Textarea
          value={data.competitors || ''}
          onChange={(e) => onChange('competitors', e.target.value)}
          placeholder="@competitor1\n@competitor2\nhttps://..."
          rows={5}
          style={{ background: '#0B0E17', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
        />
      </Field>

      <Field label="3-10 ключевых тем/рубрики ниши" required>
        <Textarea
          value={data.topics || ''}
          onChange={(e) => onChange('topics', e.target.value)}
          placeholder="1. ...\n2. ...\n3. ..."
          rows={5}
          style={{ background: '#0B0E17', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
        />
      </Field>

      <Field label="Хэштеги/ключевые слова">
        <Input
          value={data.hashtags || ''}
          onChange={(e) => onChange('hashtags', e.target.value)}
          placeholder="#маркетинг #smm #контент"
          style={{ background: '#0B0E17', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
        />
      </Field>

      <Field label="Что у конкурентов нравится/не нравится">
        <Textarea
          value={data.competitorAnalysis || ''}
          onChange={(e) => onChange('competitorAnalysis', e.target.value)}
          placeholder="Нравится: ...\nНе нравится: ..."
          rows={4}
          style={{ background: '#0B0E17', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
        />
      </Field>

      <Field label="Запреты" helper="'мы так не делаем' (этика/бренд)">
        <Textarea
          value={data.restrictions || ''}
          onChange={(e) => onChange('restrictions', e.target.value)}
          placeholder="Опишите запреты..."
          rows={2}
          style={{ background: '#0B0E17', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
        />
      </Field>
    </div>
  )
}

// Блок 8: Доказательства
export function Block8Form({ data, onChange }: any) {
  return (
    <div className="space-y-6">
      <Field label="1-3 кейса" required helper="задача → решение → результат → срок">
        <Textarea
          value={data.cases || ''}
          onChange={(e) => onChange('cases', e.target.value)}
          placeholder="Кейс 1:\nЗадача: ...\nРешение: ...\nРезультат: ...\nСрок: ..."
          rows={8}
          style={{ background: '#0B0E17', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
        />
      </Field>

      <Field label="Отзывы/скрины/видео">
        <Textarea
          value={data.testimonials || ''}
          onChange={(e) => onChange('testimonials', e.target.value)}
          placeholder="Ссылки на отзывы..."
          rows={3}
          style={{ background: '#0B0E17', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
        />
      </Field>

      <Field label="FAQ/возражения и ответы">
        <Textarea
          value={data.faq || ''}
          onChange={(e) => onChange('faq', e.target.value)}
          placeholder="В: ...\nО: ..."
          rows={5}
          style={{ background: '#0B0E17', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
        />
      </Field>

      <Field label="Материалы для загрузки" helper="Прайсы, презентации, брендбук, скрипты">
        <Textarea
          value={data.materials || ''}
          onChange={(e) => onChange('materials', e.target.value)}
          placeholder="Ссылки на материалы..."
          rows={3}
          style={{ background: '#0B0E17', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
        />
      </Field>

      <Field label="NDA/приватность" required helper="Что нельзя публиковать/использовать">
        <Textarea
          value={data.nda || ''}
          onChange={(e) => onChange('nda', e.target.value)}
          placeholder="Опишите ограничения..."
          rows={2}
          style={{ background: '#0B0E17', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
        />
      </Field>
    </div>
  )
}

// Блок 9: Контент-модель
export function Block9Form({ data, onChange }: any) {
  return (
    <div className="space-y-6">
      <Field label="Цель контента" required>
        <select
          className="w-full px-4 py-2 rounded-lg border"
          style={{ background: '#0B0E17', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
          value={data.contentGoal || ''}
          onChange={(e) => onChange('contentGoal', e.target.value)}
        >
          <option value="">Выберите цель</option>
          <option value="leads">Лиды</option>
          <option value="sales">Продажи</option>
          <option value="warmup">Прогрев</option>
          <option value="seo">SEO</option>
          <option value="reputation">Репутация</option>
        </select>
      </Field>

      <Field label="Пиллары (3-7)" required helper="Темы экспертизы">
        <Textarea
          value={data.pillars || ''}
          onChange={(e) => onChange('pillars', e.target.value)}
          placeholder="1. ...\n2. ...\n3. ..."
          rows={5}
          style={{ background: '#0B0E17', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
        />
      </Field>

      <Field label="Пропорции форматов" required helper="Пример: 40% посты / 30% карусели / 20% видео / 10% сторис">
        <Textarea
          value={data.formatProportions || ''}
          onChange={(e) => onChange('formatProportions', e.target.value)}
          placeholder="40% посты\n30% карусели\n20% видео\n10% сторис"
          rows={4}
          style={{ background: '#0B0E17', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
        />
      </Field>

      <Field label="CTA куда вести" required>
        <select
          className="w-full px-4 py-2 rounded-lg border"
          style={{ background: '#0B0E17', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
          value={data.cta || ''}
          onChange={(e) => onChange('cta', e.target.value)}
        >
          <option value="">Выберите CTA</option>
          <option value="dm">В личку</option>
          <option value="quiz">Квиз</option>
          <option value="bot">Бот</option>
          <option value="site">Сайт</option>
          <option value="call">Созвон</option>
        </select>
      </Field>

      <Field label="Тон" required>
        <select
          className="w-full px-4 py-2 rounded-lg border"
          style={{ background: '#0B0E17', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
          value={data.tone || ''}
          onChange={(e) => onChange('tone', e.target.value)}
        >
          <option value="">Выберите тон</option>
          <option value="strict">Строгий</option>
          <option value="friendly">Дружелюбный</option>
          <option value="bold">Дерзкий</option>
          <option value="mentor">Наставник</option>
        </select>
      </Field>

      <Field label="Контент-табу" helper="Что нельзя">
        <Textarea
          value={data.contentTaboo || ''}
          onChange={(e) => onChange('contentTaboo', e.target.value)}
          placeholder="Опишите запреты..."
          rows={2}
          style={{ background: '#0B0E17', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
        />
      </Field>
    </div>
  )
}

// Блок 10: Визуал и дизайн
export function Block10Form({ data, onChange }: any) {
  return (
    <div className="space-y-6">
      <Field label="Есть брендбук/логотип/шрифты?" required>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={data.hasBrandbook}
              onCheckedChange={(checked) => onChange('hasBrandbook', checked)}
            />
            <label className="text-sm" style={{ color: '#FFFFFF' }}>Да</label>
          </div>
        </div>
      </Field>

      {data.hasBrandbook && (
        <Field label="Ссылка на брендбук/материалы">
          <Input
            value={data.brandbookUrl || ''}
            onChange={(e) => onChange('brandbookUrl', e.target.value)}
            placeholder="https://..."
            style={{ background: '#0B0E17', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
          />
        </Field>
      )}

      <Field label="Референсы 'нравится/не нравится' (3-5)" required helper="+ почему">
        <Textarea
          value={data.references || ''}
          onChange={(e) => onChange('references', e.target.value)}
          placeholder="Нравится:\n1. ... (почему)\n\nНе нравится:\n1. ... (почему)"
          rows={6}
          style={{ background: '#0B0E17', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
        />
      </Field>

      <Field label="Носители" required helper="Обложки/посты/карусели/сторис/превью видео/пины">
        <Textarea
          value={data.carriers || ''}
          onChange={(e) => onChange('carriers', e.target.value)}
          placeholder="Опишите нужные носители..."
          rows={3}
          style={{ background: '#0B0E17', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
        />
      </Field>

      <Field label="Шаблоны (Canva/Figma)" helper="Ссылки">
        <Input
          value={data.templates || ''}
          onChange={(e) => onChange('templates', e.target.value)}
          placeholder="https://..."
          style={{ background: '#0B0E17', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
        />
      </Field>

      <Field label="Тон визуала">
        <select
          className="w-full px-4 py-2 rounded-lg border"
          style={{ background: '#0B0E17', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
          value={data.visualTone || ''}
          onChange={(e) => onChange('visualTone', e.target.value)}
        >
          <option value="">Выберите тон</option>
          <option value="minimal">Минимализм</option>
          <option value="premium">Премиум</option>
          <option value="bright">Ярко</option>
          <option value="calm">Спокойно</option>
        </select>
      </Field>
    </div>
  )
}

// Блок 11: Интеграции
export function Block11Form({ data, onChange }: any) {
  return (
    <div className="space-y-6">
      <Field label="Площадки для автопостинга" required helper="Можно выбрать несколько">
        <div className="grid grid-cols-2 gap-2">
          {['FB', 'IG', 'Threads', 'YT', 'TikTok', 'Pinterest', 'X', 'VK', 'OK', 'Дзен'].map(platform => (
            <div key={platform} className="flex items-center space-x-2">
              <Checkbox
                checked={data.autopostPlatforms?.includes(platform)}
                onCheckedChange={(checked) => {
                  const platforms = data.autopostPlatforms || []
                  onChange('autopostPlatforms', checked 
                    ? [...platforms, platform]
                    : platforms.filter((p: string) => p !== platform)
                  )
                }}
              />
              <label className="text-sm" style={{ color: '#FFFFFF' }}>{platform}</label>
            </div>
          ))}
        </div>
      </Field>

      <Field label="Метрики" required helper="Можно выбрать несколько">
        <div className="space-y-2">
          {['охваты', 'просмотры', 'CTR', 'лиды', 'продажи'].map(metric => (
            <div key={metric} className="flex items-center space-x-2">
              <Checkbox
                checked={data.metrics?.includes(metric)}
                onCheckedChange={(checked) => {
                  const metrics = data.metrics || []
                  onChange('metrics', checked 
                    ? [...metrics, metric]
                    : metrics.filter((m: string) => m !== metric)
                  )
                }}
              />
              <label className="text-sm" style={{ color: '#FFFFFF' }}>{metric}</label>
            </div>
          ))}
        </div>
      </Field>

      <Field label="События" helper="'лид оставил заявку', 'написал в ЛС', 'перешёл по ссылке'">
        <Textarea
          value={data.events || ''}
          onChange={(e) => onChange('events', e.target.value)}
          placeholder="Опишите отслеживаемые события..."
          rows={3}
          style={{ background: '#0B0E17', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
        />
      </Field>

      <Field label="UTM-шаблон/домен/трекинг">
        <Input
          value={data.utm || ''}
          onChange={(e) => onChange('utm', e.target.value)}
          placeholder="utm_source=..."
          style={{ background: '#0B0E17', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
        />
      </Field>
    </div>
  )
}

// Блок 12: Реквизиты
export function Block12Form({ data, onChange }: any) {
  return (
    <div className="space-y-6">
      <Field label="Нужны закрывающие документы?">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={data.needDocuments}
              onCheckedChange={(checked) => onChange('needDocuments', checked)}
            />
            <label className="text-sm" style={{ color: '#FFFFFF' }}>Да</label>
          </div>
        </div>
      </Field>

      {data.needDocuments && (
        <>
          <Field label="ИНН" required>
            <Input
              value={data.inn || ''}
              onChange={(e) => onChange('inn', e.target.value)}
              placeholder="1234567890"
              style={{ background: '#0B0E17', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
            />
          </Field>

          <Field label="ОГРН" required>
            <Input
              value={data.ogrn || ''}
              onChange={(e) => onChange('ogrn', e.target.value)}
              placeholder="1234567890123"
              style={{ background: '#0B0E17', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
            />
          </Field>

          <Field label="Адрес" required>
            <Input
              value={data.address || ''}
              onChange={(e) => onChange('address', e.target.value)}
              placeholder="Юридический адрес"
              style={{ background: '#0B0E17', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
            />
          </Field>

          <Field label="Банк" required>
            <Input
              value={data.bank || ''}
              onChange={(e) => onChange('bank', e.target.value)}
              placeholder="Название банка"
              style={{ background: '#0B0E17', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
            />
          </Field>

          <Field label="Подписант" required>
            <Input
              value={data.signatory || ''}
              onChange={(e) => onChange('signatory', e.target.value)}
              placeholder="ФИО и должность"
              style={{ background: '#0B0E17', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
            />
          </Field>
        </>
      )}

      <Field label="Шаблоны документов" helper="Если есть / требования бухгалтера">
        <Textarea
          value={data.documentTemplates || ''}
          onChange={(e) => onChange('documentTemplates', e.target.value)}
          placeholder="Опишите требования..."
          rows={3}
          style={{ background: '#0B0E17', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
        />
      </Field>
    </div>
  )
}
