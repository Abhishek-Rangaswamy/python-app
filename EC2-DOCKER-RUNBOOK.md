# Run Backend and Frontend on EC2 (No Docker Compose)

This project is configured to run the backend and frontend as **two separate Docker containers**.

## 1) Prerequisites on Ubuntu EC2

- Install Docker
- Open inbound security group ports:
  - `80` for frontend
  - `3000` only if you want direct backend access

## 2) Clone and enter project

```bash
git clone <your-repo-url>
cd python-app
```

## 3) Build images separately

```bash
docker build -t task-backend:latest ./backend
docker build -t task-frontend:latest ./frontend
```

## 4) Create a shared Docker network

```bash
docker network create task-net
```

## 5) Run backend container

```bash
docker run -d \
  --name backend-app \
  --network task-net \
  -p 3000:3000 \
  -e PORT=3000 \
  task-backend:latest
```

## 6) Run frontend container

```bash
docker run -d \
  --name frontend-app \
  --network task-net \
  -p 80:80 \
  task-frontend:latest
```

Frontend is available at `http://<EC2-PUBLIC-IP>/`.

## 7) Health checks

```bash
curl http://localhost:3000/health
curl http://localhost/
docker ps
```

## Notes

- Frontend container (Nginx) proxies `/api/*` calls to `http://backend-app:3000`.
- Because of that proxy, browser requests stay same-origin and do not require CORS changes for normal usage.
- If you need frontend to call an external backend URL directly, build frontend with:

```bash
docker build -t task-frontend:latest \
  --build-arg VITE_API_BASE_URL=http://<EC2-PUBLIC-IP>:3000 \
  ./frontend
```

## Stop and remove containers

```bash
docker rm -f frontend-app backend-app
docker network rm task-net
```
