function generateUniqueOrderId() {
  const timestamp = Date.now().toString(); // Get current timestamp
  const randomPart = Math.floor(1000 + Math.random() * 9000).toString(); // Generate a 4-digit random number
  return timestamp.slice(-6) + randomPart; // Take last 4 digits of timestamp and combine with random part
}

export default generateUniqueOrderId