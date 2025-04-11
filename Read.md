🚀 Complete Setup Guide for ELK Stack with Filebeat and TCP Logger
🛠 Prerequisites
Docker & Docker Compose installed

Node.js installed (for logger & TCP client)

Basic terminal familiarity

🔧 Folder Structure
perl
Copy
Edit
project-root/
│
├── docker-compose.yml
├── logs/                       # auto-created by script
│   └── app.log
│
├── log-generator.js           # Writes logs to file
├── tcp-log-client.js          # Sends logs over TCP
│
├── filebeat/
│   └── filebeat.yml
│
└── logstash/
    └── pipeline/
        └── logstash.conf
🔹 Step-by-Step Setup
1. Clone or Set Up Project
Create project structure as above. Add all files with the content shared earlier.

2. ✅ Logstash Pipeline Configuration (logstash/pipeline/logstash.conf)
Supports both Filebeat and TCP JSON logs, adds env field, parses timestamp, routes to ES.

conf
Copy
Edit
input {
  tcp {
    port => 5000
    codec => json
  }
  beats {
    port => 5044
  }
}

filter {
  mutate {
    add_field => { "env" => "dev" }
  }

  date {
    match => ["timestamp", "ISO8601"]
    target => "@timestamp"
    remove_field => ["timestamp"]
  }

#   # Optional: Drop logs that don't have service field
#   if ![service] {
#     drop {}
#   }

#   # Optional: Clean up unwanted fields
#   mutate {
#     remove_field => ["host", "port"]
#   }
}

output {
  elasticsearch {
    hosts => ["http://elasticsearch:9200"]
    index => "%{[service]}-logs-%{+YYYY.MM.dd}"
  }

  stdout { codec => rubydebug }
}
3. ✅ Filebeat Configuration (filebeat/filebeat.yml)
yaml
Copy
Edit
filebeat.inputs:
  - type: log
    enabled: true
    paths:
      - /var/log/app/*.log

output.logstash:
  hosts: ["logstash:5000"]

processors:
  - add_fields:
      target: ''
      fields:
        env: dev
4. ✅ Docker Compose (docker-compose.yml)
Make sure this file is in the root directory.

yaml
Copy
Edit
version: "3.8"

services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.12.0
    container_name: elasticsearch
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
    ports:
      - "9200:9200"
    volumes:
      - esdata:/usr/share/elasticsearch/data

  logstash:
    image: docker.elastic.co/logstash/logstash:8.12.0
    container_name: logstash
    volumes:
      - ./logstash/pipeline:/usr/share/logstash/pipeline
    ports:
      - "5000:5000"
      - "5044:5044"
    depends_on:
      - elasticsearch

  kibana:
    image: docker.elastic.co/kibana/kibana:8.12.0
    container_name: kibana
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
    ports:
      - "5601:5601"
    depends_on:
      - elasticsearch

  filebeat:
    image: docker.elastic.co/beats/filebeat:7.17.3
    container_name: filebeat
    user: root
    volumes:
      - ./filebeat/filebeat.yml:/usr/share/filebeat/filebeat.yml
      - ./logs:/var/log/app
    depends_on:
      - logstash

volumes:
  esdata:
5. ✅ Start the ELK Stack
bash
Copy
Edit
docker-compose up -d
6. ✅ Start Log Generator
This creates logs/app.log and appends new logs every second:

bash
Copy
Edit
node log-generator.js
7. ✅ Start TCP Log Client (optional)
This sends logs directly to Logstash TCP input (port 5000):

bash
Copy
Edit
node tcp-log-client.js
8. ✅ Open Kibana
Go to: http://localhost:5601

Navigate to Stack Management → Index Patterns

Create new pattern:

markdown
Copy
Edit
*logs-*
Select @timestamp as the time field

9. ✅ View Your Logs!
Go to Discover

Filter by service, env, or level

🐳 Handy Docker Commands (Recap)
bash
Copy
Edit
docker-compose up -d        # Start services
docker-compose down         # Stop and clean
docker ps                   # List containers
docker logs logstash        # Check logstash logs
docker exec -it logstash /bin/bash # Open shell
docker restart filebeat     # Restart a container
docker system prune -f      # Clean unused stuff
