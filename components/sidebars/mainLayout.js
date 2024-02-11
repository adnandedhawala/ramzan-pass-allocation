import { Divider, Drawer, Menu } from "antd";
import { useGlobalContext } from "context/global";
import { useRouter } from "next/router";
import { logout } from "fe";
import Image from "next/image";
import { PAGE_LIST } from "appConstants";

const getItem = (label, key, icon, children, type) => {
  return {
    key,
    icon,
    children,
    label,
    type
  };
};

export const MainLayoutSidebar = ({ showSidebarMenu, handleClose }) => {
  const { selectedSidebarKey, changeSelectedSidebarKey } = useGlobalContext();
  const router = useRouter();

  const handleMenuClick = ({ key }) => {
    switch (key) {
      case PAGE_LIST.LOGOUT: {
        logout();
        router.push("/");
        break;
      }

      case PAGE_LIST.ALLOCATION: {
        handleClose();
        router.push("/allocation");
        break;
      }

      case PAGE_LIST.REGISTRATION_LIST: {
        handleClose();
        router.push("/register/list");
        break;
      }

      case PAGE_LIST.ALLOCATION_LIST: {
        handleClose();
        router.push("/passes/list");
        break;
      }

      case PAGE_LIST.SETTINGS: {
        handleClose();
        router.push("/settings");
        break;
      }

      default: {
        changeSelectedSidebarKey(key.toString());
        break;
      }
    }
  };

  const menuItems = [
    getItem("Allocation", PAGE_LIST.ALLOCATION),
    getItem("Registration List", PAGE_LIST.REGISTRATION_LIST),
    getItem("Allocation List", PAGE_LIST.ALLOCATION_LIST),
    getItem("Settings", PAGE_LIST.SETTINGS),
    getItem("Logout", PAGE_LIST.LOGOUT)
  ];

  return (
    <Drawer
      width={250}
      className="sidebar"
      placement="left"
      onClose={handleClose}
      closable={false}
      open={showSidebarMenu}
    >
      <div className="mt-6 flex justify-center w-full">
        <Image src="/jamaatLogo.png" alt="logo" width={90} height={90} />
      </div>
      <Divider />

      <Menu
        onClick={handleMenuClick}
        theme="light"
        mode="inline"
        selectedKeys={[selectedSidebarKey]}
        items={menuItems}
      />
    </Drawer>
  );
};
