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

      case PAGE_LIST.SETTINGS: {
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
      <div className="px-6 pt-6">
        <Image src="/jamaatLogo.png" alt="logo" width={75} height={75} />
        <Divider />
      </div>
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
