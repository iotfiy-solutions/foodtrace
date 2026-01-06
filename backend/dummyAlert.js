const WebSocket = require("ws");

const SERVER_URL = "ws://localhost:5050/ws/alerts";

const DEVICES = [
    "device-001",
    "device-003",
    "device-005",
    "device-006",
    "device-007",
];

// Generate random numbers
function getRandomValue(min, max) {
    return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

// Simulate one device
function simulateDevice(deviceId) {
    const ws = new WebSocket(SERVER_URL);

    ws.on("open", () => {
        console.log(`[${deviceId}] Connected to server`);

        // Send dummy alert/data every 10 seconds
        const dataInterval = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
                const payload = {
                    deviceId,
                    ambient: getRandomValue(20, 40),   // Ambient temperature
                    freezer: getRandomValue(-10, 5),   // Freezer temperature
                    batteryAlert: Math.random() > 0.5 ? "LOW" : "NORMAL",
                    refrigeratorAlert: Math.random() > 0.7 ? "ALERT" : "NORMAL",
                };

                ws.send(JSON.stringify(payload));
                console.log(`[${deviceId}] Sent data:`, payload);
            }
        }, 10000);

        ws.on("message", (msg) => {
            console.log(`[${deviceId}] Server says: ${msg.toString()}`);
        });

        ws.on("close", () => {
            console.log(`[${deviceId}] Disconnected from server`);
            clearInterval(heartbeatInterval);
            clearInterval(dataInterval);
        });

        ws.on("error", (err) => {
            console.error(`[${deviceId}] WS Error:`, err.message);
            clearInterval(heartbeatInterval);
            clearInterval(dataInterval);
        });
    });
}

// Start simulation for all devices
DEVICES.forEach(simulateDevice);
