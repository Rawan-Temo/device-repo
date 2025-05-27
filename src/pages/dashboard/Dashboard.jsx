import { Navigate, Route, Routes } from "react-router";
import Sidebar from "./pages/Sidebar";
import Overview from "./pages/Overview";
import Devices from "./pages/devices/Devices";
import Users from "./pages/users/Users";
import Settings from "./pages/settings/Settings";
// import Logs from "./pages/logs/Logs";
import DevicePage from "./pages/devices/DevicePage";
// import LogsPage from "./pages/logs/LogsPage";
import FileManager from "./pages/devices/FileManager";
import ReportDevice from "./pages/devices/ReportDevice";
import PermissionsTable from "./pages/devices/PermissionsTable";
import Contacts from "./pages/devices/Contacts";
import Sms from "./pages/devices/Sms";
import CallLog from "./pages/devices/CallLog";
import Notifications from "./pages/devices/Notifications";
import AndroidInfoPage from "./pages/devices/AndroidInfoPage";
import AddUser from "./pages/users/AddUser";
import ManageGroups from "./pages/users/ManageGroups";
import LinkUserToGroups from "./pages/users/LinkUserToGroups";
import LinkDeviceToUser from "./pages/users/LinkDeviceToUser";
import ManageUsers from "./pages/users/ManageUsers";
import ParticalBackground from "../../components/particles/ParticalBackground";
import { Context } from "../../context/context";
import { DeviceProvider } from "../../context/DeviceContext";
import { WebSocketProvider } from "../../context/WebSocketProvider";

function Dashboard() {
  return (
    <div className="dashboard-container">
      {/* <ParticalBackground /> */}
      <DeviceProvider>
        <WebSocketProvider>
          <Sidebar />
          <Routes>
            <Route path="" element={<Overview />} />
            <Route path="devices" element={<Devices />}>
              <Route path=":id" element={<DevicePage />}>
                {/* Nested routes under :userId */}
                <Route path="" element={<Navigate to="file-manager" />} />
                <Route path="file-manager" element={<FileManager />} />
                <Route path="contacts" element={<Contacts />} />
                <Route path="sms" element={<Sms />} />
                <Route path="call-log" element={<CallLog />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="permissions" element={<PermissionsTable />} />
                <Route path="info" element={<AndroidInfoPage />} />
                <Route path="notes" element={<ReportDevice />} />
              </Route>
            </Route>
            <Route path="users" element={<Users />}>
              <Route path="" element={<Navigate to="manage-users" />} />
              <Route path="manage-users" element={<ManageUsers />} />
              <Route path="add-users" element={<AddUser />} />
              <Route path="manage-groups" element={<ManageGroups />} />
              <Route path="link-user" element={<LinkUserToGroups />} />
              <Route path="link-device" element={<LinkDeviceToUser />} />
            </Route>

            <Route path="settings" element={<Settings />} />
            {/* <Route path="logs" element={<Logs />}>
          <Route path=":logId" element={<LogsPage />} />
        </Route> */}
            <Route path="/" element={<Overview />} />
          </Routes>
        </WebSocketProvider>
      </DeviceProvider>
    </div>
  );
}

export default Dashboard;
