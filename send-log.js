// const net = require("net")

// const client = new net.Socket()
// client.connect(5000, "localhost", () => {
//     setInterval(() => {
//       const log = {
//         timestamp: new Date().toISOString(),
//         level: "info",
//         message: "User signed in successfully",
//         userId: "abc123",
//         service: "auth-service",
//       }
//       console.log("Sending log:", log)
//       client.write(JSON.stringify(log) + "\n")
//     }, 100)
// })


const net = require("net")

const client = new net.Socket()
client.connect(5000, "localhost", () => {
  const services = ["auth-service", "search-service", "payment-service"]

  setInterval(() => {
    const log = {
      timestamp: new Date().toISOString(),
      level: "info",
      message: "User did something important",
      userId: "abc123",
      service: services[Math.floor(Math.random() * services.length)],
    }

    console.log("Sending log:", log)
    client.write(JSON.stringify(log) + "\n")
  }, 1000)
})
