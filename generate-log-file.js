const fs = require("fs")
const path = require("path")

const logDir = path.join(__dirname, "logs")
const logFile = path.join(logDir, "app.log")

// Ensure logs directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir)
  console.log("Created 'logs' directory.")
}

// Create the file if it doesn't exist
if (!fs.existsSync(logFile)) {
  fs.writeFileSync(logFile, "")
  console.log("Created 'app.log' file.")
}

const services = ["auth-service", "payment-service", "cart-service", "search-service"]
const messages = [
  "User signed in successfully",
  "Payment processed",
  "Product added to cart",
  "Search performed",
  "Order placed",
  "Payment failed",
]

setInterval(() => {
  const log = {
    timestamp: new Date().toISOString(),
    level: Math.random() > 0.8 ? "error" : "info",
    message: messages[Math.floor(Math.random() * messages.length)],
    userId: `user${Math.floor(Math.random() * 1000)}`,
    service: services[Math.floor(Math.random() * services.length)],
  }

  fs.appendFileSync(logFile, JSON.stringify(log) + "\n")
  console.log("Log written:", log)
}, 1000)
