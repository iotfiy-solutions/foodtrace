import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE = import.meta.env.VITE_BACKEND_API || "http://localhost:5050";

const normalizeVenue = (v = {}) => {
  const venueId = String(v.venueId ?? v._id ?? (v.venue?._id) ?? "");
  const venueName = v.venueName ?? v.name ?? (v.venue?.name) ?? "Unknown Venue";

  const fridgeArr = Array.isArray(v.refrigeratorAlertDevices) ? v.refrigeratorAlertDevices : [];
  const batteryArr = Array.isArray(v.batteryAlertDevices) ? v.batteryAlertDevices : [];

  const makeDevice = (d) => ({
    id: d.deviceId ?? d.id ?? d._id ?? d.name ?? "unknown-id",
    name: d.name ?? d.deviceId ?? d.id ?? d._id ?? "Unknown Device",
    date: d.date ?? d.timestamp ?? null,
    ambient: d.ambient ?? d.AmbientData?.temperature ?? null,
    freezer: d.freezer ?? d.FreezerData?.temperature ?? null,
  });
  

  const refrigeratorAlertDevices = fridgeArr.map(makeDevice);
  const batteryAlertDevices = batteryArr.map(makeDevice);

  const refrigeratorAlertCount = Number(v.refrigeratorAlertCount ?? refrigeratorAlertDevices.length ?? 0) || 0;
  const batteryAlertCount = Number(v.batteryAlertCount ?? batteryAlertDevices.length ?? 0) || 0;
  const totalAlerts = Number(v.totalAlerts ?? (refrigeratorAlertCount + batteryAlertCount)) || 0;

  return {
    venueId,
    venueName,
    totalDevices: Number(v.totalDevices ?? 0) || 0,
    totalAlerts,
    refrigeratorAlertCount,
    refrigeratorAlertDevices,
    batteryAlertCount,
    batteryAlertDevices,
  };
};

/**
 * Thunk: fetch alerts for an organization
 */
export const fetchAlertsByOrg = createAsyncThunk(
  "alerts/fetchByOrg",
  async (organizationId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE}/alert/${organizationId}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.message || "Failed to fetch alerts");

      const rawVenues = Array.isArray(data) ? data : data.venues ?? data.payload ?? [];
      console.log("rawVenes>", rawVenues);
      return { organizationId, venues: rawVenues };
    } catch (err) {
      return rejectWithValue(err.message || "Network error");
    }
  }
);

const initialState = {
  byOrg: {},
};

const alertsSlice = createSlice({
  name: "alerts",
  initialState,
  reducers: {
    /**
     * deviceDataReceived
     * payload: { organizationId, device }
     */
    deviceDataReceived(state, action) {
      const { organizationId, device } = action.payload || {};
      if (!organizationId || !device) return;

      if (!state.byOrg[organizationId]) {
        state.byOrg[organizationId] = { venues: [], loading: false, error: null, unassigned: [] };
      }

      const org = state.byOrg[organizationId];
      const deviceId = device.deviceId ?? device.id ?? device._id ?? null;
      if (!deviceId) return;

      // find venue by venueId or existing device membership
      let targetIndex = -1;
      if (device.venueId) {
        targetIndex = org.venues.findIndex((vv) => String(vv.venueId) === String(device.venueId));
      }
      if (targetIndex === -1) {
        targetIndex = org.venues.findIndex((vv) =>
          (vv.refrigeratorAlertDevices || []).some((d) => String(d.id) === String(deviceId)) ||
          (vv.batteryAlertDevices || []).some((d) => String(d.id) === String(deviceId)) 
        );
      }

      const makeDeviceEntry = () => ({
        id: deviceId,
        name: device.name ?? deviceId,
        date: device.timestamp ?? device.date ?? null,
        ambient: device.ambient ?? device.AmbientData?.temperature ?? null,
        freezer: device.freezer ?? device.FreezerData?.temperature ?? null,
      });

      const updateVenueAlerts = (vv) => {
       const fridgeDevices = Array.isArray(vv.refrigeratorAlertDevices) ? vv.refrigeratorAlertDevices.slice() : [];
        const batteryDevices = Array.isArray(vv.batteryAlertDevices) ? vv.batteryAlertDevices.slice() : [];

        const fridgeIdx = fridgeDevices.findIndex((d) => String(d.id) === String(deviceId));
        const batteryIdx = batteryDevices.findIndex((d) => String(d.id) === String(deviceId));

        // refrigerator alert handling
        const fridgeIsAlert = device.refrigeratorAlert === "ALERT" || device.refrigeratorAlert === true;
        if (fridgeIsAlert) {
          const entry = makeDeviceEntry();
          if (fridgeIdx === -1) fridgeDevices.unshift(entry);
          else fridgeDevices[fridgeIdx] = { ...fridgeDevices[fridgeIdx], ...entry };
        } else {
          // if server cleared, remove
          if (fridgeIdx !== -1 && device.refrigeratorAlert === false) {
            fridgeDevices.splice(fridgeIdx, 1);
          } else if (fridgeIdx !== -1) {
            // update timestamps/temps even if not changing alert flag
            fridgeDevices[fridgeIdx] = { ...fridgeDevices[fridgeIdx], ...makeDeviceEntry() };
          }
        }

        // battery alert handling
        const batteryIsAlert = device.batteryAlert === "LOW" || device.batteryAlert === true;
        if (batteryIsAlert) {
          const entry = makeDeviceEntry();
          if (batteryIdx === -1) batteryDevices.unshift(entry);
          else batteryDevices[batteryIdx] = { ...batteryDevices[batteryIdx], ...entry };
        } else {
          if (batteryIdx !== -1 && device.batteryAlert === false) {
            batteryDevices.splice(batteryIdx, 1);
          } else if (batteryIdx !== -1) {
            batteryDevices[batteryIdx] = { ...batteryDevices[batteryIdx], ...makeDeviceEntry() };
          }
        }

        return {
          ...vv,
          refrigeratorAlertDevices: fridgeDevices,
          refrigeratorAlertCount: fridgeDevices.length,
          batteryAlertDevices: batteryDevices,
          batteryAlertCount: batteryDevices.length,
          totalAlerts: fridgeDevices.length + batteryDevices.length,
        };
      
      };

      if (targetIndex !== -1) {
        org.venues[targetIndex] = updateVenueAlerts(org.venues[targetIndex]);
      } else {
        const entry = makeDeviceEntry();
        const unassigned = org.unassigned || [];
        const existingIdx = unassigned.findIndex((u) => u.id === deviceId);
        if (existingIdx !== -1) {
          unassigned[existingIdx] = { ...unassigned[existingIdx], ...entry };
        } else {
          unassigned.unshift({ id: deviceId, ...entry,  batteryAlert: device.batteryAlert, refrigeratorAlert: device.refrigeratorAlert  });
        }
        org.unassigned = unassigned;
      }
    },

    clearOrgAlerts(state, action) {
      const orgId = action.payload;
      if (orgId && state.byOrg[orgId]) {
        delete state.byOrg[orgId];
      }
    },

    upsertVenue(state, action) {
      const { organizationId, rawVenue } = action.payload || {};
      if (!organizationId || !rawVenue) return;
      if (!state.byOrg[organizationId]) state.byOrg[organizationId] = { venues: [], loading: false, error: null, unassigned: [] };
      const norm = normalizeVenue(rawVenue);
      const idx = state.byOrg[organizationId].venues.findIndex((v) => v.venueId === norm.venueId);
      if (idx === -1) state.byOrg[organizationId].venues.unshift(norm);
      else state.byOrg[organizationId].venues[idx] = norm;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlertsByOrg.pending, (state, action) => {
        const orgId = action.meta.arg;
        if (!state.byOrg[orgId]) state.byOrg[orgId] = { venues: [], loading: true, error: null, unassigned: [] };
        else {
          state.byOrg[orgId].loading = true;
          state.byOrg[orgId].error = null;
        }
      })
      .addCase(fetchAlertsByOrg.fulfilled, (state, action) => {
        const { organizationId, venues } = action.payload || {};
        if (!organizationId) return;
        const normalized = Array.isArray(venues) ? venues.map(normalizeVenue) : [];
        state.byOrg[organizationId] = { venues: normalized, loading: false, error: null, unassigned: [] };
      })
      .addCase(fetchAlertsByOrg.rejected, (state, action) => {
        const orgId = action.meta.arg;
        if (!state.byOrg[orgId]) state.byOrg[orgId] = { venues: [], loading: false, error: action.payload || action.error?.message || "Failed to fetch alerts", unassigned: [] };
        else {
          state.byOrg[orgId].loading = false;
          state.byOrg[orgId].error = action.payload || action.error?.message || "Failed to fetch alerts";
        }
      });
  },
});

export const { deviceDataReceived, clearOrgAlerts, upsertVenue } = alertsSlice.actions;
export default alertsSlice.reducer;
