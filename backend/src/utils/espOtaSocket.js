// const WebSocket = require("ws");
// const axios = require("axios");
// const deviceModel = require("../models/deviceModel");

// const connectedDevices = new Map();
// const dashboardClients = new Set();

// const HEARTBEAT_INTERVAL = 5000;
// const HEARTBEAT_TIMEOUT = 15000;

// // ---------------- BROADCAST ----------------
// function broadcastToDashboards(payload) {
//     const data = JSON.stringify(payload);
//     for (const ws of dashboardClients) {
//         if (ws.readyState === WebSocket.OPEN) ws.send(data);
//     }
// }

// // ---------------- SEND OTA UPDATE ----------------
// async function sendOTAUpdate(ws, deviceId, firmwareUrl) {
//     try {
//         console.log(`OTA started for device: ${deviceId}`);
//         const entry = connectedDevices.get(deviceId);
//         if (entry) entry.isOtaInProgress = true;

//         const response = await axios.get(firmwareUrl, {
//             responseType: "arraybuffer",
//             transformResponse: [(d) => d],
//         });

//         const firmwareBuffer = Buffer.from(response.data);

//         if (firmwareBuffer[0] !== 0xE9) {
//             throw new Error("Invalid ESP32 firmware");
//         }

//         const chunkSize = 4096;
//         let offset = 0;

//         ws.send(JSON.stringify({
//             type: "ota_start",
//             size: firmwareBuffer.length,
//             chunkSize,
//             chunks: Math.ceil(firmwareBuffer.length / chunkSize),
//         }));

//         ws.otaState = { firmwareBuffer, offset, chunkSize, deviceId };
//         sendNextChunk(ws);

//     } catch (err) {
//         const entry = connectedDevices.get(deviceId);
//         if (entry) entry.isOtaInProgress = false;

//         broadcastToDashboards({
//             type: "ota_result",
//             deviceId,
//             status: "fail",
//             message: err.message
//         });

//         ws.send(JSON.stringify({ type: "ota_error", message: err.message }));
//     }
// }

// function sendNextChunk(ws) {
//     if (ws.readyState !== WebSocket.OPEN) return;
//     const state = ws.otaState;
//     if (!state) return;

//     const { firmwareBuffer, offset, chunkSize, deviceId } = state;

//     if (offset >= firmwareBuffer.length) {
//         console.log(`All chunks sent to ${deviceId}, sending ota_end`);
//         ws.send(JSON.stringify({ type: "ota_end" }));
//         return;
//     }

//     const chunk = firmwareBuffer.slice(offset, offset + chunkSize);

//     ws.send(JSON.stringify({
//         type: "ota_chunk",
//         offset,
//         data: chunk.toString("base64"),
//     }));
// }

// // ---------------- ESP OTA SOCKET ----------------
// function initEspOtaSocket(server) {
//     const wss = new WebSocket.Server({ noServer: true });
//     console.log("ESP OTA WebSocket initialized");

//     // Heartbeat monitor
//     setInterval(() => {
//         const now = Date.now();

//         for (const [deviceId, entry] of connectedDevices.entries()) {
//             if (!entry.lastHeartbeat) continue;

//             if (
//                 entry.ws.readyState !== WebSocket.OPEN ||
//                 (!entry.isOtaInProgress && now - entry.lastHeartbeat > HEARTBEAT_TIMEOUT)
//             ) {
//                 console.log(`Heartbeat timeout: ${deviceId}`);

//                 // Mark OTA failed if in progress
//                 if (entry.isOtaInProgress) {
//                     broadcastToDashboards({
//                         type: "ota_result",
//                         deviceId,
//                         status: "fail",
//                         message: "Device disconnected during OTA"
//                     });
//                 }

//                 connectedDevices.delete(deviceId);

//                 broadcastToDashboards({
//                     type: "device_disconnected",
//                     deviceId,
//                     reason: "heartbeat_timeout",
//                 });
//             }
//         }
//     }, HEARTBEAT_INTERVAL);

//     wss.on("connection", (ws, req) => {
//         const isDashboard = req.url?.includes("admin=true");

//         // DASHBOARD CONNECTION
//         if (isDashboard) {
//             dashboardClients.add(ws);
//             console.log("Dashboard connected");

//             const deviceList = Array.from(connectedDevices.entries()).map(([id, d]) => ({
//                 deviceId: id,
//                 status: d.status,
//                 connectedAt: d.connectedAt,
//                 lastHeartbeat: d.lastHeartbeat
//             }));

//             console.log("Sending device list to dashboard:");
//             console.table(deviceList);

//             ws.send(JSON.stringify({ type: "device_list", devices: deviceList }));

//             ws.on("close", () => dashboardClients.delete(ws));
//             ws.on("error", () => dashboardClients.delete(ws));
//             return;
//         }

//         // DEVICE CONNECTION
//         let deviceId = null;
//         console.log("🔌 New OTA WebSocket connection");

//         ws.on("message", async (message) => {
//             try {
//                 const data = JSON.parse(message.toString());

//                 switch (data.type) {
//                     case "register":
//                         deviceId = data.deviceId;
//                         connectedDevices.set(deviceId, {
//                             ws,
//                             connectedAt: new Date(),
//                             status: "connected",
//                             lastHeartbeat: Date.now(),
//                         });

//                         console.log(`Device registered: ${deviceId}`);

//                         broadcastToDashboards({
//                             type: "device_connected",
//                             deviceId,
//                             time: new Date(),
//                         });

//                         ws.send(JSON.stringify({ type: "registered", status: "success" }));
//                         break;

//                     case "ota_chunk_ack":
//                         if (ws.otaState) {
//                             ws.otaState.offset += ws.otaState.chunkSize;
//                             sendNextChunk(ws);
//                         }
//                         break;

//                     case "heartbeat":
//                         if (deviceId && connectedDevices.has(deviceId)) {
//                             connectedDevices.get(deviceId).lastHeartbeat = Date.now();
//                         }
//                         ws.send(JSON.stringify({ type: "heartbeat_ack" }));
//                         break;

//                     case "ota_request":
//                         if (data.firmwareUrl) {
//                             const entry = connectedDevices.get(deviceId);
//                             if (entry && data.versionId) entry.currentVersionId = data.versionId;
//                             await sendOTAUpdate(ws, deviceId, data.firmwareUrl);
//                         }
//                         break;

//                     case "ota_progress":
//                         broadcastToDashboards({
//                             type: "ota_progress",
//                             deviceId,
//                             progress: data.progress,
//                         });
//                         console.log(`OTA progress ${deviceId}: ${data.progress}%`);
//                         break;

//                     case "ota_complete":
//                         const entry = connectedDevices.get(deviceId);
//                         if (entry?.currentVersionId) {
//                             try {
//                                 await deviceModel.findOneAndUpdate(
//                                     { deviceId },
//                                     { versionId: entry.currentVersionId },
//                                     { new: true }
//                                 );
//                                 console.log(`Updated versionId for ${deviceId} → ${entry.currentVersionId}`);
//                             } catch (err) {
//                                 console.error("DB update error:", err);
//                             }
//                         }

//                         if (entry) {
//                             entry.isOtaInProgress = false;
//                             entry.currentVersionId = null;
//                         }

//                         broadcastToDashboards({
//                             type: "ota_result",
//                             deviceId,
//                             status: "success",
//                         });

//                         console.log(`OTA completed successfully for ${deviceId}`);
//                         break;

//                     case "ota_error":
//                         const errEntry = connectedDevices.get(deviceId);
//                         if (errEntry) {
//                             errEntry.isOtaInProgress = false;
//                             errEntry.currentVersionId = null;
//                         }
//                         broadcastToDashboards({
//                             type: "ota_result",
//                             deviceId,
//                             status: "fail",
//                             message: data.message,
//                         });
//                         console.error(`OTA failed for ${deviceId}: ${data.message}`);
//                         break;

//                     default:
//                         break;
//                 }
//             } catch (err) {
//                 console.error("OTA WebSocket message error:", err);
//             }
//         });

//         ws.on("close", () => {
//             if (!deviceId) return;

//             const entry = connectedDevices.get(deviceId);
//             if (entry?.isOtaInProgress) {
//                 broadcastToDashboards({
//                     type: "ota_result",
//                     deviceId,
//                     status: "fail",
//                     message: "Device disconnected during OTA",
//                 });
//             }

//             connectedDevices.delete(deviceId);

//             broadcastToDashboards({
//                 type: "device_disconnected",
//                 deviceId,
//             });

//             console.log(`Device disconnected: ${deviceId}`);
//         });

//         ws.on("error", (err) => {
//             console.error("OTA WebSocket error:", err);
//         });
//     });

//     return wss;
// }

// module.exports = {
//     connectedDevices,
//     dashboardClients,
//     broadcastToDashboards,
//     sendOTAUpdate,
//     initEspOtaSocket,
// };


const WebSocket = require("ws");
const axios = require("axios");
const deviceModel = require("../models/deviceModel");

const connectedDevices = new Map();
const dashboardClients = new Set();

const HEARTBEAT_INTERVAL = 5000;
const HEARTBEAT_TIMEOUT = 15000;

// ---------------- BROADCAST ----------------
function broadcastToDashboards(payload) {
    const data = JSON.stringify(payload);
    for (const ws of dashboardClients) {
        if (ws.readyState === WebSocket.OPEN) ws.send(data);
    }
}

// ---------------- SEND OTA UPDATE ----------------
async function sendOTAUpdate(ws, deviceId, firmwareUrl) {
    try {
        // Check if device exists in MongoDB
        const dbDevice = await deviceModel.findOne({ deviceId });
        if (!dbDevice) {
            console.log(`Device ${deviceId} not found in DB. Skipping OTA.`);
            ws.send(JSON.stringify({
                type: "ota_error",
                message: "Device not registered in database, OTA skipped."
            }));
            broadcastToDashboards({
                type: "ota_result",
                deviceId,
                status: "fail",
                message: "Device not registered in DB, OTA skipped."
            });
            return;
        }

        console.log(`OTA started for device: ${deviceId}`);
        const entry = connectedDevices.get(deviceId);
        if (entry) entry.isOtaInProgress = true;

        const response = await axios.get(firmwareUrl, {
            responseType: "arraybuffer",
            transformResponse: [(d) => d],
        });

        const firmwareBuffer = Buffer.from(response.data);

        if (firmwareBuffer[0] !== 0xE9) {
            throw new Error("Invalid ESP32 firmware");
        }

        const chunkSize = 4096;
        let offset = 0;

        ws.send(JSON.stringify({
            type: "ota_start",
            size: firmwareBuffer.length,
            chunkSize,
            chunks: Math.ceil(firmwareBuffer.length / chunkSize),
        }));

        ws.otaState = { firmwareBuffer, offset, chunkSize, deviceId };
        sendNextChunk(ws);

    } catch (err) {
        const entry = connectedDevices.get(deviceId);
        if (entry) entry.isOtaInProgress = false;

        broadcastToDashboards({
            type: "ota_result",
            deviceId,
            status: "fail",
            message: err.message
        });

        ws.send(JSON.stringify({ type: "ota_error", message: err.message }));
    }
}

function sendNextChunk(ws) {
    if (ws.readyState !== WebSocket.OPEN) return;
    const state = ws.otaState;
    if (!state) return;

    const { firmwareBuffer, offset, chunkSize, deviceId } = state;

    if (offset >= firmwareBuffer.length) {
        console.log(`All chunks sent to ${deviceId}, sending ota_end`);
        ws.send(JSON.stringify({ type: "ota_end" }));
        return;
    }

    const chunk = firmwareBuffer.slice(offset, offset + chunkSize);

    ws.send(JSON.stringify({
        type: "ota_chunk",
        offset,
        data: chunk.toString("base64"),
    }));
}

// ---------------- ESP OTA SOCKET ----------------
function initEspOtaSocket(server) {
    const wss = new WebSocket.Server({ noServer: true });
    console.log("ESP OTA WebSocket initialized");

    // Heartbeat monitor
    setInterval(() => {
        const now = Date.now();

        for (const [deviceId, entry] of connectedDevices.entries()) {
            if (!entry.lastHeartbeat) continue;

            if (
                entry.ws.readyState !== WebSocket.OPEN ||
                (!entry.isOtaInProgress && now - entry.lastHeartbeat > HEARTBEAT_TIMEOUT)
            ) {
                console.log(`Heartbeat timeout: ${deviceId}`);

                if (entry.isOtaInProgress) {
                    broadcastToDashboards({
                        type: "ota_result",
                        deviceId,
                        status: "fail",
                        message: "Device disconnected during OTA"
                    });
                }

                connectedDevices.delete(deviceId);

                broadcastToDashboards({
                    type: "device_disconnected",
                    deviceId,
                    reason: "heartbeat_timeout",
                });
            }
        }
    }, HEARTBEAT_INTERVAL);

    wss.on("connection", (ws, req) => {
        const isDashboard = req.url?.includes("admin=true");

        if (isDashboard) {
            dashboardClients.add(ws);
            console.log("Dashboard connected");

            const deviceList = Array.from(connectedDevices.entries()).map(([id, d]) => ({
                deviceId: id,
                status: d.status,
                connectedAt: d.connectedAt,
                lastHeartbeat: d.lastHeartbeat
            }));

            console.log("Sending device list to dashboard:");
            console.table(deviceList);

            ws.send(JSON.stringify({ type: "device_list", devices: deviceList }));

            ws.on("close", () => dashboardClients.delete(ws));
            ws.on("error", () => dashboardClients.delete(ws));
            return;
        }

        let deviceId = null;
        console.log("🔌 New OTA WebSocket connection");

        ws.on("message", async (message) => {
            try {
                const data = JSON.parse(message.toString());

                switch (data.type) {
                    case "register":
                        deviceId = data.deviceId;

                        // Only add device if it exists in DB
                        const dbDevice = await deviceModel.findOne({ deviceId });
                        if (!dbDevice) {
                            console.log(`Device ${deviceId} not in DB, ignoring registration.`);
                            ws.send(JSON.stringify({
                                type: "registered",
                                status: "fail",
                                message: "Device not registered in DB"
                            }));
                            return;
                        }

                        connectedDevices.set(deviceId, {
                            ws,
                            connectedAt: new Date(),
                            status: "connected",
                            lastHeartbeat: Date.now(),
                        });

                        console.log(`Device registered: ${deviceId}`);

                        broadcastToDashboards({
                            type: "device_connected",
                            deviceId,
                            time: new Date(),
                        });

                        ws.send(JSON.stringify({ type: "registered", status: "success" }));
                        break;

                    case "ota_chunk_ack":
                        if (ws.otaState) {
                            ws.otaState.offset += ws.otaState.chunkSize;
                            sendNextChunk(ws);
                        }
                        break;

                    case "heartbeat":
                        if (deviceId && connectedDevices.has(deviceId)) {
                            connectedDevices.get(deviceId).lastHeartbeat = Date.now();
                        }
                        ws.send(JSON.stringify({ type: "heartbeat_ack" }));
                        break;

                    case "ota_request":
                        if (data.firmwareUrl) {
                            const entry = connectedDevices.get(deviceId);
                            if (entry && data.versionId) entry.currentVersionId = data.versionId;
                            await sendOTAUpdate(ws, deviceId, data.firmwareUrl);
                        }
                        break;

                    case "ota_progress":
                        broadcastToDashboards({
                            type: "ota_progress",
                            deviceId,
                            progress: data.progress,
                        });
                        console.log(`OTA progress ${deviceId}: ${data.progress}%`);
                        break;

                    case "ota_complete":
                        const entry = connectedDevices.get(deviceId);
                        if (entry?.currentVersionId) {
                            try {
                                await deviceModel.findOneAndUpdate(
                                    { deviceId },
                                    { versionId: entry.currentVersionId },
                                    { new: true }
                                );
                                console.log(`Updated versionId for ${deviceId} → ${entry.currentVersionId}`);
                            } catch (err) {
                                console.error("DB update error:", err);
                            }
                        }

                        if (entry) {
                            entry.isOtaInProgress = false;
                            entry.currentVersionId = null;
                        }

                        broadcastToDashboards({
                            type: "ota_result",
                            deviceId,
                            status: "success",
                        });

                        console.log(`OTA completed successfully for ${deviceId}`);
                        break;

                    case "ota_error":
                        const errEntry = connectedDevices.get(deviceId);
                        if (errEntry) {
                            errEntry.isOtaInProgress = false;
                            errEntry.currentVersionId = null;
                        }
                        broadcastToDashboards({
                            type: "ota_result",
                            deviceId,
                            status: "fail",
                            message: data.message,
                        });
                        console.error(`OTA failed for ${deviceId}: ${data.message}`);
                        break;

                    default:
                        break;
                }
            } catch (err) {
                console.error("OTA WebSocket message error:", err);
            }
        });

        ws.on("close", () => {
            if (!deviceId) return;

            const entry = connectedDevices.get(deviceId);
            if (entry?.isOtaInProgress) {
                broadcastToDashboards({
                    type: "ota_result",
                    deviceId,
                    status: "fail",
                    message: "Device disconnected during OTA",
                });
            }

            connectedDevices.delete(deviceId);

            broadcastToDashboards({
                type: "device_disconnected",
                deviceId,
                reason: entry?.isOtaInProgress ? "ota_disconnect" : "normal_disconnect",
            });

            console.log(`Device disconnected: ${deviceId}`);
        });

        ws.on("error", (err) => {
            console.error("OTA WebSocket error:", err);
        });
    });

    return wss;
}

module.exports = {
    connectedDevices,
    dashboardClients,
    broadcastToDashboards,
    sendOTAUpdate,
    initEspOtaSocket,
};
