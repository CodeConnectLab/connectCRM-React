"use client";
import GeneralSetting from "./Components/GeneralSetting";
import DepartmentSetting from "./Components/DepartmentSetting";
// import SubscriptionInfo from "./Components/SubscriptionInfo";
import useScreenHook from "../../hooks/useScreenHook";
import CRMFields from "./Components/CRMFields";
import StorageInsights from "./Components/StorageInsight";
import TabPanel from "../../components/TabPanel/TabPanel";
import RolePermissions from "./Components/RolePermission";
import { useParams } from "react-router-dom";

const Settings: React.FC = () => {
  const { id } = useParams();

  const tabsData = [
    {
      tabName: "Company Details",
      component: <GeneralSetting />,
    },
    { tabName: "Department", component: <DepartmentSetting /> },
    { tabName: "CRM Field", component: <CRMFields /> },
    // { tabName: "Subscription", component: <SubscriptionInfo /> },
    { tabName: "Permission Settings", component: <RolePermissions /> },
    { tabName: "Storage Insights", component: <StorageInsights /> },
  ];

  const { deviceType } = useScreenHook();

  return (
    <div className="rounded-lg bg-white p-3 pt-0 lg:p-6 lg:pl-0 shadow-md dark:bg-gray-800">
      <div className="flex">
        <div className="w-full">
          {deviceType === "desktop" ? (
            <TabPanel
              tabsData={tabsData}
              type="line"
              tabPosition="left"
              defaultActiveKey={id || "1"}
            />
          ) : (
            <TabPanel
              tabsData={tabsData}
              type="line"
              tabPosition="top"
              defaultActiveKey={id || "1"}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
