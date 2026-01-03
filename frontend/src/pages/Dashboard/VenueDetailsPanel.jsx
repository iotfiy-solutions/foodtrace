// import AlertsChart from "./AlertsChart";
// import { useDispatch, useSelector } from "react-redux";
// import { useStore } from "../../contexts/storecontexts";
// import { useEffect } from "react";
// import QRCode from "./QrCode";
// import { useLocation } from "react-router-dom";
// import CloseIcon from '@mui/icons-material/Close';
// import { IconButton, Skeleton } from "@mui/material";
// import { fetchVenuesByOrganization } from "../../slices/VenueSlice";
// import { Download } from "lucide-react";
// import Swal from "sweetalert2";

// export default function VenueDetailsPanel({
//   organizationId = null,
//   venueName = "Karim Korangi Branch",
//   freezerTemperature = false,
//   ambientTemperature = 25,
//   batteryLow = true,
//   needMaintenance = true,
//   apiKey = "",
//   closeIcon = false,
//   onClose = undefined,
//   humidity=0,
//   espOdour=0,
//   odourAlert = false,
//   temperatureAlert = false,
//   humidityAlert = false,
//   deviceId = "",
//   lastUpdateTime=null
// }) {
//   const dispatch = useDispatch();
//   const { user } = useStore();
//   const orgId = organizationId || user?.organization || null;

  
// const location = useLocation();
// const params = new URLSearchParams(location.search);
// const venueId = params.get("venue"); // gives the ID

// // const venuesFromSlice = useSelector((state) => state.Venue.Venues || []);

// // const currentVenueSlice = venuesFromSlice.find(v => v._id === venueId) || null;

//  // --- select cached venues for this org
//   const orgVenues = useSelector(
//     (state) => (orgId ? state.Venue.venuesByOrg[orgId] || [] : [])
//   );

//   // --- fallback to global Venues
//   const globalVenues = useSelector((state) => state.Venue.Venues || []);

//     // --- merged array: org venues preferred, fallback to global
//   const venuesFromSlice = orgVenues.length ? orgVenues : globalVenues;

//   console.log("ORGID", orgId)
//   // --- Redux selector: get all alerts for this org
//   const orgAlerts = useSelector((s) =>
//     orgId
//       ? s.alerts?.byOrg?.[orgId] ?? { venues: [], loading: false, error: null }
//       : { venues: [], loading: false, error: null }
//   );

//   // // --- Fetch alerts on mount
//   // useEffect(() => {
//   //   if (orgId) dispatch(fetchAlertsByOrg(orgId));
//   // }, [orgId, dispatch]);

//    // --- fetch venues by org if needed
//   useEffect(() => {
//     if (orgId && !orgVenues.length) {
//       dispatch(fetchVenuesByOrganization(orgId));
//     }
//   }, [orgId, orgVenues.length, dispatch]);

//   const venues = orgAlerts?.venues || [];
 
//   const handleDownload = () => {
//     Swal.fire({
//         icon: "info", // or "warning"
//         title: "Coming Soon!",
//         text: "This feature is not available yet. Stay tuned!",
//         confirmButtonText: "OK"
//       });
//   };

//   const sameId = (a, b) => String(a) === String(b);

//    const toInt = (v) => {
//     const n = Number(v);
//     return Number.isFinite(n) ? Math.trunc(n) : null;
//   };

// // --- find current venue
//   const currentVenueSlice =
//     venuesFromSlice.find((v) => sameId(v._id, venueId) || sameId(v.id, venueId)) || null;

//   // --- computed display name
//   const displayVenueName =
//     currentVenueSlice?.name ||
//     currentVenueSlice?.venueName ||
//     venueName ||
//     "Venue";



//     // computed display values (only integer part)
//   const displayTemp = toInt(ambientTemperature);
//   const displayHumidity = toInt(humidity);


//   // helper to format backend timestamp
// const formatLastUpdate = (time) => {
//   if (!time) return null; // handle null

//   const date = new Date(time);

//   // Example: 11 Dec 2025, 19:11
//   const options = {
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//   };
//   return date.toLocaleString(undefined, options); // uses user's locale
// };




//   return (
//     <div
//       className="w-full rounded-lg p-6 shadow-sm space-y-6"
//       style={{ backgroundColor: "#07518D12" }}
//     >
//      {closeIcon && (
//         // only render button when `closeIcon` true (mobile drawer)
//         <div className="flex justify-between items-center">
//           <img src="/iotfiy_logo_rpanel.svg" alt="IOTFIY LOGO" className="h-[30px] w-auto" />

//           <IconButton
//             onClick={() => {
//               if (typeof onClose === "function") onClose(); // guard, then call
//             }}
//             edge="start"
//             aria-label="close-details"
//             size="small"
//           >
//             <CloseIcon />
//           </IconButton>
//         </div>
//       )}
      
//       {/* A. Venue Info Section */}
//       <div className="flex justify-between items-center pb-4 border-b border-[#E5E7EB]/40 mb-6">
//         <div>
//           <p className="text-sm text-[#64748B] font-medium">Device ID </p>
//           {/* <h2 className="text-sm text-[#1E293B] font-bold">{displayVenueName}</h2> */}
//           <h2 className="text-sm text-[#1E293B] font-bold">{deviceId || <Skeleton variant="text" width={70}  />}</h2>
//         </div>
//         <button
//           onClick={handleDownload}
//           className="inline-flex items-center gap-2 px-3 py-2 bg-[#0D5CA4] text-white rounded-full text-xs font-semibold hover:bg-[#0b4e8a]  active:scale-[.98] transition shadow-sm cursor-pointer "
//           aria-label="Download"
//         >
//           <span className="leading-none">Download</span>
//           <Download className="w-3.5 h-3.5" />
//         </button>
//       </div>

//       {/* B. Refrigerator Image */}
//       {/* <div className="relative w-full overflow-hidden mb-4">
//         <img
//           src="/ambient_freezer.svg"
//           alt="Refrigerator"
//           className="w-full h-auto object-cover"
//         />
//         <div className="flex flex-col items-center justify-center absolute top-[30%] left-[8%] ">
//       <h1 className="font-bold text-white text-lg">Freezer</h1>
//       <h1 className="font-bold text-white text-lg">{freezerTemperature}<span className="font-thin text-white">°C</span></h1>
//         </div>
//         <div className="flex flex-col items-center justify-center absolute top-[30%] right-[15%]">
//       <h1 className="font-bold text-[#07518D] text-lg">Ambient</h1>
//       <h1 className="font-bold text-[#07518D]  text-lg">{ambientTemperature}<span className="text-lg font-thin">°C</span></h1>
//         </div>
//       </div> */}

//       {/* C. Temperature Section */}
//       <div className="relative w-full overflow-hidden mb-6 bg-[#07518D]/[0.05] rounded-xl">
//         <div className="flex flex-col-3 justify-around items-center py-1 ">
//           <div className="flex flex-col-2 items-center justify-center ">
//             <img src="/odour-alert.svg" className="h-[70px] w-[35px]" />
          
//             <p className="text-md md:text-md lg:text-lg xl:text-xl font-semibold">
//               {/* {freezerTemperature ? "Detected" : "Normal"} */}
//               {espOdour}%
//           </p>

            
//           </div>

//           <div className="flex flex-col-2 items-center justify-center ">
//             <img src="/temperature-icon.svg" className="h-[60px] w-[35px]" />
//             <div className="flex flex-col items-end justify-end">
              
//               <p className="text-sm md:text-md lg:text-lg 2xl:text-2xl font-semibold">
//                 {displayTemp}
//                 <span className="xs:text-sm md:text-md 2xl:text-lg font-thin">C</span>
//               </p>
//             </div>
//           </div>

//            <div className="flex flex-col-2 items-center justify-center">
//             <img src="/humidity-alert.svg" className="h-[60px] w-[35px]" />
//             <div className="flex flex-col items-end justify-end">
             
//               <p className="text-sm md:text-md lg:text-lg 2xl:text-2xl font-semibold">
//                 {displayHumidity}
//                 <span className="xs:text-sm md:text-md  2xl:text-lg font-thin">%</span>
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* <div>
//           <h3><span></span>Alert Detected</h3>
//         </div> */}

//         {/* <img
//           src="red-alert-icon"
//           alt="Freezer and Ambient Combo"
//           className="w-full h-auto object-cover"
//         /> */}
//       </div>

//         <div className="icon-number-align">
//             <img src="/alert-icon.png" alt="Alert" className="w-4 h-4 mr-1" />
//             <span className="text-[#0D5CA4] text-sm font-medium underline  decoration-[#0D5CA4] decoration-[0.5px] ">Alerts Status</span>
//         </div>
      
//       <div className="grid grid-cols-3 gap-1 ">
      
//         <div className={`icon-number-align border border-1 rounded-sm py-0.5 ${odourAlert ? "border-red-500": "border-gray-400"}`}>
//             <img src="/odour-alert.svg" alt="Alert" className="w-6 h-6 " />
//             <span className="text-[#1E293B] text-xs ">{odourAlert? "Alert Det.": "Not Det."}</span>
//         </div>
//         <div className={`icon-number-align border border-1 rounded-sm py-0.5 ${temperatureAlert ? "border-green-500": "border-gray-400"}`}>
//             <img src="/temperature-icon.svg" alt="Alert" className="w-6 h-6 " />
//             <span className="text-[#1E293B] text-xs ">{temperatureAlert? "Alert Det.": "Not Det."}</span>
//         </div>
//         <div className={`icon-number-align border border-1 rounded-sm py-0.5  ${humidityAlert ? "border-green-500": "border-gray-400"}`}>
//             <img src="/humidity-alert.svg" alt="Alert" className="w-6 h-6 " />
//             <span className="text-[#1E293B] text-xs ">{humidityAlert? "Alert Det.": "Not Det."}</span>
//         </div>
//       </div>
        

        
//       {/* D. Alerts Chart */}
//       {/* <div className="mb-6">
//         {venues.length > 0 ? (
//           <AlertsChart venues={venues} defaultMode="battery" />
//         ) : (
//           <p className="text-sm text-gray-500 text-center">
//             No alert data available
//           </p>
//         )}
//       </div> */}
//       <div>
//     {/* {apiKey && (
//       <div className="mt-3  p-2 rounded-md bg-white border border-gray-200 text-sm text-gray-700 break-words px-2">
//         <div className="flex items-center justify-between ">
//           <div>
//         <strong>API Key:</strong>
//             <div className="mt-2 text-sm " title={apiKey}>
//               {apiKey ? `${apiKey.slice(0, 15)}...` : ""}
//             </div>
//           </div>

//           <QRCode apiKey={apiKey} baseUrl={import.meta.env.VITE_REACT_URI || 'http://localhost:5173'} />
//         </div>
//       </div>
//     )} */}



// {apiKey ? (
//   <div className="mt-3 p-2 rounded-md bg-white border border-gray-200 text-sm text-gray-700 break-words px-2">
//     <div className="flex items-center justify-between">
//       <div>
//         <strong>API Key:</strong>
//         <div className="mt-2 text-sm" title={apiKey}>
//           {apiKey ? `${apiKey.slice(0, 15)}...` : ""}
//         </div>
//       </div>

//       <QRCode apiKey={apiKey} baseUrl={import.meta.env.VITE_REACT_URI || 'http://localhost:5173'} />
//     </div>
//   </div>
// ) : (
//   <div className="mt-3 p-2 rounded-md bg-white border border-gray-200 text-sm text-gray-700 break-words px-2">
//     <div className="flex items-center justify-between">
//       <div>
//         {/* <strong>API Key:</strong> */}
//         <Skeleton variant="text" width={50} height={20} className="mb-2" />
//         <Skeleton variant="text" width={120} height={20} className="mb-2" />
//       </div>
//     <Skeleton variant="rectangular" width={80} height={80} sx={{ borderRadius: "10%" }}  />
//   </div>
//   </div>
// )}

// {
//   lastUpdateTime ? <div  className="text-center mt-3 p-2  rounded-xl bg-[#07518D]/[0.05] font-thin text-xs sm:text-md ">Last Update: {formatLastUpdate(lastUpdateTime)}</div>: ""
// }

//       </div>
//     </div>
//   );
// }








import AlertsChart from "./AlertsChart";
import { useDispatch, useSelector } from "react-redux";
import { useStore } from "../../contexts/storecontexts";
import { useEffect } from "react";
import QRCode from "./QrCode";
import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Skeleton, useMediaQuery } from "@mui/material";
import { fetchVenuesByOrganization } from "../../slices/VenueSlice";
import { Download } from "lucide-react";
import Swal from "sweetalert2";
import { fetchAlertsByOrg } from "../../slices/alertsSlice";


export default function VenueDetailsPanel({
  organizationId = null,
  freezerTemperature = 0,
  ambientTemperature = 0,
  batteryLow=false,
  temperatureAlert=false,
  apiKey = "",
  closeIcon = false,
  deviceId = "",
  onClose = undefined,
}) {
  const dispatch = useDispatch();
  const { user } = useStore();
  const orgId = organizationId || user?.organization || null;
   const isDesktop = useMediaQuery("(min-width:768px)");

  // --- select cached venues for this org
  const orgVenues = useSelector(
    (state) => (orgId ? state.Venue.venuesByOrg[orgId] || [] : [])
    
  );

  // console.log("ORGID", orgId)
  // --- Redux selector: get all alerts for this org
  const orgAlerts = useSelector((s) =>
    orgId
      ? s.alerts?.byOrg?.[orgId] ?? { venues: [], loading: false, error: null }
      : { venues: [], loading: false, error: null }
  );

  // useEffect(() => {
  //   if (orgId) dispatch(fetchAlertsByOrg(orgId));
  // }, [orgId, dispatch]);

  // --- fetch venues by org if needed
  useEffect(() => {
    if (orgId && !orgVenues.length) {
      dispatch(fetchVenuesByOrganization(orgId));
      dispatch(fetchAlertsByOrg(orgId));
    }
  }, [orgId, orgVenues.length, dispatch]);

  const venues = orgAlerts?.venues || [];

  const handleDownload = () => {
    Swal.fire({
      icon: "info", // or "warning"
      title: "Coming Soon!",
      text: "This feature is not available yet. Stay tuned!",
      confirmButtonText: "OK"
    });
  };

  const toInt = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? Math.trunc(n) : null;
  };


  // computed display values (only integer part)
  const displayAmbientTemp = toInt(ambientTemperature);
  const displayFreezerTemp = toInt(freezerTemperature);


  return (
    <>
    <div
      className="w-full rounded-lg p-6 sm:p-2 shadow-sm space-y-6"
      style={{ backgroundColor: "#07518D12" }}
    >
      {closeIcon && (
        // only render button when `closeIcon` true (mobile drawer)
        <div className="flex justify-between items-center">
          <img src="/iotfiy_logo_rpanel.svg" alt="IOTFIY LOGO" className="h-[30px] w-auto" />

          <IconButton
            onClick={() => {
              if (typeof onClose === "function") onClose(); // guard, then call
            }}
            edge="start"
            aria-label="close-details"
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </div>
      )}

      {/* A. Venue Info Section */}
      <div className="flex justify-between items-center border-b border-[#E5E7EB]/40 ">
        <div>
          <p className="text-sm text-[#64748B] font-medium">Device ID </p>
          <h2 className="text-sm text-[#1E293B] font-bold">{deviceId || <Skeleton variant="text" width={70} />}</h2>
        </div>
        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-2 px-3 py-2 bg-[#0D5CA4] text-white rounded-full text-xs font-semibold hover:bg-[#0b4e8a]  active:scale-[.98] transition shadow-sm cursor-pointer "
          aria-label="Download"
        >
          <span className="leading-none">Download</span>
          <Download className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* B. Refrigerator Image */}
      <div className="relative w-full overflow-hidden mb-2 sm:mb-1">
        <img
          src="/ambient_freezer.svg"
          alt="Refrigerator"
          className="w-full h-auto object-cover"
        />
        <div className="flex flex-col items-center justify-center absolute top-[30%] left-[10%] ">
          <h1 className="font-bold text-[#1A5B65] text-lg">Freezer</h1>
          <h1 className="font-bold text-[#1A5B65] text-lg 2xl:text-2xl">{displayFreezerTemp}<span className="font-thin text-[#1A5B65]">°C</span></h1>
        </div>
        <div className="flex flex-col items-center justify-center absolute top-[30%] right-[8%]">
          <h1 className="font-bold text-[#07518D] text-lg">Ambient</h1>
          <h1 className="font-bold text-[#07518D]  text-lg 2xl:text-2xl">{displayAmbientTemp}<span className="text-lg font-thin">°C</span></h1>
        </div>
      </div>

      {/* C. Temperature Section */}
      {/* <div className="relative w-full overflow-hidden mb-6 bg-[#07518D]/[0.05] rounded-xl">
        <div className="flex flex-col-2 justify-around items-center my-2 gap-5">
          <div className="flex flex-col-2 items-center justify-center ">
            <img src="/freezer-icon.svg" className="h-[60px] w-[30px]" />
            <div className="flex flex-col justify-end items-end">
              <h1 className="text-sm font-semibold">Freezer</h1>
              <p className="text-sm md:text-md lg:text-lg 2xl:text-2xl font-semibold">
                {displayFreezerTemp}
                <span className="xs:text-sm md:text-md  2xl:text-lg font-thin">°C</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col-2 items-center justify-center ">
            <img src="/ambient-icon.svg" className="h-[60px] w-[30px]" />
            <div className="flex flex-col items-end justify-end">
              <h1 className="text-sm font-semibold">Ambient</h1>
              <p className="text-sm md:text-md lg:text-lg 2xl:text-2xl font-semibold">
                {displayAmbientTemp}
                <span className="xs:text-sm md:text-md  2xl:text-lg font-thin">°C</span>
              </p>
            </div>
          </div>
        </div>
      </div> */}

      <div className="grid grid-cols-2 gap-5 ">

        <div className={`icon-number-align border border-1 rounded-sm pl-1 py-0.5 ${batteryLow ? "border-yellow-600" : "border-gray-400"}`}>
          <img src="/alert-icon.png" alt="Alert" className="w-4 h-4  " />
          <span className="text-[#1E293B] text-xs ">{batteryLow ? "Alert Detected" : "Not Detected"}</span>
        </div>
        <div className={`icon-number-align border border-1 rounded-sm py-0.5 ${temperatureAlert ? "border-red-500" : "border-gray-400"}`}>
          <img src="/temperature-icon.svg" alt="Alert" className="w-6 h-6 " />
          <span className="text-[#1E293B] text-xs ">{temperatureAlert ? "Alert Detected" : "Not Detected"}</span>
        </div>
      </div>

   {apiKey ? (
          <div className="mt-3 sm:mt-1  p-2 rounded-md bg-white border border-gray-200 text-sm text-gray-700 break-words px-2">
            <div className="flex items-center justify-between">
              <div>
                <strong>API Key:</strong>
                <div className="mt-2 text-sm" title={apiKey}>
                  {apiKey ? `${apiKey.slice(0, 15)}...` : ""}
                </div>
              </div>

              <QRCode apiKey={apiKey} baseUrl={import.meta.env.VITE_REACT_URI || 'http://localhost:5173'} />
            </div>
          </div>
        ) : (
          <div className="mt-3 p-2 rounded-md bg-white border border-gray-200 text-sm text-gray-700 break-words px-2">
            <div className="flex items-center justify-between">
              <div>
                {/* <strong>API Key:</strong> */}
                <Skeleton variant="text" width={50} height={20} className="mb-2" />
                <Skeleton variant="text" width={120} height={20} className="mb-2" />
              </div>
              <Skeleton variant="rectangular" width={80} height={80} sx={{ borderRadius: "10%" }} />
            </div>
          </div>
        )}

         </div>

      {/* D. Alerts Chart */}
      {
        isDesktop &&  
      <div className="mt-2 z-33">
        {venues.length > 0 ? (
          <AlertsChart venues={venues} defaultMode="battery" />
        ) : (
          <p className="text-sm text-gray-500 text-center">
            No alert data available
          </p>
        )}
      </div>
      }
   
      
  </>
  );
}
