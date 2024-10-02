import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
  useLocation,
} from "react-router-dom";
import Sidebar from "./components/Admin/Dashboard/Sidebar";
import Home from "./components/Admin/Dashboard/Home";
import RidersList from "./components/Admin/Riders/RidersList";
import AddRiders from "./components/Admin/Riders/AddRiders";
import RidersUpdate from "./components/Admin/Riders/RidersUpdate";
import RiderLogin from "./components/Login/RiderLogin";
import OrdersAdd from "./components/Admin/Orders/OrdersAdd";
import OrdersList from "./components/Admin/Orders/OrdersList";
import OrdersUpdate from "./components/Admin/Orders/OrdersUpdate";
import ProtectedRoute from "./utils/ProtectedRoute";
import WelcomeRider from "./components/User/WelcomeRider";
import ViewOrders from "./components/User/Components/RidersOrder/ViewOrders";
import Error404 from "./utils/Error404";
import YourProfile from "./components/User/Components/RidersOrder/YourProfile";
import OrdersManage from "./components/Admin/OrdersManage/OrdersManage";

// Allowed routes for each role
const riderRoutes = ["/WelcomeRider", "/ViewOrders", "/YourProfile"];
const adminRoutes = [
  "/AddRiders",
  "/RidersList",
  "/RidersUpdate",
  "/OrdersAdd",
  "/OrdersList",
  "/OrdersUpdate",
  "/OrdersManage",
];

function App() {
  return (
    <Router>
      <Routes>
        {/* Login Page Route */}
        <Route path="/RiderLogin" element={<RiderLogin />} />
        {/* Rider Routes */}
        <Route
          path="/WelcomeRider"
          element={
            <ProtectedRoute allowedRoutes={riderRoutes}>
              <WelcomeRider />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ViewOrders"
          element={
            <ProtectedRoute allowedRoutes={riderRoutes}>
              <ViewOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/YourProfile"
          element={
            <ProtectedRoute allowedRoutes={riderRoutes}>
              <YourProfile />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}

        {/* Dashboard Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoutes={adminRoutes}>
              <DashboardLayout /> 
              <ProtectedRoute
                allowedRoutes={adminRoutes}
                component={DashboardLayout}
              />
            </ProtectedRoute>
          }
        >
          {/* RiderPage Routes for Admin */}
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoutes={adminRoutes}>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/OrdersManage"
            element={
              <ProtectedRoute allowedRoutes={adminRoutes}>
                <OrdersManage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/RidersList"
            element={
              <ProtectedRoute allowedRoutes={adminRoutes}>
                <RidersList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/AddRiders"
            element={
              <ProtectedRoute allowedRoutes={adminRoutes}>
                <AddRiders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/RidersUpdate/:id"
            element={
              <ProtectedRoute allowedRoutes={adminRoutes}>
                <RidersUpdate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/OrdersAdd"
            element={
              <ProtectedRoute allowedRoutes={adminRoutes}>
                <OrdersAdd />
              </ProtectedRoute>
            }
          />
          <Route
            path="/OrdersList"
            element={
              <ProtectedRoute allowedRoutes={adminRoutes}>
                <OrdersList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/OrdersUpdate/:id"
            element={
              <ProtectedRoute allowedRoutes={adminRoutes}>
                <OrdersUpdate />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </Router>
  );
}

function DashboardLayout() {
  const location = useLocation();

  // List of routes where the Sidebar should be visible
  const adminRoutes = [
    "/AddRiders",
    "/RidersList",
    "/RidersUpdate",
    "/OrdersAdd",
    "/OrdersList",
    "/OrdersUpdate",
    "/OrdersManage"
  ];

  const shouldRenderSidebar = adminRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  return (
    <div className="flex h-[100vh] overflow-hidden ">
      {/* Conditionally render Sidebar only on admin routes */}
      {shouldRenderSidebar && <Sidebar />}
      <main className="">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
