import { initialDeviceState } from "./initialDeviceState";

export function deviceReducer(state, action) {
  switch (action.type) {
    case "SET_ACTIVE_DEVICE":
      return {
        ...initialDeviceState,
        currentDeviceId: action.payload,
      };

    case "SET_FILE_LIST":
      return { ...state, fileList: action.payload };

    case "SET_CONTACT_LIST":
      return { ...state, contactList: action.payload };

    case "SET_MESSAGE_LIST":
      return { ...state, messageList: action.payload };

    case "SET_CALL_LOG_LIST":
      return { ...state, callLogList: action.payload };

    case "SET_GRANTED_PERMISSIONS":
      return { ...state, grantedPermissions: action.payload };

    case "SET_AUTO_DOWNLOADS":
      return { ...state, downloadList: action.payload };

    case "SET_NOTIFICATIONS":
      return { ...state, notificationList: action.payload };

    case "SET_MY_DEVICES":
      return { ...state, myDevices: action.payload };
    case "SET_DEVICE_INFORMATION":
      return { ...state, deviceInfo: action.payload };
    case "SET_DEVICE_STATS":
      return { ...state, deviceStats: action.payload };

    default:
      return state;
  }
}
