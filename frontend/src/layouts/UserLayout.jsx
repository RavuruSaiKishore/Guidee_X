import useAutoLogout from "../hooks/useAutoLogout";
import Navbar from "../components/Common/Navbar";
import { Outlet } from "react-router-dom";
import FloatingChat from "../components/Chat/FloatingChat"; // 👈 Import your floating chat widget

const UserLayout = () => {
  useAutoLogout(15 * 60 * 1000);

  return (
    <>
      <Navbar />
      <Outlet />

      {/* Floating AI Chat Widget (Only renders within public & student pages) */}
      <FloatingChat />
    </>
  );
};

export default UserLayout;
