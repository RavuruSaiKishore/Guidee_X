import MentorSidebar from "./MentorSidebar";
import { Outlet } from "react-router-dom";

const MentorLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <MentorSidebar />

      <div className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default MentorLayout;
