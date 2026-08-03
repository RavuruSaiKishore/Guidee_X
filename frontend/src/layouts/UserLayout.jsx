import useAutoLogout from "../hooks/useAutoLogout";
import Navbar from "../components/Common/Navbar";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
  useAutoLogout(15 * 60 * 1000); 

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default UserLayout;
