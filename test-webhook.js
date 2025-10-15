// Test del webhook de emails entrantes
// Ejecuta: node test-webhook.js

const testData = {
  from: "Test User <test@example.com>",
  to: "contact@padeliner.com",
  subject: "Test desde script",
  text: "Este es un email de prueba para verificar el webhook",
  headers: {
    'content-type': 'text/plain',
    'date': new Date().toISOString()
  }
}

fetch('http://localhost:3000/api/webhooks/inbound-email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-webhook-secret': 'whsec_1eHMdA5Ufn/x6WwbUWyFx3AAjalZvWHm'
  },
  body: JSON.stringify(testData)
})
.then(res => res.json())
.then(data => {
  console.log('✅ Webhook response:', data)
})
.catch(err => {
  console.error('❌ Error:', err)
})
