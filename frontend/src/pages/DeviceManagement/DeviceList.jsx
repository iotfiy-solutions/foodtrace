
// src/pages/management/DeviceList.jsx
import { Pencil, Trash, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  CircularProgress,
  FormHelperText,
  Stack,
  IconButton,
  Drawer,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import Swal from "sweetalert2";
import { fetchAllDevices, updateDevice, deleteDevice } from "../../slices/DeviceSlice";
import "../../styles/pages/management-pages.css";
import TableSkeleton from "../../components/skeletons/TableSkeleton";
// add these imports
import { fetchAllOrganizations } from "../../slices/OrganizationSlice";
import { fetchVenuesByOrganization } from "../../slices/VenueSlice";



const DeviceList = ({ onDeviceSelect, selectedDevice }) => {
  const dispatch = useDispatch();
  const { DeviceArray = [], isLoading, error } = useSelector((state) => state.Device || {});
  const { Venues = [] } = useSelector((state) => state.Venue || {});

    // new: organizations + venuesByOrg (cached)
  const { Organizations = [], isLoading: orgsLoading } = useSelector((s) => s.Organization || {});
  const { venuesByOrg = {}, loading: venueLoading, error: venueError } = useSelector((s) => s.Venue || {});


  const [working, setWorking] = useState(false);

  const isDesktop = useMediaQuery("(min-width:768px)");
  const isMobile = !isDesktop;
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [editingDeviceId, setEditingDeviceId] = useState(null);

    const [editForm, setEditForm] = useState({
    deviceId: "",
    organization: "", // <-- added
    venueId: "", 
    ambientOp: ">",
    ambientVal: "",
    freezerOp: ">",
    freezerVal: "",
    apiKey: "",
  });

   

  const [formErrors, setFormErrors] = useState({});

  // Delete confirm dialog state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({ id: null, name: "" });

  useEffect(() => {
    dispatch(fetchAllDevices());
    dispatch(fetchAllOrganizations());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      console.error("Device error:", error);
      // Swal.fire({
      //   icon: "error",
      //   title: "Error",
      //   text: String(error),
      // });
    }
  }, [error]);

  // Delete flow
  const openDeleteConfirm = (id, displayName) => {
    setDeleteTarget({ id, name: displayName });
    setDeleteOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteOpen(false);
    setDeleteTarget({ id: null, name: "" });
  };

  const handleDeleteConfirm = async () => {
    const id = deleteTarget.id;
    setDeleteOpen(false);
    if (!id) return;
    try {
      setWorking(true);
      await dispatch(deleteDevice(id)).unwrap();
      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Device deleted.",
        timer: 1800,
        showConfirmButton: false,
      });
      dispatch(fetchAllDevices());
      if (isMobile) setDrawerOpen(false);
    } catch (err) {
      console.error("Delete device error:", err);
      Swal.fire({
        icon: "error",
        title: "Delete failed",
        text: err?.toString() || "Delete failed",
      });
    } finally {
      setWorking(false);
      setDeleteTarget({ id: null, name: "" });
    }
  };



const findCondition = (conditionsArray = [], wantedType) => {
  if (!Array.isArray(conditionsArray)) return undefined;
  return conditionsArray.find((c) => c.type === wantedType);
};


    const handleEdit = (device) => {
    console.log("device", device);

    const currentDeviceId = device.deviceId || "";

    // device.venue might be an object or id; try to extract venue id & name & org id:
    const currentVenueObj = device.venue && typeof device.venue === "object" ? device.venue : null;
    const currentVenueId = currentVenueObj?._id ?? device.venue ?? "";

    // organization id is nested at device.venue.organization._id in your object
    const currentOrgId = currentVenueObj?.organization?._id ?? currentVenueObj?.organization ?? "";

    // const temperatureCond = findCondition(device.conditions, "temperature") || {};
    const ambientCond = findCondition(device.conditions, "ambient") || {};
    const freezerCond = findCondition(device.conditions, "freezer") || {};

    // set edit form and request org's venues (so venue list is available)
    setEditingDeviceId(device._id ?? device.id ?? null);
    setEditForm({
      deviceId: currentDeviceId,
      organization: currentOrgId,
      venueId: currentVenueId,
      ambientOp: ambientCond.operator ?? ">",
      ambientVal: ambientCond.value ?? "",

      freezerOp: freezerCond.operator ?? ">",
      freezerVal: freezerCond.value ?? "",
      apiKey: device.apiKey ?? device?.apiKey ?? "",
      });
    setFormErrors({});

    // fetch venues for the organization so the select shows them
    if (currentOrgId) {
      dispatch(fetchVenuesByOrganization(currentOrgId));
    }

    setEditOpen(true);
  };


    const handleEditOrgChange = (e) => {
    const newOrgId = e.target.value;
    setEditForm((s) => ({ ...s, organization: newOrgId, venueId: "" }));
    setFormErrors((s) => ({ ...s, organization: undefined, venueId: undefined }));
    if (newOrgId) {
      dispatch(fetchVenuesByOrganization(newOrgId));
    }
  };


  const handleEditChange = (field) => (e) => {
    const v = e?.target?.value ?? "";
    setEditForm((s) => ({ ...s, [field]: v }));
    setFormErrors((s) => ({ ...s, [field]: undefined }));
  };

  const handleEditCancel = () => {
    setEditOpen(false);
    setFormErrors({});
    setEditingDeviceId(null);
  };

  const handleEditSave = async () => {
  const {
    deviceId,
    venueId,
    ambientOp,
    ambientVal,
    freezerOp,
    freezerVal

    
  } = editForm;

  const errors = {};
  if (!deviceId || !deviceId.toString().trim()) errors.deviceId = "Device ID is required";
  if (!venueId) errors.venueId = "Venue is required";


  if (ambientVal !== "" && Number.isNaN(Number(ambientVal)))
  errors.ambientVal = "Must be a number";

if (freezerVal !== "" && Number.isNaN(Number(freezerVal)))
  errors.freezerVal = "Must be a number";

  if (Object.keys(errors).length > 0) {
    setFormErrors(errors);
    return;
  }

  const validOps = [">", "<"];
  const conditionsToSend = [];

    if (freezerVal !== "") {
    if (!validOps.includes(freezerOp)) {
      setFormErrors({ freezerOp: "Invalid operator" });
      return;
    }
    conditionsToSend.push({
      type: "freezer",
      operator: freezerOp,
      value: Number(freezerVal),
    });
  }


     if (ambientVal !== "") {
    if (!validOps.includes(ambientOp)) {
      setFormErrors({ ambientOp: "Invalid operator" });
      return;
    }
    conditionsToSend.push({
      type: "ambient",
      operator: ambientOp,
      value: Number(ambientVal),
    });
  }

  try {
    setWorking(true);

    // IMPORTANT: capture response from updateDevice
    const res = await dispatch(
      updateDevice({
        id: editingDeviceId,
        deviceId: deviceId.toString().trim(),
        venueId,
        conditions: conditionsToSend,
      })
    ).unwrap();

    console.log("res>>", res)

    // Determine if backend generated a new API key and extract it
    const newApiKeyGenerated =
      Boolean(res?.newApiKeyGenerated) ||
      (typeof res?.message === "string" && res.message.toLowerCase().includes("new api key")) ||
      false;

    // Try common places API might be returned
    const apiKeyFromRes = res?.apiKey ?? res?.newApiKey ?? res?.device?.apiKey ?? null;

    if (newApiKeyGenerated && apiKeyFromRes) {
      // Update form so API key is visible in the dialog
      setEditForm((s) => ({ ...s, apiKey: apiKeyFromRes }));

      // Inform user and allow easy copying
      const swalResult = await Swal.fire({
        icon: "warning",
        title: "New API key generated!",
        html: `<p>Please reconfigure your device to use the new API key:</p>
               <pre style="white-space:break-spaces; background:#f6f6f6; padding:8px; border-radius:6px;">${apiKeyFromRes}</pre>`,
        showCancelButton: true,
        confirmButtonText: "Copy key",
        cancelButtonText: "Close",
        allowOutsideClick: false,
      });

      if (swalResult.isConfirmed) {
        try {
          await navigator.clipboard.writeText(apiKeyFromRes);
          await Swal.fire({ icon: "success", title: "Copied", text: "API key copied to clipboard", timer: 1400, showConfirmButton: false });
        } catch (copyErr) {
          // fallback if clipboard not available
          await Swal.fire({ icon: "info", title: "Copy failed", text: "Please copy the API key manually." });
        }
      }

      // Keep the edit dialog open so the user can see / copy the key later.
      // Refresh device list to fetch updated data
      dispatch(fetchAllDevices());
      if (isMobile) setDrawerOpen(false);
      setWorking(false);
      return; // early return; don't close dialog automatically
    }

    // Normal success path (no new api key)
    Swal.fire({
      icon: "success",
      title: "Saved",
      text: "Device updated.",
      timer: 1600,
      showConfirmButton: false,
    });

    setEditOpen(false);
    dispatch(fetchAllDevices());
    if (isMobile) setDrawerOpen(false);
  } catch (err) {
    console.error("Update device error:", err);
    Swal.fire({
      icon: "error",
      title: "Update failed",
      text: err?.toString() || "Update failed",
    });
  } finally {
    setWorking(false);
  }
};

  const handleCopyApiKey = (apiKey) => {
    if (!apiKey) return;

    navigator.clipboard.writeText(apiKey)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Copied!",
          timer: 1200,
          width: 150,
          showConfirmButton: false,
          position: "top-end",
          toast: true,
          customClass: { popup: "small-toast" },
        });
      })
      .catch(() => {
        Swal.fire({ icon: "error", title: "Copy failed" });
      });
  };



  const displayDevices = DeviceArray || [];

  const renderListMarkup = () => (
    <div className="ListPage device-list-container bg-white rounded-xl shadow-sm w-full h-full border border-[#E5E7EB]">
      {isDesktop ? (
        <h1 className="organization-list-title font-semibold text-gray-800 mb-4">Device Management</h1>
      ) : (
          <div className="flex justify-end">
          <IconButton
            onClick={() => {
              setDrawerOpen(!drawerOpen); // guard, then call
            }}
            edge="start"
            aria-label="close-details"
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </div>
      )}
      <div className="mb-4">
        <h2 className="device-list-header text-center font-semibold text-gray-800">Device List</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 font-bold text-gray-800">Device ID</th>
              <th className="py-2 px-4 text-center">Actions</th>
            </tr>
          </thead>
        </table>

        <div className="pr-1 user-table-scroll md:h-[50vh] h-[60vh]">
          <table className="w-full table-auto text-left overflow-y-auto">
            <tbody>
              {isLoading && <TableSkeleton />}

              {!isLoading &&
                displayDevices.map((d, idx) => {
                  const id = d._id ?? idx;
                  const deviceIdDisplay = d.deviceId ?? `Device ${idx + 1}`;

                  return (
                    <tr
                      key={id}
                      className={`border-b border-gray-200 cursor-pointer transition-colors hover:bg-blue-50/60 ${
                        selectedDevice?._id === id || selectedDevice?.id === id ? "bg-blue-50 border-blue-300" : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeviceSelect?.(d);
                        if (isMobile) setDrawerOpen(false);
                      }}
                    >
                      <td className="py-2 sm:py-3 px-2 sm:px-4">{deviceIdDisplay}</td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4">
                        <div className="flex justify-center gap-2 sm:gap-3" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleEdit(d)}
                            className="rounded-full border border-green-500/50 bg-white flex items-center justify-center hover:bg-green-50 p-2 cursor-pointer"
                            disabled={working}
                          >
                            <Pencil className="text-green-600" size={16} />
                          </button>
                          <button
                            onClick={() => openDeleteConfirm(id, deviceIdDisplay)}
                            className="rounded-full border border-red-500/50 bg-white flex items-center justify-center hover:bg-red-50 p-2 cursor-pointer"
                            disabled={working}
                          >
                            <Trash className="text-red-600" size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

              {!isLoading && displayDevices.length === 0 && <tr><td className="p-4 text-center text-gray-500">No devices found.</td></tr>}
            </tbody>
          </table>
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
            <h1 className="device-list-title font-semibold text-gray-800">Device Management</h1>
            <IconButton size="small" onClick={() => setDrawerOpen(true)}>
              <Menu size={20} />
            </IconButton>
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

      {/* Edit Dialog */}
      <Dialog open={editOpen} onClose={handleEditCancel} maxWidth="xs" fullWidth>
        <DialogTitle>Edit Device</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} alignItems="center" justifyContent="center">
            <FormControl sx={{ width: "83%" }} error={!!formErrors.deviceId}>
              <TextField
                label="Device ID"
                value={editForm.deviceId}
                fullWidth
                error={!!formErrors.deviceId}
                helperText={formErrors.deviceId}
                onChange={(e) => setEditForm({ ...editForm, deviceId: e.target.value })}
                size="small"
              />
            </FormControl>

{/* Organization Select */}
<FormControl sx={{ width: "83%" }}>
  <InputLabel id="org-select-label">Organization</InputLabel>
  <Select
    labelId="org-select-label"
    label="Organization"
    value={editForm.organization ?? ""}
    onChange={handleEditOrgChange}
    fullWidth
    size="small"
  >
    <MenuItem value="">Select organization</MenuItem>
    {Organizations.map((org) => (
      <MenuItem key={org._id ?? org.id} value={org._id ?? org.id}>
        {org.name ?? org._id ?? org.id}
      </MenuItem>
    ))}
  </Select>
</FormControl>

{/* Venue Select */}
<FormControl sx={{ width: "83%" }} error={!!formErrors.venueId}>
  <InputLabel id="venue-select-label">Venue</InputLabel>
  <Select
    labelId="venue-select-label"
    label="Venue"
    value={editForm.venueId ?? ""}
    onChange={handleEditChange("venueId")}
    fullWidth
    size="small"
  >
    <MenuItem value="">Select venue</MenuItem>

    {/*
      compute available venues for currently selected org (from venuesByOrg cache)
      and if current venue not present, show it at top so the preselected venue appears.
    */}
    {(() => {
      const orgId = editForm.organization;
      const available = orgId ? (venuesByOrg[orgId] || []) : Venues || [];
      // ensure currentVenue (editForm.venueId) is included even if not loaded yet:
      const merged = Array.isArray(available) ? [...available] : [];
      const currentVenueId = editForm.venueId;
      if (currentVenueId && !merged.find((v) => String(v._id ?? v.id) === String(currentVenueId))) {
        // try to create a simple entry from Venues global or use a placeholder name:
        const fromGlobal = (Venues || []).find((v) => String(v._id ?? v.id) === String(currentVenueId));
        if (fromGlobal) merged.unshift(fromGlobal);
        else merged.unshift({ _id: currentVenueId, name: "Current venue" });
      }

      return merged.map((v) => (
        <MenuItem key={v._id ?? v.id} value={v._id ?? v.id}>
          {v.name ?? v._id ?? v.id}
        </MenuItem>
      ));
    })()}
  </Select>
  {formErrors.venueId && <FormHelperText>{formErrors.venueId}</FormHelperText>}
</FormControl>


            
            {/* Temperature row */}
            <Grid container spacing={1} alignItems="center" sx={{ width: "83%" }}>
              <Grid item xs="auto" sm={3}>
                <FormControl sx={{ width: { xs: 60, sm: "100%" }, minWidth: 60 }}>
                  <InputLabel id="ambient-op-label">Op</InputLabel>
                  <Select
                    labelId="ambient-op-label"
                    value={editForm.ambientOp}
                    label="Op"
                    onChange={handleEditChange("ambientOp")}
                    sx={{ width: "100%" }}
                    size="small"
                  >
                    <MenuItem value=">">&gt;</MenuItem>
                    <MenuItem value="<">&lt;</MenuItem>
               
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs>
                   <TextField
                    label="Ambient value"
                    type="number"
                    inputProps={{ step: 0.1 }}
                    value={editForm.ambientVal}
                    onChange={handleEditChange("ambientVal")}
                    fullWidth
                    error={!!formErrors.ambientVal}
                    helperText={formErrors.ambientVal}
                    size="small"
                    sx={{
                      maxWidth: { xs: 90, sm: "100%" },
                      "& .MuiInputBase-root": { height: 36 },
                    }}
                   />
              </Grid>
            </Grid>
                



              {/* Freezer row */}
            <Grid container spacing={1} alignItems="center" sx={{ mt: 1, width: "83%" }}>
              <Grid item xs="auto" sm={3}>
                <FormControl sx={{ width: { xs: 60, sm: "100%" }, minWidth: 60 }}>
                  <InputLabel id="hum-op-label">Freezer Op</InputLabel>
                  <Select
                    labelId="freezer-op-label"
                    value={editForm.freezerOp}
                    label="Freezer op"
                    onChange={handleEditChange("freezerOp")}
                    sx={{ width: "100%" }}
                    size="small"
                    >
                    <MenuItem value=">">&gt;</MenuItem>
                    <MenuItem value="<">&lt;</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

                 <Grid item xs>
                  <TextField
                    label="Freezer value"
                    type="number"
                    inputProps={{ step: 0.1 }}
                    value={editForm.freezerVal}
                    onChange={handleEditChange("freezerVal")}
                    fullWidth
                    error={!!formErrors.freezerVal}
                    helperText={formErrors.freezerVal}
                    size="small"
                    sx={{
                      maxWidth: { xs: 90, sm: "100%" },
                      "& .MuiInputBase-root": { height: 36 },
                    }}
                  />
              </Grid>
            </Grid>

                        {/* API Key display (compact) */}
          {editForm.apiKey ? (
            <div className="mt-3 p-3 rounded-md bg-white border border-gray-200 text-sm text-gray-700 break-words px-5 w-full">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">API Key:</div>
                  <div
                    className="mt-2 text-sm font-mono truncate"
                    title={editForm.apiKey}
                    style={{ maxWidth: "100%" }}
                  >
                    {/* show truncated key; full key is visible on hover via title */}
                    {editForm.apiKey ? `${String(editForm.apiKey).slice(0, 20)}...` : ""}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Copy icon/button */}
                  <button
                    onClick={()=>handleCopyApiKey(editForm?.apiKey)}
                    className="p-1 rounded hover:bg-gray-100 border border-transparent"
                    title="Copy API key"
                    type="button"
                  >
                    <img src="/copyicon.svg" alt="Copy API KEY Icon" className="w-[20px] h-[20px]" />
                  </button>
                </div>
              </div>
            </div>
          ) : null}


          </Stack>

        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleEditCancel} disabled={working}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSave} disabled={working} endIcon={working ? <CircularProgress size={18} /> : null}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete {deleteTarget.name ? `"${deleteTarget.name}"` : "device"}?</DialogTitle>
        <DialogContent dividers>This action cannot be undone.</DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={working}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDeleteConfirm} disabled={working} endIcon={working ? <CircularProgress size={18} /> : null}>
            Yes, delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeviceList;
