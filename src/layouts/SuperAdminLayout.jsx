import { Outlet } from "react-router-dom";
import TopNav from "./TopNav";
import Footer from "./Footer";

export default function SuperAdminLayout() {
  return (
    <div className="flex flex-col   w-full overflow-hidden">
      <TopNav />
      <div className="flex flex-col flex-grow xl:px-[80px] relative min-h-screen -mt-[14px] md:-mt-[64px] 2xl:-mt-[70px]  ">
        <Outlet />
      </div>
      <Footer className="flex-shrink-0" />
    </div>
  );
}

