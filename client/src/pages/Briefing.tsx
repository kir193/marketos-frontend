import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, Check, Mic } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useParams } from "wouter";
import { briefingApi } from "@/lib/api";
import { toast } from "sonner";

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
];

export default function Briefing() {
  const params = useParams();
  const businessId = params.id || "new";
  const [currentBlock, setCurrentBlock] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const progress = ((currentBlock + 1) / BLOCKS.length) * 100;

  const handleNext = async () => {
    // Автосохранение перед переходом
    await handleSave();
    if (currentBlock < BLOCKS.length - 1) {
      setCurrentBlock(currentBlock + 1);
    }
  };

  const handlePrev = () => {
    if (currentBlock > 0) {
      setCurrentBlock(currentBlock - 1);
    }
  };

  const handleSave = async () => {
    try {
      const businessIdNum = businessId === "new" ? 1 : parseInt(businessId);
      await briefingApi.saveBlock(businessIdNum, currentBlock, formData);
      toast.success("Блок сохранен");
    } catch (error) {
      console.error("Error saving block:", error);
      toast.error("Ошибка при сохранении");
    }
  };

  // Загрузка существующего брифинга
  useEffect(() => {
    if (businessId !== "new") {
      const loadBriefing = async () => {
        try {
          const data = await briefingApi.getBriefing(parseInt(businessId));
          if (data && data.length > 0) {
            // Преобразуем массив блоков в объект formData
            const loadedData: Record<string, any> = {};
            data.forEach((block: any) => {
              Object.assign(loadedData, block.data);
            });
            setFormData(loadedData);
          }
        } catch (error) {
          console.error("Error loading briefing:", error);
        }
      };
      loadBriefing();
    }
  }, [businessId]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-semibold">Брифинг проекта</h1>
                <p className="text-sm text-muted-foreground">
                  Шаг {currentBlock + 1} из {BLOCKS.length}
                </p>
              </div>
            </div>
            <Button onClick={handleSave} variant="outline">
              Сохранить
            </Button>
          </div>
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Stepper */}
          <div className="mb-8">
            <div className="flex items-center gap-2 overflow-x-auto pb-4">
              {BLOCKS.map((block, index) => (
                <button
                  key={block.id}
                  onClick={() => setCurrentBlock(index)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all whitespace-nowrap ${
                    index === currentBlock
                      ? "bg-primary text-primary-foreground border-primary"
                      : index < currentBlock
                      ? "bg-primary/10 border-primary/30 text-primary"
                      : "bg-card border-border/40 text-muted-foreground hover:border-border"
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    index < currentBlock ? "bg-primary text-primary-foreground" : ""
                  }`}>
                    {index < currentBlock ? <Check className="w-4 h-4" /> : index + 1}
                  </div>
                  <span className="text-sm font-medium">{block.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form Card */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/40">
            <CardHeader>
              <CardTitle>{BLOCKS[currentBlock].title}</CardTitle>
              <CardDescription>{BLOCKS[currentBlock].description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Block 0: Базовая информация */}
              {currentBlock === 0 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Название бизнеса</Label>
                    <Input
                      id="businessName"
                      placeholder="Например: SupaBots"
                      value={formData.businessName || ""}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Сфера деятельности</Label>
                    <Input
                      id="industry"
                      placeholder="Например: Wellness & Health"
                      value={formData.industry || ""}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Сайт</Label>
                    <Input
                      id="website"
                      type="url"
                      placeholder="https://example.com"
                      value={formData.website || ""}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Краткое описание</Label>
                    <Textarea
                      id="description"
                      placeholder="Расскажите о вашем бизнесе..."
                      rows={4}
                      value={formData.description || ""}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                  <div className="pt-4 border-t border-border/40">
                    <Button variant="outline" className="w-full gap-2">
                      <Mic className="w-4 h-4" />
                      Заполнить голосом
                    </Button>
                  </div>
                </>
              )}

              {/* Other blocks - placeholder */}
              {currentBlock > 0 && (
                <div className="py-12 text-center text-muted-foreground">
                  <p>Форма для блока "{BLOCKS[currentBlock].title}" будет здесь</p>
                  <p className="text-sm mt-2">Блок {currentBlock + 1} из {BLOCKS.length}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentBlock === 0}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Назад
            </Button>
            <Button
              onClick={handleNext}
              disabled={currentBlock === BLOCKS.length - 1}
              className="gap-2"
            >
              Далее
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
