const deviceModel = require("../models/deviceModel");
const venueModel = require("../models/venueModal");

// Returns alerts for all venues under an organization
const getAlerts = async (req, res) => {
    try {
        const { organizationId } = req.params;

        // Get venues
        const venues = await venueModel.find({ organization: organizationId }).lean();
        if (!venues.length) {
            return res.status(404).json({ message: "No venues found" });
        }

        const venueIds = venues.map(v => v._id);

        // Get devices
        const devices = await deviceModel
            .find({ venue: { $in: venueIds } })
            .populate("venue", "name")
            .lean();

        const result = venues.map((venue) => {
            const venueDevices = devices.filter(
                d => d.venue._id.toString() === venue._id.toString()
            );

            // Devices having any alert
            const devicesWithAlerts = venueDevices.filter(
                d => d.batteryAlert || d.refrigeratorAlert
            );

            // Battery alerts
            const batteryAlerts = venueDevices
                .filter(d => d.batteryAlert)
                .map(d => ({
                    deviceId: d.deviceId,
                    ambient: d.espAmbient,
                    freezer: d.espFreezer,
                }));

            // Refrigerator alerts
            const refrigeratorAlerts = venueDevices
                .filter(d => d.refrigeratorAlert)
                .map(d => ({
                    deviceId: d.deviceId,
                    ambient: d.espAmbient,
                    freezer: d.espFreezer,
                }));

            return {
                venueId: venue._id,
                venueName: venue.name,
                totalDevices: venueDevices.length,

                // total alerts in this venue
                totalAlerts: devicesWithAlerts.length,

                // Battery alerts
                batteryAlertCount: batteryAlerts.length,
                batteryAlertDevices: batteryAlerts,

                // Refrigerator alerts
                refrigeratorAlertCount: refrigeratorAlerts.length,
                refrigeratorAlertDevices: refrigeratorAlerts,
            };
        });

        res.status(200).json({
            organizationId,
            venues: result,
        });

    } catch (err) {
        console.error("Error fetching alerts:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { getAlerts };

