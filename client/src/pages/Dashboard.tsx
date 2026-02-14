import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Briefcase, TrendingUp, FileText, Share2 } from "lucide-react";
import { Link } from "wouter";
import { businessApi, briefingApi } from "@/lib/api";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const businesses = await businessApi.getAll();
      
      // Загружаем прогресс для каждого бизнеса
      const projectsWithProgress = await Promise.all(
        businesses.map(async (business: any) => {
          try {
            const progress = await briefingApi.getProgress(business.id);
            return {
              id: business.id,
              name: business.name || "Новый проект",
              progress: progress.percentage || 0,
              status: "active",
              lastUpdated: formatDate(business.updatedAt)
            };
          } catch (error) {
            return {
              id: business.id,
              name: business.name || "Новый проект",
              progress: 0,
              status: "active",
              lastUpdated: formatDate(business.updatedAt)
            };
          }
        })
      );
      
      setProjects(projectsWithProgress);
    } catch (error) {
      console.error("Failed to load projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "недавно";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) return `${diffMins} мин назад`;
    if (diffHours < 24) return `${diffHours} ч назад`;
    return `${diffDays} д назад`;
  };

  const stats = [
    { label: "Проектов", value: String(projects.length), icon: Briefcase, trend: "+0%" },
    { label: "Артефактов", value: "12", icon: FileText, trend: "+25%" },
    { label: "Публикаций", value: "48", icon: Share2, trend: "+12%" },
    { label: "Охват", value: "24.5K", icon: TrendingUp, trend: "+18%" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Marketos
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">AI Marketing Platform</p>
            </div>
            <Link href="/briefing/new">
              <Button size="lg" className="gap-2">
                <Plus className="w-4 h-4" />
                Новый проект
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} className="bg-card/50 backdrop-blur-sm border-border/40">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                    <p className="text-xs text-green-500 mt-1">{stat.trend}</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Projects */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Мои проекты</h2>
          </div>
          
          <div className="grid gap-4">
            {projects.map((project) => (
              <Card key={project.id} className="bg-card/50 backdrop-blur-sm border-border/40 hover:border-primary/50 transition-all cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <CardDescription className="mt-1">
                        Обновлено {project.lastUpdated}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/briefing/${project.id}`}>
                        <Button variant="outline" size="sm">Открыть</Button>
                      </Link>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Прогресс брифинга</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-primary to-purple-500 h-2 rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
