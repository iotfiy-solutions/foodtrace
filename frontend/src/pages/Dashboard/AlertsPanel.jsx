// AlertsPanel.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AlertList from "./AlertList";
import { useStore } from "../../contexts/storecontexts";
import { fetchAlertsByOrg } from "../../slices/alertsSlice";

export default function AlertsPanel({ organizationId = null, pollInterval = null }) {
  const dispatch = useDispatch();
  const { user, getToken } = useStore();
  const token = getToken();
  const orgId = organizationId || user?.organization || null;

  const orgAlerts = useSelector((s) =>
    orgId ? s.alerts?.byOrg?.[orgId] ?? { venues: [], loading: false, error: null } : { venues: [], loading: false, error: null }
  );

  useEffect(() => {
    if (!orgId) return;
    dispatch(fetchAlertsByOrg(orgId, token));
  }, [orgId, dispatch]);

  useEffect(() => {
    if (!orgId || !pollInterval) return;
    const id = setInterval(() => {
      dispatch(fetchAlertsByOrg(orgId, token));
    }, pollInterval);
    return () => clearInterval(id);
  }, [orgId, pollInterval, dispatch]);

  const venues = orgAlerts?.venues || [];

  console.log("venues>", venues);

   const maintenanceItems = venues.map((v) => ({
    id: v.venueId,
    name: v.venueName,
    devices: v.refrigeratorAlertCount || 0,
    nestedItems: (v.refrigeratorAlertDevices || []).map((d) => ({ id: d.id, name: d.name, date: d.date })),
  }));


  const batteryItems = venues.map((v) => ({
    id: v.venueId,
    name: v.venueName,
    devices: v.batteryAlertCount || 0,
    nestedItems: (v.batteryAlertDevices || []).map((d) => ({ id: d.id, name: d.name, date: d.date })),
  }));

  return (
    <div className="flex-shrink-0 mb-16 md:mb-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-2 md:p-4 " style={{ backgroundColor: "#07518D12", borderRadius: "20px" }}>
          <AlertList title="Refrigerator Alert" iconSrc="/Refrigerator-icon.png" 
          items={maintenanceItems} />
        </div>
        <div className="p-2 md:p-4 " style={{ backgroundColor: "#07518D12", borderRadius: "20px" }}>
          <AlertList title="Battery Alert" items={batteryItems} />
        </div>
      </div>
    </div>
  );
}
