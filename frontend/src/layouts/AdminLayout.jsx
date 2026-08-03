import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* You can add AdminSidebar here later */}
      
      <Outlet />
    </div>
  );
};

export default AdminLayout;
