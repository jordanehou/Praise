// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import Login from "./pages/LoginPage";
// import RegisterPage from "./pages/RegisterPage";
// import Dashboard from "./pages/Dashboard";
// import ProductDashboard from "./pages/ProductDashboard";
// import DeliveryDashboard from "./pages/DeliveryDashboard";
// import UsageDashboard from "./pages/UsageDashboard";
// import { useAuth } from "./pages/AuthContext"; // Importer le contexte
// import { FC } from "react"; // Importer FC

// function App() {
//   // return (
//   //   <Router>
//   //     <Routes>
//   //       <Route path="/login" element={<LoginPage />} />
//   //       <Route path="/register" element={<RegisterPage />} />
//   //       <Route path="/dashboard" element={<Dashboard />} />
//   //       <Route path="/deliveries" element={<DeliveryDashboard />} />
//   //       <Route path="/usages" element={<UsageDashboard />} />
//   //       <Route path="/products/:categoryId" element={<ProductDashboard />} />
//   //     </Routes>
//   //   </Router>
//   // );
//   const isAuthenticated = !!localStorage.getItem("token"); // Vérifie si l'utilisateur est authentifié

//   return (
//     <Router>
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
//         {/* <Route path="/dashboard" element={isAuthenticated ? <ProductDashboard /> : <Navigate to="/login" />} /> */}
//         <Route path="/register" element={<RegisterPage />} />
// {/* //       <Route path="/dashboard" element={<Dashboard />} /> */}
//        <Route path="/deliveries" element={isAuthenticated ? <DeliveryDashboard /> : <Navigate to="/login" />} />
//        <Route path="/usages" element={isAuthenticated ? <UsageDashboard /> : <Navigate to="/login" />} />
//        <Route path="/products/:categoryId" element={isAuthenticated ? <ProductDashboard /> : <Navigate to="/login" />} />
//       <Route path="/" element={<Navigate to="/login" />} /> Redirige vers /login pour toute autre route
//       </Routes>
//     </Router>
//   );
// }


// const PrivateRoute: FC<{ component: FC }> = ({ component: Component }) => {
//   const { isAuthenticated } = useAuth(); // Utiliser le hook ici
//   return isAuthenticated ? <Component /> : <Navigate to="/login" />;
// };

// export default App;
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./pages/AuthContext"; // Importer le contexte
import Login from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import ProductDashboard from "./pages/ProductDashboard";
import DeliveryDashboard from "./pages/DeliveryDashboard";
import UsageDashboard from "./pages/UsageDashboard";
import { FC } from "react";

const PrivateRoute: FC<{ component: FC }> = ({ component: Component }) => {
  const { isAuthenticated } = useAuth(); // Utiliser le hook ici
  return isAuthenticated ? <Component /> : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<PrivateRoute component={Dashboard} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/deliveries" element={<PrivateRoute component={DeliveryDashboard} />} />
          <Route path="/usages" element={<PrivateRoute component={UsageDashboard} />} />
          <Route path="/products/:categoryId" element={<PrivateRoute component={ProductDashboard} />} />
          <Route path="/" element={<Navigate to="/login" />} /> {/* Redirection vers /login */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;