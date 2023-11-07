import { Layout } from "antd";
import React, { useState } from "react";
import { BurgerIcon } from "../../../assets/icons/Icons";
import Notification from "../Notification/Notification";
import Sidebar from "./Sider/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../../store/store";
import { Route, Routes } from "react-router-dom";
import NotFoundPage from "../../Authenticated/Pages/NotFoundPage";
import CallStatus from "./Header/CallStatus";
import { Suspense } from "react";
import PageLoader from "./PageLoader";

const { logout } = authActions;

const { Header, Content } = Layout;

const MainLayout = ({ routes }) => {
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(false);
  const { currentUser } = useSelector((state) => state.auth);
  const { firstName, lastName, name } = currentUser;

  const toggleCollaped = () => {
    setCollapsed(!collapsed);
  };

  const signoutHandler = () => {
    dispatch(logout());
  };

  return (
    <Layout className="min-h-screen relative">
      {currentUser?.isDemo && (
        <div className="absolute z-50 t-0 w-full bg-primary-900 py-1 text-center">
          <span className="text-white font-semibold text-xl">{`DEMO ${
            currentUser.accountType === "agent"
              ? "DISPATCHER"
              : currentUser.accountType.toUpperCase()
          }`}</span>
        </div>
      )}
      <Sidebar collapsed={collapsed} routes={routes} />
      <Layout className={`site-layout ${currentUser?.isDemo ? "pt-9" : ""}`}>
        <Header className="bg-primary-800 px-1 flex flex-row justify-between">
          <div className="flex flex-row justify-between items-center gap-3">
            <button
              className="rounded hover:bg-primary-800 leading-none p-2 duration-300"
              onClick={toggleCollaped}
            >
              <BurgerIcon className="text-white" />
            </button>
            <span className="text-white font-semibold">
              {`${firstName ? firstName : name} ${lastName || ""}`}
            </span>

            {["agent", "department"].includes(currentUser?.accountType) && (
              <CallStatus />
            )}
          </div>
          <div className="flex flex-row justify-between items-center">
            {(currentUser.accountType === "agent" ||
              currentUser.accountType === "department") && <Notification />}

            <button
              className="p-2 ml-4 bg-primary-800 leading-none rounded hover:bg-primary-900 duration-300 flex flex-row items-center"
              onClick={signoutHandler}
            >
              {/* <ServicesIcon className="text-gray-200 mr-1" /> */}
              <span className="text-gray-200 hover:text-white">Sign out</span>
            </button>
          </div>
        </Header>
        <Content className="bg-gray-100 p-4 h-[calc(100vh-200px)] overflow-y-auto">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {routes.map((route) => {
                if (route.type === "button") return null;
                else
                  return (
                    <Route
                      path={route.path.substr(1)}
                      element={route.element}
                      key={route.path}
                    >
                      {route.children &&
                        route.children.map((r) => {
                          if (r.type === "button") return null;
                          else
                            return (
                              <Route
                                path={r.path.substr(1)}
                                element={r.element}
                                key={r.path}
                              >
                                {r.children &&
                                  r.children.map((r2) => {
                                    if (
                                      (currentUser.isDefault !== 1) &
                                      (r2.path === "/volunteerGroups")
                                    )
                                      return null;
                                    else
                                      return (
                                        <Route
                                          path={r2.path.substr(1)}
                                          element={r2.element}
                                          key={r2.path}
                                        ></Route>
                                      );
                                  })}
                              </Route>
                            );
                        })}
                    </Route>
                  );
              })}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </Content>
      </Layout>
    </Layout>
  );
};
export default MainLayout;
