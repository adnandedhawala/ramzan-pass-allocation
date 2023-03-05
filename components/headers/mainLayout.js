import { Button, Layout, Tooltip } from "antd";
import { MenuUnfoldOutlined, LeftOutlined } from "@ant-design/icons";
const { Header } = Layout;

export const MainLayoutHeader = ({
  toggleMenu,
  pageTitle,
  handleBack,
  showBack
}) => {
  const handleMenuButtonClick = () => {
    toggleMenu();
  };

  return (
    <Header className="w-full fixed top-0 left-0 flex items-center !px-8 z-10 !bg-[#1E293B]">
      <div className="w-full flex items-center">
        <Button
          className="bg-white p-0 flex items-center justify-center !text-xl"
          icon={<MenuUnfoldOutlined size={40} />}
          onClick={handleMenuButtonClick}
        />
        <h3 className="text-white ml-8 text-2xl font-medium">
          {showBack ? (
            <Tooltip title="Go Back">
              <LeftOutlined
                onClick={handleBack}
                className="mr-2 hover:cursor-pointer"
              />
            </Tooltip>
          ) : null}

          {pageTitle}
        </h3>
      </div>
    </Header>
  );
};
