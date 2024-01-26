import React, { Suspense, lazy, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import logo from "../src/assets/img/logo/logo.png";
import PageLoader from "./components/UI/Layout/PageLoader";
import {
  callActions,
  cctvActions,
  chatActions,
  dashboardActions,
  mapActions,
  quickReportActions,
  reportsActions,
  resourcesActions,
  ticketsActions,
  usherActions,
  weatherActions,
  authActions,
} from "./store/store";
import UseUpdateActivity from "./Hooks/use-updateactivity";
const Authenticated = lazy(() =>
  import("./components/Authenticated/Authenticated")
);
const Unauthenticated = lazy(() =>
  import("./components/Unauthenticated/Unauthenticated")
);
const OnboardingPage = lazy(() =>
  import("./components/Onboarding/OnboardingPage")
);
const DemoAdmin = lazy(() => import("./components/Demo/DemoAdmin/DemoAdmin"));

const { demoLogin } = authActions;

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, currentUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (
      [
        "/demo-dispatcher",
        "/demo-department",
        "/demo-admin",
        "/demo-supervisor",
        "/demo-writer",
      ].includes(location.pathname)
    ) {
      let accountType = "";
      if ("/demo-dispatcher" === location.pathname) accountType = "dispatcher";
      if ("/demo-department" === location.pathname) accountType = "department";
      if ("/demo-admin" === location.pathname) accountType = "admin";
      if ("/demo-supervisor" === location.pathname) accountType = "supervisor";
      if ("/demo-writer" === location.pathname) accountType = "writer";

      dispatch(
        demoLogin({
          accountType,
          cb: () => {
            navigate("/");
          },
        })
      );
    } else {
      if (!isAuthenticated) {
        dispatch(callActions.reset());
        dispatch(cctvActions.reset());
        dispatch(chatActions.reset());
        dispatch(dashboardActions.reset());
        dispatch(mapActions.reset());
        dispatch(quickReportActions.reset());
        dispatch(reportsActions.reset());
        dispatch(resourcesActions.reset());
        dispatch(ticketsActions.reset());
        dispatch(usherActions.reset());
        dispatch(weatherActions.reset());
      }

      if (
        !isAuthenticated &&
        !["/dgsi", "/onboarding"].includes(location.pathname)
      ) {
        navigate("/");
      } else {
        if (
          location.pathname === "/" &&
          currentUser.accountType !== "superadmin" &&
          currentUser.accountType !== "contentwriter"
        ) {
          navigate("/dashboard");
        } else if (
          location.pathname === "/" &&
          currentUser.accountType === "superadmin"
        )
          navigate("/commandcenters");
        else if (
          location.pathname === "/" &&
          currentUser.accountType === "contentwriter"
        )
          navigate("/news/list");
      }
    }
  }, [isAuthenticated, location.pathname]);

  return (
    <>
      <Routes>
        <Route
          path="/onboarding"
          element={
            <Suspense
              fallback={
                <div className="h-screen w-screen">
                  <PageLoader />
                </div>
              }
            >
              <OnboardingPage />
            </Suspense>
          }
        />
        <Route
          path="*"
          element={
            <>
              <Helmet>
                <title>Defensys - Command Center</title>
                <link rel="icon" href={logo} />
                <meta name="description" content="Defensys - Command Center" />
              </Helmet>
              {!isAuthenticated && location.pathname !== "/quickreport" && (
                <Suspense
                  fallback={
                    <div className="h-screen w-screen">
                      <PageLoader />
                    </div>
                  }
                >
                  <Unauthenticated />
                </Suspense>
              )}
              {isAuthenticated && location.pathname !== "/quickreport" && (
                <Suspense
                  fallback={
                    <div className="h-screen w-screen">
                      <PageLoader />
                    </div>
                  }
                >
                  <UseUpdateActivity>
                    <Authenticated />
                  </UseUpdateActivity>
                </Suspense>
              )}
            </>
          }
        />
      </Routes>
    </>
  );
};

export default App;
