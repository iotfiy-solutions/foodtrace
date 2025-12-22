import { useMemo } from "react";
import VenueDetailsPanel from "../pages/Dashboard/VenueDetailsPanel";


export default function DashboardRightPanel({
  freezerDevices = [],
  selectedFreezerDeviceId = null,
  selectedOrgId = null,
  className = "",
  onClose = undefined,
  closeIcon = false,
}) {

  const selected = useMemo(() => {
  if (!selectedFreezerDeviceId) return null;

  return freezerDevices.find(
    d => String(d._id ?? d.id ?? d.deviceId) === String(selectedFreezerDeviceId)
  ) ?? null;
}, [freezerDevices, selectedFreezerDeviceId]);


  console.log("selected", selected);

  return (
    <div
      className={`dashboard-right-panel shadow-sm flex flex-col h-full overflow-y-auto custom-scrollbar p-4 lg:p-6 border-l border-[#E5E7EB]/40 bg-white flex-shrink-0  ${className}`}
    >
      {selected ? (  
        <VenueDetailsPanel
          venueName={selected?.venueName ?? "Venue"}
          freezerTemperature={selected?.espFreezer ?? 0}
          ambientTemperature={selected?.espAmbient ?? 0}
          needMaintenance={selected?.needMaintenance ?? false}
          apiKey={selected?.apiKey}
          chartData={selected?.chartData ?? []}
          organizationId={selectedOrgId}
          closeIcon={closeIcon}   // forward
          onClose={onClose}       // forward
          deviceId={selected?.deviceId}
          batteryLow={selected?.batteryAlert ?? false}
          temperatureAlert={selected?.refrigeratorAlert}
          // lastUpdateTime={selected?.lastUpdateTime}
        />
      ) : (
        <VenueDetailsPanel
          venueName={"Venue"}
          freezerTemperature={0}
          ambientTemperature={0}
          needMaintenance={true}
          apiKey={""}
          chartData={[]}
          organizationId={selectedOrgId}
          closeIcon={closeIcon}   
          onClose={onClose}     
          deviceId = {""}
          batteryLow={false}
          temperatureAlert={false}
          // lastUpdateTime={null}
        />
      )}
    </div>
  );
}
