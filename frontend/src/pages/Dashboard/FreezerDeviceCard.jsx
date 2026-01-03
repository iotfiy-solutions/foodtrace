// import "../../styles/global/fonts.css";
// import "../../styles/pages/Dashboard/freezer-cards-responsive.css";

// export default function FreezerDeviceCard({
//   deviceId,
//   refrigeratorAlert,
//   ambientTemperature,
//   freezerTemperature,
//   batteryLow = false,
//   isSelected = false,
//   onCardSelect,
//   odourAlert = false,
//   temperatureAlert = false,
//   humidityAlert = false,
//   espHumidity = "",
//   espTemprature = "",
// }) {
//   // helper: convert to finite number and keep integer part (before decimal)
//  const toInt = (v) => {
//     const n = Number(v);
//     return Number.isFinite(n) ? Math.trunc(n) : null;
//   };

//   // computed display values (only integer part)
//   const displayTemp = toInt(espTemprature);
//   const displayHumidity = toInt(espHumidity);

//   const handleCardClick = () => {
//     if (onCardSelect) onCardSelect();
//   };

//   // Alert priority logic:
//   // - odour has highest priority
//   // - if odour false and any other alert present -> "other"
//   // - otherwise -> "none"
//   const hasOtherAlert = temperatureAlert || humidityAlert;
//   const alertStatus = odourAlert ? "odour" : hasOtherAlert ? "other" : "none";

//   const textClass = alertStatus !== "none" ? "text-white" : "text-black";


  
//   const AlertBottom = ({status}) => {
//     if(status === "odour"){
//       return(
//         <div className={`bg-white/20 -m-4 w-[calc(1zz00%+2rem)] py-1 px-5 flex items-center justify-between`}>
//             <h3 className={textClass}>Alert</h3>

//             <div className="flex items-center ">
//               <h4 className="mr-2">Detected</h4>
//               <div className="flex items-center justify-center ">
//               <img src="/humidity-alert.svg" alt="Humidity" className="h-[25px] w-[20px]" />
//               <img src="/white-temperature-dashboard.svg" alt="Humidity" className="h-[40px] w-[20px]" />
//               <img src="/odour-alert.svg" alt="Humidity" className="h-[30px] w-[30px]" />
//               </div>
//             </div>
//         </div>
//       )
//     }
//     else if(status === "other"){
//       return(
//         <>
//         <div className={`bg-white/20 -m-4 w-[calc(100%+2rem)] py-1 px-5 flex items-center justify-between`}>
//             <h3 className={textClass}>Alert</h3>

//             <div className="flex items-center ">
//               <h4 className="mr-2">Detected</h4>
//               <div className="flex items-center justify-center ">
//               <img src="/humidity-alert.svg" alt="Humidity" className="h-[25px] w-[20px]" />
//               <img src="/white-temperature-dashboard.svg" alt="Humidity" className="h-[40px] w-[20px]" />
//               <img src="/odour-alert.svg" alt="Humidity" className="h-[30px] w-[30px]" />
//               </div>
//             </div>
//         </div>
//         </>
//       )
//     }
    
//       return null;
    
//       }

//     // background classes — we only add utility classes, your CSS remains unchanged
//     const bgClass =
//       alertStatus === "odour"
//         ? "bg-[#CF4F4F]"
//         : alertStatus === "other"
//         ? "bg-green-400"
//         : "bg-white";

//     // selected transform + shadow (small feedback)
//   const selectedClass = isSelected
//     ? "shadow-lg transition-transform duration-300 ease-out"
//     : "transition-transform duration-300";

//     return (
//       <>
//       <div
//         onClick={handleCardClick}
//         // keep your existing 'freezer-card-container' class; append the bg + selected classes
//         // className={`freezer-card-container ${bgClass} ${selectedClass} `}

//         className={`freezer-card-container ${bgClass} ${selectedClass}  h-auto min-h-[180px] sm:h-auto`}
//         style={isSelected ? { transform: "scale(1.01)" } : {}}
//       >
//         <div className={`relative w-full h-full`}>
//           <div className="freezer-card-content">
          
//             <div className="device-id-section">
//               <div className="flex flex-col items-start">
//                 <span className={`device-id-label `}>Device ID</span>
//                 <h3 className={`device-id-value `}>{deviceId}</h3>
//               </div>

//               {/* Ambient Temperature Pill */}
//            <div className={`ambient-pill bg-white/20 border border-white/30 flex items-center `}>
//             <img src="/odour-alert.svg" alt="" className="h-[45px] w-[45px]" />
//             <p className="ml-2 md:text-md lg:text-lg xl:text-xl">
//               {odourAlert ? "Detected" : "Normal"}
//             </p>
//           </div>

//             </div>

//             {/* Middle Section: Freezer Temperature & Humidity */}
//             <div className="freezer-temp-section mb-3">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center">
//                   <img src="/card-humidity-icon.svg" alt="Humidity" className="freezer-icon" />

//                   <div className="freezer-temp-info">
//                     <span className={`freezer-label  ${textClass}`}>Humidity</span>
//                     <span className={`freezer-temp-value  ${textClass}`}>
//                       {displayHumidity !== null ? `${displayHumidity}%` : "--"}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="flex items-center">
//                   <img src="/temperature-icon.svg" alt="Temperature" className="freezer-icon" />

//                   <div className="freezer-temp-info">
//                     <span className={`freezer-label ${textClass} `}>Temperature</span>
//                     <span className={`freezer-temp-value ${textClass}`}>
//                       {displayTemp !== null ? `${displayTemp}°C` : "--"}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>

            
//             {/* Bottom area intentionally removed as requested (battery/refrigerator warnings removed) */}

                    
//             <AlertBottom status={alertStatus} />
          
//           </div>
//         </div>
//       </div>
//       </>
//     );
//   }



// import "../../styles/global/fonts.css";
// import "../../styles/pages/Dashboard/freezer-cards-responsive.css";

// export default function FreezerDeviceCard({
//   deviceId,
//   refrigeratorAlert,
//   ambientTemperature,
//   freezerTemperature,
//   batteryLow = false,
//   isSelected = false,
//   onCardSelect,
//   odourAlert = false,
//   temperatureAlert = false,
//   humidityAlert = false,
//   espHumidity = "",
//   espTemprature = "",
//   espOdour = 0,
// }) {
//   // helper: convert to finite number and keep integer part (before decimal)
//  const toInt = (v) => {
//     const n = Number(v);
//     return Number.isFinite(n) ? Math.trunc(n) : null;
//   };

//   // computed display values (only integer part)
//   const displayTemp = toInt(espTemprature);
//   const displayOdourPer = toInt(espOdour); 
//   const displayHumidity = toInt(espHumidity);

//   const handleCardClick = () => {
//     if (onCardSelect) onCardSelect();
//   };

//   // Alert priority logic:
//   // - odour has highest priority
//   // - if odour false and any other alert present -> "other"
//   // - otherwise -> "none"
//   const hasOtherAlert = temperatureAlert || humidityAlert;
//   const alertStatus = odourAlert ? "odour" : hasOtherAlert ? "other" : "none";

//   const textClass = alertStatus !== "none" ? "text-white" : "text-black";


  
//   const AlertBottom = ({ odourAlert, temperatureAlert, humidityAlert }) => {
//   const activeIcons = [];

//   if (odourAlert) activeIcons.push(
//     <img key="odour" src="/odour-alert.svg" alt="Odour" className="h-[30px] w-[30px]" />
//   );
//   if (temperatureAlert) activeIcons.push(
//     <img key="temp" src="/white-temperature-dashboard.svg" alt="Temperature" className="h-[40px] w-[20px]" />
//   );
//   if (humidityAlert) activeIcons.push(
//     <img key="humidity" src="/humidity-alert.svg" alt="Humidity" className="h-[25px] w-[20px]" />
//   );

//   // if no alerts, don't render the bottom section
//   if (activeIcons.length === 0) return null;

//   return(
//             <div className={`bg-white/20 -m-4 w-[calc(1zz00%+2rem)] py-1 px-5 flex items-center justify-between`}>
//             <h3 className={textClass}>Alert</h3>

//             <div className="flex items-center ">
//               <h4 className="mr-2">Detected</h4>
//               <div className="flex items-center justify-center ">
              
//                 {activeIcons}
//               </div>
//             </div>
//         </div>
//   )
    
//       }

//     // background classes — we only add utility classes, your CSS remains unchanged
//     const bgClass =
//       alertStatus === "odour"
//         ? "bg-[#CF4F4F]"
//         : alertStatus === "other"
//         ? "bg-green-400"
//         : "bg-white";

//     // selected transform + shadow (small feedback)
//   const selectedClass = isSelected
//     ? "shadow-lg transition-transform duration-300 ease-out"
//     : "transition-transform duration-300";

//     return (
//       <>
//       <div
//         onClick={handleCardClick}
//         // keep your existing 'freezer-card-container' class; append the bg + selected classes
//         // className={`freezer-card-container ${bgClass} ${selectedClass} `}

//         className={`freezer-card-container ${bgClass} ${selectedClass}  h-auto min-h-[180px] sm:h-auto`}
//         style={isSelected ? { transform: "scale(1.01)" } : {}}
//       >
//         <div className={`relative w-full h-full`}>
//           <div className="freezer-card-content">
          
//             <div className="device-id-section">
//               <div className="flex flex-col items-start">
//                 <span className={`device-id-label `}>Device ID</span>
//                 <h3 className={`device-id-value `}>{deviceId}</h3>
//               </div>

//               {/* Ambient Temperature Pill */}
//            <div className={`ambient-pill bg-white/20 border border-white/30 flex items-center `}>
//             <img src="/odour-alert.svg" alt="odour alert icon" className="h-[35px] w-[35px] xl:h-[40px] xl:w-[40px]" />
//            <div>
//             <p className="text-sm md:text-md 2xl:text-lg ">
//               {odourAlert ? "Detected" : "Normal"} <span className="text-sm md:text-md 2xl:text-lg">{displayOdourPer || 0}%</span>
//             </p>
//             {/* <p className="ml-2 text-sm md:text-md text-lg xl:text-xl"></p> */}
//            </div>
//           </div>

//             </div>

//             {/* Middle Section: Freezer Temperature & Humidity */}
//             <div className="freezer-temp-section mb-3">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center">
//                   <img src="/card-humidity-icon.svg" alt="Humidity" className="freezer-icon" />

//                   <div className="freezer-temp-info">
//                     <span className={`freezer-label  ${textClass}`}>Humidity</span>
//                     <span className={`freezer-temp-value  ${textClass}`}>
//                       {displayHumidity !== null ? `${displayHumidity}%` : "--"}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="flex items-center">
//                   <img src="/temperature-icon.svg" alt="Temperature" className="freezer-icon" />

//                   <div className="freezer-temp-info">
//                     <span className={`freezer-label ${textClass} `}>Temperature</span>
//                     <span className={`freezer-temp-value ${textClass}`}>
//                       {displayTemp !== null ? `${displayTemp}°C` : "--"}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>

            
//             {/* Bottom area intentionally removed as requested (battery/refrigerator warnings removed) */}

                    
//             <AlertBottom   odourAlert={odourAlert}
//                     temperatureAlert={temperatureAlert}
//                     humidityAlert={humidityAlert} />
          
//           </div>
//         </div>
//       </div>
//       </>
//     );
//   }






import { Tooltip } from "@mui/material";
import "../../styles/global/fonts.css";
import "../../styles/pages/Dashboard/freezer-cards-responsive.css";

export default function FreezerDeviceCard({
  refrigeratorAlert,
  deviceId,
  ambientTemperature,
  freezerTemperature,
  batteryLow = false,
  isSelected = false,
  onCardSelect,
}) {
  // helper: convert to finite number and keep integer part (before decimal)
  const toInt = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? Math.trunc(n) : null;
  };

  const hasRefrigeratorAlert = Boolean(refrigeratorAlert);
  const hasBatteryAlert = Boolean(batteryLow);
  
  console.log("hasRef>", refrigeratorAlert)
  console.log("hasBat>", batteryLow)
  // Priority logic
  const hasAnyAlert = hasRefrigeratorAlert || hasBatteryAlert;
  const hasBothAlerts = hasRefrigeratorAlert && hasBatteryAlert;

  console.log("hasAnyAlert>", hasRefrigeratorAlert || hasBatteryAlert)
  console.log("hasBothAlerts>", hasBothAlerts)

  const alertClass = !isSelected
  ? hasRefrigeratorAlert
    ? "alert-critical"   // 🔴 Refrigerator OR both
    : hasBatteryAlert
      ? "alert-battery"  // 🟢 Battery only
      : ""
  : "";


  
  const displayFreezerTemp = toInt(freezerTemperature);
  const displayAmbientTemp = toInt(ambientTemperature);

  const handleCardClick = () => {
    if (onCardSelect) onCardSelect();
  };

  return (
    // <div
    //   onClick={handleCardClick}
    //   className={`freezer-card-container  rounded-xl   ${isSelected ? "selected" : ""
    //     } `}
    // >
<div
  onClick={handleCardClick}
  className={`
    freezer-card-container
    rounded-xl
    ${isSelected ? "selected" : ""}
     ${alertClass}
  `}
>



      {/* Client's exact SVG card */}
      <div
        className=" w-full h-full "
      >
       

        {/* Content overlay */}
        <div className="freezer-card-content h-full">

          {/* Top Section: Device ID */}
          <div className="device-id-section">
            <div className="flex flex-col items-start">
              <span className={`device-id-label ${isSelected ? 'text-white/70' : 'text-gray-400'} ${hasAnyAlert && "text-white"}`}>Device ID</span>
              {/* <h3 className={`device-id-value responsive-value-deviceId ${isSelected ? 'text-white' : 'text-[#1E293B]'}`}>{deviceId}</h3> */}
              {/* <h6 className={`device-id-value responsive-value-deviceId ${isSelected ? 'text-white' : 'text-[#1E293B]'}`}>device-0221</h6>
               */}

               
      {/* <div className="device-id-section"> */}
        <div className="device-id-wrapper">
          <Tooltip title={deviceId} arrow>
            <span
              className={`device-id-value  ${
                isSelected ? "text-white" : "text-[#1E293B]" 
              } 
              `}
            >
              {deviceId}
            </span>
          </Tooltip>
        </div>
      {/* </div> */}


            </div>

            {/* Ambient Temperature Pill */}
            <div className={`ambient-pill ${isSelected
                ? "bg-white/20 border border-white/30"
                : "bg-white border border-gray-300"
              }`}>
                <p className={` freezer-label ${isSelected ? 'text-white' : 'text-gray-600' 
                }`} >Ambient &nbsp;
              <span className={` font-bold `} >
                  {displayAmbientTemp}
              </span>
              C
              </p>
            </div>
          </div>

          {/* Middle Section: Freezer Temperature */}
          <div className="flex items-center h-full">
            <img
              src="/freezer-icon.png"
              alt="Freezer"
              className="freezer-icon"
            />

            {/* Freezer Label and Temperature - Right of Icon */}
            <div className="freezer-temp-info">
              <span className={`freezer-label font-semi-bold ${isSelected ? 'text-white' : 'text-[#1E293B]'} ${hasAnyAlert && "text-white"}`}>
                Temperature
              </span>

              {/* Temperature Display - Below Freezer Text */}
              <span className={`freezer-temp-value ${isSelected ? 'text-white' : 'text-[#1E293B]'} responsive-value ${hasAnyAlert && "text-white"}`}>
                {displayFreezerTemp}°C
              </span>
            </div>
          </div>

       
       


        </div>

        
      </div>
         {/* Bottom Section: Alert Status */}
         
{hasAnyAlert && (
         <div className={`rounded-b-xl p-1 ${hasAnyAlert && "bg-white/50"}`}>
  <div className="battery-warning flex gap-2 items-center">
    <span className="text-white">Detected</span>

    {hasRefrigeratorAlert && (
      <img
        src="/refrigerator-alert-icon.svg"
        alt="Temperature Alert"
        className="alert-icon"
      />
    )}

    {hasBatteryAlert && (
      <img
        src="/low-battery-alert-icon.svg"
        alt="Battery Alert"
        className="alert-icon"
      />
    )}
  </div>
</div>
)}

    </div>
  );
}
