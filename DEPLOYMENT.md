# Инструкция по развертыванию Marketos

## Архитектура проекта

- **Backend:** Spring Boot 3.4 + PostgreSQL (Java 21)
- **Frontend:** React 19 + TypeScript + Vite + shadcn/ui + Tailwind CSS
- **База данных:** PostgreSQL 15+

---

## Backend (Spring Boot)

### Требования
- Java 21
- Maven 3.9+
- PostgreSQL 15+

### 1. Клонирование репозитория
```bash
git clone https://github.com/KirillDogadin-std/marketos-backend.git
cd marketos-backend
```

### 2. Настройка базы данных

**Создайте БД:**
```sql
CREATE DATABASE marketos;
CREATE USER marketos WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE marketos TO marketos;
```

**Настройте `src/main/resources/application.properties`:**
```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/marketos
spring.datasource.username=marketos
spring.datasource.password=your_password

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# Server
server.port=8080

# CORS (для Frontend)
cors.allowed-origins=http://localhost:3000,http://localhost:5173
```

### 3. Сборка и запуск

```bash
# Сборка
mvn clean package

# Запуск
java -jar target/marketos-backend-0.1.0-SNAPSHOT.jar
```

**Проверка:**
```bash
curl http://localhost:8080/api/briefing/1
```

---

## Frontend (React + Vite)

### Требования
- Node.js 18+
- pnpm 9+ (или npm/yarn)

### 1. Клонирование репозитория
```bash
git clone https://github.com/kir193/marketos-frontend.git
cd marketos-frontend
```

### 2. Установка зависимостей
```bash
pnpm install
# или
npm install
```

### 3. Настройка API URL

**Создайте `.env` файл:**
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

**Обновите `client/src/lib/api.ts`:**
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
```

### 4. Запуск dev сервера

```bash
pnpm dev
# или
npm run dev
```

**Приложение будет доступно:** http://localhost:3000

---

## Развертывание на продакшн

### Backend

**1. Соберите JAR:**
```bash
mvn clean package -DskipTests
```

**2. Запустите с production профилем:**
```bash
java -jar target/marketos-backend-0.1.0-SNAPSHOT.jar \
  --spring.profiles.active=prod \
  --spring.datasource.url=jdbc:postgresql://your-db-host:5432/marketos \
  --spring.datasource.username=marketos \
  --spring.datasource.password=your_password
```

### Frontend

**1. Соберите production build:**
```bash
pnpm build
```

**2. Деплой на хостинг:**
- **Vercel/Netlify:** Подключите GitHub репозиторий
- **Nginx:** Скопируйте `dist/public` в `/var/www/html`

**3. Настройте переменные окружения:**
```env
VITE_API_BASE_URL=https://your-backend-domain.com/api
```

---

## Настройка CORS на Backend

**Создайте `src/main/java/ai/marketos/backend/config/CorsConfig.java`:**
```java
package ai.marketos.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
public class CorsConfig {
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOrigins(Arrays.asList(
            "http://localhost:3000",
            "http://localhost:5173",
            "https://your-frontend-domain.com"
        ));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);
        return new CorsFilter(source);
    }
}
```

---

## Структура проекта

```
marketos/
├── marketos-backend/          # Spring Boot Backend
│   ├── src/main/java/
│   │   └── ai/marketos/backend/
│   │       ├── controller/    # REST контроллеры
│   │       ├── service/       # Бизнес-логика
│   │       ├── entity/        # JPA сущности
│   │       ├── dto/           # Data Transfer Objects
│   │       └── repository/    # JPA репозитории
│   └── src/main/resources/
│       └── application.properties
│
└── marketos-frontend/         # React Frontend
    ├── client/
    │   ├── src/
    │   │   ├── pages/         # Страницы (Home, Dashboard, Briefing)
    │   │   ├── components/    # UI компоненты
    │   │   ├── lib/           # Утилиты (API клиент)
    │   │   └── index.css      # GLOBAL DESIGN RULES
    │   └── index.html
    └── package.json
```

---

## API Endpoints

**Briefing:**
- `POST /api/briefing/{businessId}/block` - Сохранить блок брифинга
- `GET /api/briefing/{businessId}` - Получить весь брифинг
- `GET /api/briefing/{businessId}/progress` - Получить прогресс заполнения
- `POST /api/briefing/voice-upload` - Загрузить голосовой ввод

**Подробная документация:** `marketos-backend/API.md`

---

## Troubleshooting

### Backend не запускается
```bash
# Проверьте версию Java
java -version  # Должна быть 21+

# Проверьте подключение к БД
psql -h localhost -U marketos -d marketos
```

### Frontend не подключается к Backend
1. Убедитесь, что Backend запущен: `curl http://localhost:8080/api/briefing/1`
2. Проверьте CORS настройки в Backend
3. Проверьте `VITE_API_BASE_URL` в `.env`

### CORS ошибки
Добавьте Frontend URL в `CorsConfig.java` и перезапустите Backend

---

## Полезные команды

```bash
# Backend
mvn clean package          # Сборка
mvn spring-boot:run        # Запуск в dev режиме
mvn test                   # Тесты

# Frontend
pnpm dev                   # Dev сервер
pnpm build                 # Production build
pnpm preview               # Просмотр production build
```

---

## Контакты

- **Backend:** https://github.com/KirillDogadin-std/marketos-backend
- **Frontend:** https://github.com/kir193/marketos-frontend
- **Автор:** Kirill Dogadin (kirilldogadin1993@gmail.com)
