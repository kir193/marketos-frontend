# 🐳 Docker Deployment Guide - Marketos

Полная инструкция по развертыванию Marketos с использованием Docker Compose.

---

## 📋 Содержание

1. [Локальный запуск](#локальный-запуск)
2. [Развертывание на VPS](#развертывание-на-vps)
3. [Структура проекта](#структура-проекта)
4. [Troubleshooting](#troubleshooting)

---

## 🏠 Локальный запуск

### Требования

- Docker 20.10+
- Docker Compose 2.0+
- 4GB RAM минимум

### Быстрый старт

```bash
# 1. Клонировать репозитории
git clone https://github.com/KirillDogadin-std/marketos-backend.git
git clone https://github.com/kir193/marketos-frontend.git

# 2. Создать структуру для Docker
mkdir marketos-deploy
cd marketos-deploy

# 3. Скопировать код
cp -r ../marketos-backend backend/
cp -r ../marketos-frontend/client/* frontend/
cp ../marketos-frontend/package.json ../marketos-frontend/pnpm-lock.yaml frontend/

# 4. Создать docker-compose.yml (см. ниже)

# 5. Запустить все сервисы
docker-compose up -d

# 6. Проверить логи
docker-compose logs -f

# 7. Открыть в браузере
# Frontend: http://localhost
# Backend API: http://localhost:8080/api
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: marketos-postgres
    environment:
      POSTGRES_DB: marketos
      POSTGRES_USER: marketos
      POSTGRES_PASSWORD: marketos123
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - marketos-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U marketos"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: marketos-backend
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/marketos
      SPRING_DATASOURCE_USERNAME: marketos
      SPRING_DATASOURCE_PASSWORD: marketos123
      SPRING_JPA_HIBERNATE_DDL_AUTO: update
    ports:
      - "8080:8080"
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - marketos-network
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        VITE_API_URL: http://localhost:8080/api
    container_name: marketos-frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - marketos-network
    restart: unless-stopped

volumes:
  postgres_data:

networks:
  marketos-network:
    driver: bridge
```

### Управление сервисами

```bash
# Остановить все сервисы
docker-compose down

# Пересобрать и перезапустить
docker-compose up -d --build

# Просмотр логов конкретного сервиса
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# Очистить все данные (включая БД)
docker-compose down -v
```

---

## 🌐 Развертывание на VPS

### Требования

- Ubuntu 20.04+ / Debian 11+
- Root доступ
- 2GB RAM минимум
- 20GB свободного места

### Автоматический деплой

```bash
# 1. На локальной машине создать deploy.sh
chmod +x deploy.sh

# 2. Обновить credentials в deploy.sh
VPS_HOST="your-vps-ip"
VPS_USER="root"
VPS_PASSWORD="your-password"

# 3. Запустить деплой
./deploy.sh
```

### Ручной деплой

```bash
# 1. Подключиться к VPS
ssh root@your-vps-ip

# 2. Установить Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# 3. Установить Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# 4. Создать директорию проекта
mkdir -p /opt/marketos
cd /opt/marketos

# 5. Загрузить код (через git или scp)
git clone https://github.com/KirillDogadin-std/marketos-backend.git backend
git clone https://github.com/kir193/marketos-frontend.git frontend-repo
cp -r frontend-repo/client/* frontend/
cp frontend-repo/package.json frontend-repo/pnpm-lock.yaml frontend/

# 6. Создать docker-compose.yml с правильным API URL
# VITE_API_URL: http://your-vps-ip:8080/api

# 7. Запустить
docker-compose up -d --build

# 8. Проверить статус
docker-compose ps
docker-compose logs -f
```

### Настройка Firewall

```bash
# Открыть порты 80 и 8080
ufw allow 80/tcp
ufw allow 8080/tcp
ufw enable
```

### Nginx Reverse Proxy (опционально)

Для production рекомендуется использовать Nginx с SSL:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 📁 Структура проекта

```
marketos-deploy/
├── docker-compose.yml          # Главный файл конфигурации
├── backend/
│   ├── Dockerfile             # Multi-stage build для Spring Boot
│   ├── pom.xml
│   └── src/
└── frontend/
    ├── Dockerfile             # Multi-stage build для React
    ├── nginx.conf             # Nginx конфигурация
    ├── package.json
    └── src/
```

---

## 🔧 Troubleshooting

### Backend не запускается

```bash
# Проверить логи
docker-compose logs backend

# Проверить подключение к БД
docker-compose exec postgres psql -U marketos -d marketos -c "\dt"

# Пересобрать Backend
docker-compose up -d --build backend
```

### Frontend не подключается к Backend

```bash
# 1. Проверить API URL в frontend/src/lib/api.ts
# 2. Проверить CORS в Backend (CorsConfig.java)
# 3. Проверить сеть Docker
docker network inspect marketos-deploy_marketos-network
```

### PostgreSQL ошибки

```bash
# Очистить volume и пересоздать БД
docker-compose down -v
docker-compose up -d
```

### Порты заняты

```bash
# Проверить занятые порты
sudo netstat -tulpn | grep -E ':(80|8080|5432)'

# Изменить порты в docker-compose.yml
# Например: "8081:8080" вместо "8080:8080"
```

---

## 🚀 Production рекомендации

1. **Использовать .env файлы** для credentials
2. **Настроить SSL/TLS** через Let's Encrypt
3. **Настроить backup БД** (pg_dump)
4. **Использовать Docker secrets** для паролей
5. **Настроить мониторинг** (Prometheus + Grafana)
6. **Ограничить ресурсы** контейнеров

```yaml
# Пример ограничения ресурсов
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
```

---

## 📞 Поддержка

- Backend Issues: https://github.com/KirillDogadin-std/marketos-backend/issues
- Frontend Issues: https://github.com/kir193/marketos-frontend/issues
