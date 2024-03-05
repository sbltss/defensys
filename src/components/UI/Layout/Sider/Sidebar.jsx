import React from "react";
import { Layout, Menu } from "antd";
import SiderHeader from "./SiderHeader";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";

const { Sider } = Layout;
const Sidebar = ({ collapsed, routes }) => {
  const { currentUser } = useSelector((state) => state.auth);
  // const [expandedMenu, setExpandedMenu] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <Sider
      className={`bg-white ${currentUser?.isDemo ? "pt-9" : ""}`}
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={"270px"}
    >
        <SiderHeader collapsed={collapsed} />
        <div style={{ overflowY: "auto", height: "calc(90vh - 70px)" }}>
      {/* <div className="flex gap-3 items-center p-4 flex-col font-semibold"> */}
      {/* {routes.map((route) => (
          <button
            key={route.path}
            onClick={() => navigate(route.path)}
            className={`w-full rounded-xl p-3 duration-200 text-left flex flex-row align-middle ${
              location.pathname === route.path
                ? "bg-primary-800 text-white hover:bg-primary-900 "
                : "bg-white text-gray-800 hover:bg-gray-200 "
            }`}
          >
            <route.icon className="" />
            {!collapsed && <span className="mx-4">{route.name}</span>}
          </button>
        ))} */}
      {/* </div> */}
      
      <Menu
        // onClick={(e) => navigate(e.keyPath.reverse().join(""))}
        mode="inline"
        selectedKeys={["/" + location.pathname.split("/").at(-1)]}
        defaultOpenKeys={["/" + location.pathname.split("/").at(1)]}
        items={routes.map((route) => ({
          key: route.path,
          icon: <route.icon />,
          label: route.children ? (
            route.name
          ) : (
            <Link to={route.path}>{route.name}</Link>
          ),
          children: route.children?.map((r) => {
            if (r.type === "button")
              return {
                key: r.name,
                children: undefined,
                label: r.element,
              };
            else
              return {
                key: r.path,
                children: r.children?.map((r2) => {
                  {
                    if (
                      (currentUser.isDefault !== 1) &
                      (r2.path === "/volunteerGroups")
                    )
                      return null;
                    else
                      return {
                        key: r2.path,
                        children: undefined,
                        label: (
                          <Link to={route.path + r.path + r2.path}>
                            {r2.name}
                          </Link>
                        ),
                      };
                  }
                }),
                label: r.children ? (
                  r.name
                ) : (
                  <Link to={route.path + r.path}>{r.name}</Link>
                ),
              };
          }),
        }))}
      /></div>
    </Sider>
  );
};

export default Sidebar;
