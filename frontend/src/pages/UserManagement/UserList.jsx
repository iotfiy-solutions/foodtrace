// // src/pages/UserManagement/UserList.jsx
// import { Pencil, Trash, Menu } from "lucide-react";
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   DeleteManager,
//   fetchAllManagers,
//   setManagerDeleteModalOpen,
//   setManagerEditModalOpen,
//   UpdateManagerStatus, 
// } from "../../slices/ManagerSlice";
// import Swal from "sweetalert2";
// import "../../styles/pages/management-pages.css";
// import UserDeleteModal from "../../components/Modals/UserManagement/DeleteModal";
// import UserEditModal from "../../components/Modals/UserManagement/EditModal";
// import TableSkeleton from "../../components/skeletons/TableSkeleton";
// import { Drawer, IconButton, useMediaQuery } from "@mui/material";
// import CloseIcon from '@mui/icons-material/Close';

// const UserList = ({ onUserSelect, selectedUser }) => {
//   const [userEmail, setUserEmail] = useState("");
//   const [userId, setUserId] = useState(null);
//   const [drawerOpen, setDrawerOpen] = useState(false);

//   const dispatch = useDispatch();
//   const { Managers, ManagerDeleteModalOpen, ManagerEditModalOpen, isLoading, error } =
//     useSelector((state) => state.Manager);

//   const isDesktop = useMediaQuery("(min-width:768px)");
//   const isMobile = !isDesktop;

//   useEffect(() => {
//     dispatch(fetchAllManagers());
//   }, [dispatch]);

//   const handleDeleteOpen = (email, id) => {
//     dispatch(setManagerDeleteModalOpen(true));
//     setUserEmail(email);
//     setUserId(id);
//   };

//   const handleDeleteClose = () => {
//     dispatch(setManagerDeleteModalOpen(false));
//     setUserEmail("");
//     setUserId(null);
//   };

//   const handleEditOpen = (id) => {
//     dispatch(setManagerEditModalOpen(true));
//     setUserId(id);
//   };

//   const handleEditClose = () => {
//     dispatch(setManagerEditModalOpen(false));
//     setUserId(null);
//   };

//   const handleDelete = async () => {
//     try {
//       const id = userId;
//       const deletedId = await dispatch(DeleteManager(id)).unwrap();
//        handleDeleteClose();
       
//       if (isMobile) setDrawerOpen(false);

//       Swal.fire({
//         icon: "success",
//         title: "Deleted",
//         text: "User deleted",
//       });

     
//     } catch (err) {
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: err || "Failed to delete user",
//       });
//     }
//   };

//   const handleRowClick = (user, e) => {
//     e.stopPropagation();
//     onUserSelect && onUserSelect(user);
//     if (isMobile) setDrawerOpen(false);
//   };

//   const handleToggleStatus = async (user) => {
//     if (!user || !user._id) return;

//     if (user.isActive) {
//       const { value: formValues, isConfirmed } = await Swal.fire({
//         title: `Suspend ${user.email || user.name}?`,
//         html:
//           '<textarea id="swal-suspension-reason" class="swal2-textarea" placeholder="Enter suspension reason"></textarea>',
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonText: "Suspend",
//         cancelButtonText: "Cancel",
//         preConfirm: () => {
//           const reason = document.getElementById("swal-suspension-reason")?.value?.trim();
//           if (!reason) {
//             Swal.showValidationMessage("Suspension reason is required");
//             return false;
//           }
//           return { suspensionReason: reason };
//         },
//         allowOutsideClick: () => !Swal.isLoading(),
//       });

//       if (!isConfirmed) return;

//       const suspensionReason = formValues.suspensionReason;

//       try {
//         Swal.fire({ title: "Suspending...", allowOutsideClick: false, didOpen: () => Swal.showLoading() });
//         await dispatch(UpdateManagerStatus({ id: user._id, isActive: false, suspensionReason })).unwrap();
//         if (isMobile) setDrawerOpen(false);
//         Swal.fire({ icon: "success", title: "Suspended", text: `${user.email || user.name} is suspended.` });
//         dispatch(fetchAllManagers());
//       } catch (err) {
//         console.error("UpdateManagerStatus error:", err);
//         Swal.fire({ icon: "error", title: "Failed", text: err || "Could not suspend user" });
//       }
//     } else {
//       const result = await Swal.fire({
//         title: `Activate ${user.email || user.name}?`,
//         text: "This will restore the user's active status.",
//         icon: "question",
//         showCancelButton: true,
//         confirmButtonText: "Activate",
//         cancelButtonText: "Cancel",
//       });
//       if (!result.isConfirmed) return;

//       try {
//         Swal.fire({ title: "Activating...", allowOutsideClick: false, didOpen: () => Swal.showLoading() });
//         await dispatch(UpdateManagerStatus({ id: user._id, isActive: true, suspensionReason: "" })).unwrap();
//         if (isMobile) setDrawerOpen(false);
//         Swal.fire({ icon: "success", title: "Activated", text: `${user.email || user.name} is now active.` });
//         dispatch(fetchAllManagers());
//       } catch (err) {
//         console.error("UpdateManagerStatus error:", err);
//         Swal.fire({ icon: "error", title: "Failed", text: err || "Could not activate user" });
//       }
//     }
//   };

//   const renderListMarkup = () => (
//     <div className="ListPage user-list-container  bg-white rounded-xl shadow-sm w-full h-full border border-[#E5E7EB]">
//                           {
//       isDesktop ? 
//       <h1 className="organization-list-title font-semibold text-gray-800 mb-4">User Management</h1>
//     : 
//     <>
//     <div className="flex justify-end">
//           <IconButton
//             onClick={() => {
//               setDrawerOpen(false); 
//             }}
//             edge="start"
//             aria-label="close-details"
//             size="small"
//           >
//             <CloseIcon />
//           </IconButton>
//         </div>
//     </>
//     }
     
//       <div className="mb-4">
//         <h2 className="user-list-header text-center font-semibold text-gray-800">User List</h2>
//         <div className="mx-auto mt-2 h-px w-4/5 bg-[#2563EB]/40"></div>
//       </div>

//       {isLoading ? (
//         <table className="w-full table-auto text-left">
//           <tbody aria-busy={isLoading} role="status">
//             <TableSkeleton rows={4} showNumber={true} showActions={true} status={true} />
//           </tbody>
//         </table>
//       ) : displayUsers.length === 0 ? (
//         <div className="p-6 text-center text-gray-600">No users found.</div>
//       ) : (
//         <div className="user-table-scroll h-[60vh] overflow-y-auto pr-1">
//           <table className="w-full table-auto text-left">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="user-table-header py-2 px-4 font-bold text-gray-800 text-left">Name / Email</th>
//                 <th className="user-table-header py-2 px-4 font-bold text-gray-800 text-right">Status</th>
//                 <th className="user-table-header py-2 px-4 text-center">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {displayUsers.map((u, index) => (
//                 <tr
//                   key={u._id || index}
//                   className={`border-b border-gray-200 cursor-pointer transition-colors hover:bg-blue-50/60 ${
//                     selectedUser?._id === u._id ? "bg-blue-50 border-blue-300" : ""
//                   }`}
//                   onClick={(e) => handleRowClick(u, e)}
//                 >
//                   <td className="user-table-cell py-2 sm:py-3 px-2 sm:px-4">
//                     <div className="font-medium">{u.name || u.email}</div>
//                   </td>

//                   <td className="user-table-cell py-2 sm:py-3 px-2 sm:px-4 text-left">
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleToggleStatus(u);
//                       }}
//                       className={`inline-block px-3 py-1 rounded text-xs font-semibold focus:outline-none ${
//                         u.isActive
//                           ? "bg-green-100 text-green-800 border border-green-300"
//                           : "bg-red-100 text-red-800 border border-red-300"
//                       }`}
//                       title={u.isActive ? "Click to suspend" : "Click to activate"}
//                     >
//                       {u.isActive ? "Active" : "Inactive"}
//                     </button>
//                   </td>

//                   <td className="user-table-cell py-2 sm:py-3 px-2 sm:px-4">
//                     <div className="flex justify-center gap-2 sm:gap-3" onClick={(e) => e.stopPropagation()}>
//                       <button onClick={() => handleEditOpen(u._id)} className="cursor-pointer user-action-btn rounded-full border border-green-500/50 bg-white flex items-center justify-center hover:bg-green-50 w-8 h-8">
//                         <Pencil className="text-green-600 user-action-icon " size={16} />
//                       </button>
//                       <button onClick={() => handleDeleteOpen(u.email, u._id)} className="cursor-pointer user-action-btn rounded-full border border-red-500/50 bg-white flex items-center justify-center hover:bg-red-50 w-8 h-8">
//                         <Trash className="text-red-600 user-action-icon " size={16} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );

//   const displayUsers = Managers && Managers.length > 0 ? Managers : [];

//   return (
//     <>
//       {isDesktop ? (
//         renderListMarkup()
//       ) : (
//         <>
        
//           <div className="flex items-center justify-between mb-4">
//             <h1 className="user-list-title font-semibold text-gray-800">User Management</h1>
//             <div>
//               <IconButton aria-label="Open users" size="small" onClick={() => setDrawerOpen(true)}>
//                 <Menu size={20} />
//               </IconButton>
//             </div>
//           </div>

//           <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)} PaperProps={{ style: { width: "100%" } }}>
            

//             <div className="p-4">{renderListMarkup()}</div>
//           </Drawer>
//         </>
//       )}

//       {ManagerDeleteModalOpen && <UserDeleteModal userEmail={userEmail} handleClose={handleDeleteClose} handleDelete={handleDelete} />}
//       {ManagerEditModalOpen && <UserEditModal handleClose={handleEditClose} id={userId} />}
//     </>
//   );
// };

// export default UserList;





















// src/pages/UserManagement/UserList.jsx
import { Pencil, Trash, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  DeleteManager,
  fetchAllManagers,
  fetchUsersByCreator, 
  setManagerDeleteModalOpen,
  setManagerEditModalOpen,
  UpdateManagerStatus,
} from "../../slices/ManagerSlice";
import Swal from "sweetalert2";
import "../../styles/pages/management-pages.css";
import UserDeleteModal from "../../components/Modals/UserManagement/DeleteModal";
import UserEditModal from "../../components/Modals/UserManagement/EditModal";
import TableSkeleton from "../../components/skeletons/TableSkeleton";
import { Drawer, IconButton, useMediaQuery } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useStore } from "../../contexts/storecontexts";
import SuspendUserDialog from "../../components/Modals/ManagerManagement/SuspendUserDialog";

const UserList = ({ onUserSelect, selectedUser }) => {
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [selectedUserForSuspend, setSelectedUserForSuspend] = useState(null);
  const [suspending, setSuspending] = useState(false);



  const dispatch = useDispatch();
  const { Managers, ManagerDeleteModalOpen, ManagerEditModalOpen, isLoading } =
    useSelector((state) => state.Manager);

  // Attempt to locate the logged-in user object in the store (common locations).
  const {user: currentUser} = useStore();
  console.log('CurrentUser>', currentUser)

  const isDesktop = useMediaQuery("(min-width:768px)");
  const isMobile = !isDesktop;

  useEffect(() => {
    // If we have a currentUser, choose which fetch to run:
    // - If admin -> fetch all managers (existing behaviour)
    // - If normal user -> fetch users created by this user (use new thunk)
    if (!currentUser) return;

    if (currentUser && currentUser.role === "admin") {
      dispatch(fetchAllManagers());
    }

    if (currentUser?.createdBy === "admin" && currentUser?.role === "user") {
      // For non-admin users, fetch only users created by them
      dispatch(fetchUsersByCreator(currentUser._id));
    } 
    // note: intentionally not including fetchAllManagers/fetchUsersByCreator in deps to avoid repeated calls,
    // but listening to currentUser and dispatch changes.
  }, [currentUser, dispatch]);

  const handleDeleteOpen = (email, id) => {
    dispatch(setManagerDeleteModalOpen(true));
    setUserEmail(email);
    setUserId(id);
  };

  const handleDeleteClose = () => {
    dispatch(setManagerDeleteModalOpen(false));
    setUserEmail("");
    setUserId(null);
  };

  const handleEditOpen = (id) => {
    dispatch(setManagerEditModalOpen(true));
    setUserId(id);
  };

  const handleEditClose = () => {
    dispatch(setManagerEditModalOpen(false));
    setUserId(null);
  };

  const handleDelete = async () => {
    try {
      const id = userId;
      const deletedId = await dispatch(DeleteManager(id)).unwrap();
      handleDeleteClose();

      if (isMobile) setDrawerOpen(false);

      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "User deleted",
      });

    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err || "Failed to delete user",
      });
    }
  };

  const handleRowClick = (user, e) => {
    e.stopPropagation();
    onUserSelect && onUserSelect(user);
    if (isMobile) setDrawerOpen(false);
  };

  const handleConfirmSuspend = async (reason) => {
  if (!selectedUserForSuspend) return;

  try {
    setSuspending(true);

    await dispatch(
      UpdateManagerStatus({
        id: selectedUserForSuspend._id,
        isActive: false,
        suspensionReason: reason,
      })
    ).unwrap();

    setSuspendDialogOpen(false);
    setSelectedUserForSuspend(null);

    if (isMobile) setDrawerOpen(false);

    Swal.fire({
      icon: "success",
      title: "Suspended",
      text: `${selectedUserForSuspend.email || selectedUserForSuspend.name} is suspended.`,
    });

    if (currentUser?.role === "admin") dispatch(fetchAllManagers());
    else dispatch(fetchUsersByCreator(currentUser._id));
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Failed",
      text: err || "Could not suspend user",
    });
  } finally {
    setSuspending(false);
  }
};


  const handleToggleStatus = async (user) => {
    if (!user || !user._id) return;

    if (user.isActive) {
          setSelectedUserForSuspend(user);
        setSuspendDialogOpen(true);
        return;
      
    }


    
    else {
      const result = await Swal.fire({
        title: `Activate ${user.email || user.name}?`,
        text: "This will restore the user's active status.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Activate",
        cancelButtonText: "Cancel",
      });
      if (!result.isConfirmed) return;

      try {
        Swal.fire({ title: "Activating...", allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        await dispatch(UpdateManagerStatus({ id: user._id, isActive: true, suspensionReason: "" })).unwrap();
        if (isMobile) setDrawerOpen(false);
        Swal.fire({ icon: "success", title: "Activated", text: `${user.email || user.name} is now active.` });
        if (currentUser && currentUser.role === "admin") dispatch(fetchAllManagers());
        else if (currentUser && currentUser._id) dispatch(fetchUsersByCreator(currentUser._id));
      } catch (err) {
        console.error("UpdateManagerStatus error:", err);
        Swal.fire({ icon: "error", title: "Failed", text: err || "Could not activate user" });
      }
    }
  };

  
  // use the Managers array provided by the slice
  const displayUsers = Managers && Managers.length > 0 ? Managers : [];

  const renderListMarkup = () => (
    <div className="ListPage user-list-container  bg-white rounded-xl shadow-sm w-full h-full border border-[#E5E7EB]">
      {isDesktop ? (
        <h1 className="organization-list-title font-semibold text-gray-800 mb-4">User Management</h1>
      ) : (
        <>
          <div className="flex justify-end">
            <IconButton
              onClick={() => {
                setDrawerOpen(false);
              }}
              edge="start"
              aria-label="close-details"
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </div>
        </>
      )}

      <div className="mb-4">
        {/* <h2 className="user-list-header text-center font-semibold text-gray-800">
          {currentUser && currentUser.role === "user"
            ? "Users created by you"
            : "User List"}
        </h2> */}
        <h2 className="user-list-header text-center font-semibold text-gray-800">
          User List
        </h2>
        <div className="mx-auto mt-2 h-px w-4/5 bg-[#2563EB]/40"></div>
      </div>

      {isLoading ? (
        <table className="w-full table-auto text-left">
          <tbody aria-busy={isLoading} role="status">
            <TableSkeleton rows={4} showNumber={true} showActions={true} status={true} role={currentUser?.role}/>
          </tbody>
        </table>
      ) : displayUsers.length === 0 ? (
        <div className="p-6 text-center text-gray-600">No users found.</div>
      ) : (
        <div className="user-table-scroll h-[77vh] sm:h-[60vh] overflow-y-auto md:pr-1">
          <table className="w-full table-auto text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="user-table-header py-2 px-4 font-bold text-gray-800 text-left">Name / Email</th>
                {
                  currentUser?.role === "admin" && <th className="user-table-header py-2 px-4 font-bold text-gray-800 text-right">Status</th> 
}
                <th className="user-table-header py-2 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayUsers.map((u, index) => (
                <tr
                  key={u._id || index}
                  className={`border-b border-gray-200 cursor-pointer transition-colors hover:bg-blue-50/60 ${
                    selectedUser?._id === u._id ? "bg-blue-50 border-blue-300" : ""
                  }`}
                  onClick={(e) => handleRowClick(u, e)}
                >
                  <td className="user-table-cell py-2 sm:py-3 px-2 sm:px-4">
                    <div className="md:font-medium text-xs xs:text-xs sm:text-sm md:text-md  ">{u.name || u.email}</div>
                  </td>

          {
            currentUser?.role === "admin" && (
              <td className="user-table-cell py-2 sm:py-3 px-2 sm:px-4 text-center">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleStatus(u);
                                }}
                                className={`inline-block px-1.5 md:px-3 py-1 rounded text-xs font-semibold focus:outline-none ${
                                  u.isActive
                                    ? "bg-green-100 text-green-800 border border-green-300"
                                    : "bg-red-100 text-red-800 border border-red-300"
                                }`}
                                title={u.isActive ? "Click to suspend" : "Click to activate"}
                              >
                                {u.isActive ? "Active" : "Inactive"}
                              </button>
                            </td>
            )
          }
                  

                  <td className="user-table-cell py-2 sm:py-3 px-2 sm:px-4">
                    <div className="flex justify-center gap-2 sm:gap-3" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => handleEditOpen(u._id)} className="cursor-pointer user-action-btn rounded-full border border-green-500/50 bg-white flex items-center justify-center hover:bg-green-50 w-8 h-8">
                        <Pencil className="text-green-600 user-action-icon " size={16} />
                      </button>
                      <button onClick={() => handleDeleteOpen(u.email, u._id)} className="cursor-pointer user-action-btn rounded-full border border-red-500/50 bg-white flex items-center justify-center hover:bg-red-50 w-8 h-8">
                        <Trash className="text-red-600 user-action-icon " size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
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
            <h1 className="user-list-title font-semibold text-gray-800">User Management</h1>
            <div>
              <IconButton aria-label="Open users" size="small" onClick={() => setDrawerOpen(true)}>
                <Menu size={20} />
              </IconButton>
            </div>
          </div>

          <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)} PaperProps={{ style: { width: "100%" } }}>
            <div className="p-4">{renderListMarkup()}</div>
          </Drawer>
        </>
      )}

      {ManagerDeleteModalOpen && <UserDeleteModal userEmail={userEmail} handleClose={handleDeleteClose} handleDelete={handleDelete} />}
      {ManagerEditModalOpen && <UserEditModal handleClose={handleEditClose} id={userId} />}
      <SuspendUserDialog
      open={suspendDialogOpen}
      user={selectedUserForSuspend}
      loading={suspending}
      onClose={() => {
        setSuspendDialogOpen(false);
        setSelectedUserForSuspend(null);
      }}
      onConfirm={handleConfirmSuspend}
    />

    </>
  );
};

export default UserList;
