// // src/pages/management/VenueList.jsx
// import  { useEffect, useState } from "react";
// import { Pencil, Trash, Menu } from "lucide-react";
// import Swal from "sweetalert2";
// import { fetchAllVenues, updateVenue, deleteVenue } from "../../slices/VenueSlice";
// import { useDispatch, useSelector } from "react-redux";
// import "../../styles/pages/management-pages.css";
// import TableSkeleton from "../../components/skeletons/TableSkeleton";
// import { Drawer, IconButton, useMediaQuery, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
// import CloseIcon from '@mui/icons-material/Close';

// const VenueList = ({ onVenueSelect, selectedVenue }) => {
//   const dispatch = useDispatch();
//   const { Venues = [], loading = false, error = null } = useSelector((state) => state.Venue || {});

//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editOpen, setEditOpen] = useState(false);
//   const [venueName, setVenueName] = useState("");
//   const [venueId, setVenueId] = useState(null);

//   const isDesktop = useMediaQuery("(min-width:768px)");
//   const isMobile = !isDesktop;

//   useEffect(() => {
//     dispatch(fetchAllVenues());
//   }, [dispatch]);

//   const handleDelete = async (id, name) => {
//     const result = await Swal.fire({
//       title: "Are you sure?",
//       text: `Do you want to delete ${name}? This cannot be undone.`,
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       cancelButtonColor: "#3085d6",
//       confirmButtonText: "Yes, delete it!",
//       cancelButtonText: "Cancel",
//     });

//     if (!result.isConfirmed) return;

//     try {
//       await dispatch(deleteVenue(id)).unwrap();
//       if (isMobile) setDrawerOpen(false);

//       Swal.fire({
//         title: "Deleted!",
//         text: `${name} has been deleted.`,
//         icon: "success",
//         timer: 1400,
//         showConfirmButton: false,
//       });
//     } catch (err) {
//       console.error(err);
//       if (isMobile) setDrawerOpen(false);
//       Swal.fire({ title: "Error!", text: err?.toString() || "Failed to delete venue", icon: "error" });
//     }
//   };

//   const handleEditOpen = (id, name) => {
//     setVenueId(id);
//     setVenueName(name);
//     setEditOpen(true);
//   };

//   const handleEditClose = () => {
//     setEditOpen(false);
//     setVenueId(null);
//     setVenueName("");
//   };

//   const handleEditSave = async () => {
//     if (!venueName.trim()) return;
//     try {
//       await dispatch(updateVenue({ id: venueId, name: venueName })).unwrap();
//       handleEditClose();
//       Swal.fire({
//         title: "Updated!",
//         text: `Venue updated to ${venueName}.`,
//         icon: "success",
//         timer: 1400,
//         showConfirmButton: false,
//       });
//     } catch (err) {
//       console.error(err);
//       Swal.fire({ title: "Error!", text: err?.toString() || "Failed to update venue", icon: "error" });
//     }
//   };

//   const handleRowClick = (venue, e) => {
//     if (e && e.stopPropagation) e.stopPropagation();
//     onVenueSelect?.(venue);
//     if (isMobile) setDrawerOpen(false);
//   };

//   const renderListMarkup = () => (
//     <div className="ListPage venue-list-container bg-white rounded-xl shadow-sm w-full h-full border border-[#E5E7EB]">
//       {isDesktop ? (
//         <h1 className="organization-list-title font-semibold text-gray-800 mb-4">Venue Management</h1>
//       ) : (
//         <div className="flex justify-end">
//           <IconButton onClick={() => setDrawerOpen(false)} edge="start" aria-label="close-details" size="small">
//             <CloseIcon />
//           </IconButton>
//         </div>
//       )}

//       <div className="mb-4">
//         <h2 className="venue-list-header  text-center font-semibold text-gray-800">Venue List</h2>
//         <div className="mx-auto mt-2 h-px w-4/5 bg-[#2563EB]/40"></div>
//       </div>

//       <div className="overflow-x-auto ">
//         <table className="w-full table-auto text-left">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="venue-table-header py-2 px-4 font-bold text-gray-800">Venue Name</th>
//               <th className="venue-table-header py-2 px-4 text-center">Actions</th>
//             </tr>
//           </thead>
//         </table>


//         <div className="venue-table-scroll overflow-y-auto pr-1 h-[58vh]">
//           {loading ? (
//             <table className="w-full table-auto text-left">
//               <tbody aria-busy={loading} role="status">
//                 <TableSkeleton rows={4} showNumber={true} showActions={true} />
//               </tbody>
//             </table>
//           ) : error ? (
//             <div className="text-center  py-4 text-gray-500">{(error==="Failed to fetch") && <>No Venues Found</>}</div>
//           ) : Venues.length === 0 ? (
//             <div className="text-center py-4">No venues found. Add one to get started.</div>
//           ) : (
//             <table className="w-full table-auto text-left ">
//               <tbody>
//                 {Venues.map((venue, index) => {
//                   const id = venue._id ?? venue.id ?? index;
//                   const displayName = venue.name ?? `Venue ${index + 1}`;
//                   return (
//                     <tr
//                       key={id}
//                       className={`border-b border-gray-200 cursor-pointer transition-colors hover:bg-blue-50/60 ${
//                         selectedVenue?._id === id ? "bg-blue-50 border-blue-300" : ""
//                       }`}
//                       onClick={(e) => handleRowClick(venue, e)}
//                     >
//                       <td className="venue-table-cell py-2 sm:py-3 px-2 sm:px-4">
//                         {index + 1}. {displayName}
//                       </td>
//                       <td className="venue-table-cell py-2 sm:py-3 px-2 sm:px-4">
//                         <div className="flex justify-center gap-2 sm:gap-3" onClick={(e) => e.stopPropagation()}>
//                           <button onClick={() => handleEditOpen(id, displayName)} className=" cursor-pointer venue-action-btn rounded-full border border-green-500/50 bg-white flex items-center justify-center hover:bg-green-50 p-[3px]">
//                             <Pencil className="text-green-600 venue-action-icon " size={16}/>
//                           </button>
//                           <button onClick={() => handleDelete(id, displayName)} className=" cursor-pointer venue-action-btn rounded-full border border-red-500/50 bg-white flex items-center justify-center hover:bg-red-50 p-[3px]">
//                             <Trash className="text-red-600 venue-action-icon " size={16}/>
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <>
//       {isDesktop ? (
//         renderListMarkup()
//       ) : (
//         <>
//           <div className="flex items-center justify-between mb-4">
//             <h1 className="venue-list-title font-semibold text-gray-800">Venue Management</h1>
//             <div>
//               <IconButton aria-label="Open venues" size="small" onClick={() => setDrawerOpen(true)}>
//                 <Menu size={20} />
//               </IconButton>
//             </div>
//           </div>

//           <Drawer
//             anchor="right"
//             open={drawerOpen}
//             onClose={() => setDrawerOpen(false)}
//             PaperProps={{ style: { width: "100%" } }}
//           >
//             <div className="p-4">{renderListMarkup()}</div>
//           </Drawer>
//         </>
//       )}

//       {/* Venue Edit Modal */}
//       <Dialog open={editOpen} onClose={handleEditClose}>
//         <DialogTitle>Edit Venue</DialogTitle>
//         <DialogContent>
//           <TextField
//             autoFocus
//             margin="dense"
//             label="Venue Name"
//             type="text"
//             fullWidth
//             value={venueName}
//             onChange={(e) => setVenueName(e.target.value)}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleEditClose}>Cancel</Button>
//           <Button onClick={handleEditSave} variant="contained" color="primary">
//             Save
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// };

// export default VenueList;











// src/pages/management/VenueList.jsx
import { useEffect, useState } from "react";
import { Pencil, Trash, Menu } from "lucide-react";
import Swal from "sweetalert2";
import { fetchAllVenues, updateVenue, deleteVenue } from "../../slices/VenueSlice";
import { useDispatch, useSelector } from "react-redux";
import "../../styles/pages/management-pages.css";
import TableSkeleton from "../../components/skeletons/TableSkeleton";
import { Drawer, IconButton, useMediaQuery, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { fetchAllOrganizations } from "../../slices/OrganizationSlice";
import { useStore } from "../../contexts/storecontexts";


const VenueList = ({ onVenueSelect, selectedVenue }) => {
  const dispatch = useDispatch();
  const { Venues = [], loading = false, error = null } = useSelector((state) => state.Venue || {});

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [venueName, setVenueName] = useState("");
  const [venueId, setVenueId] = useState(null);
  const [orgId, setOrgId] = useState(""); // new: selected org during edit

  const isDesktop = useMediaQuery("(min-width:768px)");
  const isMobile = !isDesktop;

  const { Organizations = [], isLoading: orgsLoading } = useSelector((state) => state.Organization || {});
  const { user } = useStore();

  // useEffect(() => {
  //   dispatch(fetchAllVenues());
  // }, [dispatch]);


  useEffect(() => {
    dispatch(fetchAllVenues());
    // fetch organizations once so admin can select target org
    dispatch(fetchAllOrganizations()).catch(() => { });
  }, [dispatch]);


  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete ${name}? This cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await dispatch(deleteVenue(id)).unwrap();
      if (isMobile) setDrawerOpen(false);

      Swal.fire({
        title: "Deleted!",
        text: `${name} has been deleted.`,
        icon: "success",
        timer: 1400,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      if (isMobile) setDrawerOpen(false);
      Swal.fire({ title: "Error!", text: err?.toString() || "Failed to delete venue", icon: "error" });
    }
  };

  // const handleEditOpen = (id, name) => {
  //   setVenueId(id);
  //   setVenueName(name);
  //   setEditOpen(true);
  // };

  // when opening edit, populate orgId from venue.organization if available
  const handleEditOpen = (id, name) => {
    setVenueId(id);
    setVenueName(name);

    // find venue object to get organization (backend shape may be organization object or id)
    const v = Venues.find((x) => String(x._id) === String(id) || String(x.id) === String(id));
    let initialOrg = "";
    if (v) {
      if (v.organization && typeof v.organization === "object") {
        initialOrg = v.organization._id || v.organization.id || "";
      } else if (v.organization) {
        initialOrg = v.organization;
      }
    }
    setOrgId(initialOrg);
    setEditOpen(true);
  };

  // const handleEditClose = () => {
  //   setEditOpen(false);
  //   setVenueId(null);
  //   setVenueName("");
  // };

  const handleEditClose = () => {
    setEditOpen(false);
    setVenueId(null);
    setVenueName("");
    setOrgId("");
  };




  // const handleEditSave = async () => {
  //   if (!venueName.trim()) return;
  //   try {
  //     await dispatch(updateVenue({ id: venueId, name: venueName })).unwrap();
  //     handleEditClose();
  //     Swal.fire({
  //       title: "Updated!",
  //       text: `Venue updated to ${venueName}.`,
  //       icon: "success",
  //       timer: 1400,
  //       showConfirmButton: false,
  //     });
  //   } catch (err) {
  //     console.error(err);
  //     Swal.fire({ title: "Error!", text: err?.toString() || "Failed to update venue", icon: "error" });
  //   }
  // };


  const handleEditSave = async () => {
    const name = venueName?.trim();
    if (!name) return;

    try {
      // Build payload - send organizationId key to match thunk/backend
      const payload = { id: venueId, name };

      // include org only when selected (non-empty)
      if (orgId) payload.organizationId = orgId;

      await dispatch(updateVenue(payload)).unwrap();

      handleEditClose();
      Swal.fire({
        title: "Updated!",
        text: `Venue updated to ${name}.`,
        icon: "success",
        timer: 1400,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({ title: "Error!", text: err?.toString() || "Failed to update venue", icon: "error" });
    }
  };


  const handleRowClick = (venue, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    onVenueSelect?.(venue);
    if (isMobile) setDrawerOpen(false);
  };

  const renderListMarkup = () => (
    <div className="ListPage venue-list-container bg-white  rounded-xl lg:rounded-r-none lg:rounded-l-xl shadow-sm w-full h-full border border-[#E5E7EB]">
      {isDesktop ? (
        <h1 className="organization-list-title font-semibold text-gray-800 mb-4">Venue Management</h1>
      ) : (
        <div className="flex justify-end">
          <IconButton onClick={() => setDrawerOpen(false)} edge="start" aria-label="close-details" size="small">
            <CloseIcon />
          </IconButton>
        </div>
      )}

      <div className="mb-4">
        <h2 className="venue-list-header  text-center font-semibold text-gray-800">Venue List</h2>
        <div className="mx-auto mt-2 h-px w-4/5 bg-[#2563EB]/40"></div>
      </div>

      <div className="overflow-x-auto ">
        <table className="w-full table-auto text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="venue-table-header py-2 px-4 font-bold text-gray-800">Venue Name</th>
              <th className="venue-table-header py-2 px-4 text-center">Actions</th>
            </tr>
          </thead>
        </table>


        <div className="venue-table-scroll overflow-y-auto pr-1  h-[65vh] sm:h-[58vh]">
          {loading ? (
            <table className="w-full table-auto text-left">
              <tbody aria-busy={loading} role="status">
                <TableSkeleton rows={4} showNumber={true} showActions={true} />
              </tbody>
            </table>
          ) : error ? (
            <div className="text-center  py-4 text-gray-500">{(error === "Failed to fetch") && <>No Venues Found</>}</div>
          ) : Venues.length === 0 ? (
            <div className="text-center py-4">No venues found. Add one to get started.</div>
          ) : (
            <table className="w-full table-auto text-left ">
              <tbody>
                {Venues.map((venue, index) => {
                  const id = venue._id ?? venue.id ?? index;
                  const displayName = venue.name ?? `Venue ${index + 1}`;
                  return (
                    <tr
                      key={id}
                      className={`border-b border-gray-200 cursor-pointer transition-colors hover:bg-blue-50/60 ${selectedVenue?._id === id ? "bg-blue-50 border-blue-300" : ""
                        }`}
                      onClick={(e) => handleRowClick(venue, e)}
                    >
                      <td className="venue-table-cell py-2 sm:py-3 px-2 sm:px-4">
                        {index + 1}. {displayName}
                      </td>
                      <td className="venue-table-cell py-2 sm:py-3 px-2 sm:px-4">
                        <div className="flex justify-center gap-2 sm:gap-3" onClick={(e) => e.stopPropagation()}>
                          <button onClick={() => handleEditOpen(id, displayName)} className=" cursor-pointer venue-action-btn rounded-full border border-green-500/50 bg-white flex items-center justify-center hover:bg-green-50 p-[4px]">
                            <Pencil className="text-green-600 venue-action-icon " size={16} />
                          </button>
                          <button onClick={() => handleDelete(id, displayName)} className=" cursor-pointer venue-action-btn rounded-full border border-red-500/50 bg-white flex items-center justify-center hover:bg-red-50 p-[4px]">
                            <Trash className="text-red-600 venue-action-icon " size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {isDesktop ? (
        renderListMarkup()
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <img src="/logo-half.png" className="w-auto h-[30px]"/>
            <h1 className="venue-list-title font-semibold text-gray-800">Venue Management</h1>
            <div>
              <IconButton aria-label="Open venues" size="small" onClick={() => setDrawerOpen(true)}>
                <Menu size={20} />
              </IconButton>
            </div>
          </div>

          <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            PaperProps={{ style: { width: "100%" } }}
          >
            <div className="p-4">{renderListMarkup()}</div>
          </Drawer>
        </>
      )}

      {/* Venue Edit Modal */}
      <Dialog open={editOpen} onClose={handleEditClose}>
        <DialogTitle>Edit Venue</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Venue Name"
            type="text"
            fullWidth
            value={venueName}
            onChange={(e) => setVenueName(e.target.value)}
          />

          <TextField
            select
            margin="dense"
            label="Organization (assign venue)"
            value={orgId || ""}
            onChange={(e) => setOrgId(e.target.value)}
            fullWidth
            SelectProps={{ native: false }}
            sx={{ mt: 1 }}
          >
            <MenuItem value="">Keep current organization</MenuItem>
            {(Organizations || []).map((org) => (
              <MenuItem key={org._id || org.id} value={org._id || org.id}>
                {org.name}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained" color="primary">
            Save
          </Button> */}

          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained" color="primary" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>

        </DialogActions>
      </Dialog>
    </>
  );
};

export default VenueList;
