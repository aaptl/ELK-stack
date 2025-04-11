# ELK Stack with Filebeat and TCP Log Sender (Dockerized)

This project sets up a complete logging pipeline using Docker Compose with the following services:

- **Elasticsearch**
- **Logstash**
- **Kibana**
- **Filebeat**
- **Custom TCP Client Log Generator**
- **Log File Generator (for Filebeat)**

---

## 🧰 Technologies Used

- Docker & Docker Compose
- Elastic Stack 8.x
- Filebeat 7.x
- Node.js (for generating logs)

---

## 📁 Project Structure

```
├── docker-compose.yml
├── logstash
│   └── pipeline
│       └── logstash.conf
├── filebeat
│   └── filebeat.yml
├── logs
│   └── app.log (generated at runtime)
├── tcp-log-generator.js
└── file-log-generator.js
```

---

## ⚙️ Setup Instructions

### 1. Clone this repository

```bash
git clone https://github.com/your-username/elk-docker-stack.git
cd elk-docker-stack
```

### 2. Start ELK Stack

```bash
docker-compose up -d
```

### 3. Generate Logs

#### A. Log File Generator (for Filebeat)

This writes JSON logs to `./logs/app.log` which Filebeat reads.

```bash
node file-log-generator.js
```

#### B. TCP Log Generator (for Logstash TCP input)

Sends JSON logs directly to Logstash via TCP port `5000`.

```bash
node tcp-log-generator.js
```

---

## 📦 Docker Commands

### General

```bash
docker-compose up -d           # Start all services
docker-compose down            # Stop all services
docker-compose logs logstash   # View logstash logs
docker exec -it logstash bash  # Access logstash container shell
docker volume ls               # List volumes
```

### Cleanup

```bash
docker system prune -a         # Remove unused containers/images
docker volume prune            # Clean up volumes
```

---

## 🔍 Kibana Access

- **URL:** [http://localhost:5601](http://localhost:5601)
- Use Discover tab to explore logs.
- Use index pattern like `*-logs-*` to match dynamic indices.

---

## 🧪 Logstash Pipeline

Supports:
- TCP JSON input on port `5000`
- Filebeat input on port `5044`
- Adds `env: dev`
- Parses ISO timestamp
- Custom index: `%{[service]}-logs-YYYY.MM.DD`

---

## 📄 Notes

- Filebeat version must match your Elastic version closely.
- You can use both log sources simultaneously (TCP and file).
- JSON logs must include a `timestamp` and `service` field to support custom index naming.

---

## ✅ Example Log Format

```json
{
  "timestamp": "2025-04-11T07:20:23.608Z",
  "level": "info",
  "message": "Product added to cart",
  "userId": "user363",
  "service": "payment-service"
}
```

---

## 📬 Credits

Maintained by [Ankit Kumar Patel](https://github.com/your-username)  
VIZIQO – A software + eCommerce company
