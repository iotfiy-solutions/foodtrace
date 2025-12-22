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

  const displayFreezerTemp = toInt(freezerTemperature);
  const displayAmbientTemp = toInt(ambientTemperature);

  const handleCardClick = () => {
    if (onCardSelect) onCardSelect();
  };

  return (
    <div
      onClick={handleCardClick}
      className={`freezer-card-container ${isSelected ? "selected" : ""
        }`}
    >
      {/* Client's exact SVG card */}
      <div
        className="relative w-full h-full"
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 599 389"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          className="drop-shadow-md absolute inset-0 w-full h-full"
        >
          <g filter="url(#filter0_d_91_1411)">
            <path
              d="M4 50C4 22.3858 26.3858 0 54 0H545C572.614 0 595 22.3858 595 50V159.524V305.626V331C595 358.614 572.614 381 545 381H337H248.5H54C26.3858 381 4 358.614 4 331V50Z"
              fill={isSelected ? "url(#paint0_linear_91_1411)" : "#FFFFFF"}
            />
            <path
              d="M54 0.5H545C572.338 0.5 594.5 22.6619 594.5 50V331C594.5 358.338 572.338 380.5 545 380.5H54C26.6619 380.5 4.5 358.338 4.5 331V50C4.5 22.6619 26.6619 0.5 54 0.5Z"
              stroke="#717171"
              strokeOpacity="0.42"
            />
          </g>
          <defs>
            <filter id="filter0_d_91_1411" x="0" y="0" width="599" height="389" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_91_1411" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_91_1411" result="shape" />
            </filter>
            <linearGradient id="paint0_linear_91_1411" x1="68.5" y1="168.817" x2="601.988" y2="436.237" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4F64CF" />
              <stop offset="1" stopColor="#45D2DE" />
            </linearGradient>
          </defs>
        </svg>

        {/* Content overlay */}
        <div className="freezer-card-content">

          {/* Top Section: Device ID */}
          <div className="device-id-section">
            <div className="flex flex-col items-start">
              <span className={`device-id-label ${isSelected ? 'text-white/70' : 'text-gray-400'}`}>Device ID</span>
              <h3 className={`device-id-value ${isSelected ? 'text-white' : 'text-[#1E293B]'}`}>{deviceId}</h3>
            </div>

            {/* Ambient Temperature Pill */}
            <div className={`ambient-pill ${isSelected
                ? "bg-white/20 border border-white/30"
                : "bg-white border border-gray-300"
              }`}>
              <span className={`${isSelected ? 'text-white' : 'text-gray-600'
                }`}>
                Ambient {displayAmbientTemp}°C
              </span>
            </div>
          </div>

          {/* Middle Section: Freezer Temperature */}
          <div className="freezer-temp-section">
            <img
              src="/freezer-icon.png"
              alt="Freezer"
              className="freezer-icon"
            />

            {/* Freezer Label and Temperature - Right of Icon */}
            <div className="freezer-temp-info">
              <span className={`freezer-label ${isSelected ? 'text-white' : 'text-[#1E293B]'}`}>
                Freezer
              </span>

              {/* Temperature Display - Below Freezer Text */}
              <span className={`freezer-temp-value ${isSelected ? 'text-white' : 'text-[#1E293B]'}`}>
                {displayFreezerTemp}°C
              </span>
            </div>
          </div>

          {/* Bottom Section: Battery Warning */}
          {batteryLow && refrigeratorAlert ? (
            // ✅ Show only Temperature Alert if both true
            <div className="battery-warning">
              <span className={`${isSelected ? 'text-white' : 'text-[#1E293B]'}`}>
                Temperature
              </span>
              <img
                src="/red-alert-icon.webp"
                alt="Alert"
                className="alert-icon"
              />
            </div>
          ) : (
            <>
              {batteryLow && (
                <div className="battery-warning">
                  <span className={`${isSelected ? 'text-white' : 'text-[#1E293B]'}`}>
                    Battery Low
                  </span>
                  <img
                    src="/alert-icon.png"
                    alt="Alert"
                    className="alert-icon"
                  />
                </div>
              )}

              {refrigeratorAlert && (
                <div className="battery-warning">
                  <span className={`${isSelected ? 'text-white' : 'text-[#1E293B]'}`}>
                    Temperature
                  </span>
                  <img
                    src="/red-alert-icon.webp"
                    alt="Alert"
                    className="alert-icon"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
