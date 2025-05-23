import {BrowserRouter as Router,Route,Routes} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import DashboardLayout from "./layout/DashboardLayout";
import Logout from "./components/Logout";
import AuthPage1 from "./components/AuthPage1";
import ProtectedRoute from "./components/ProtectedRoute";
function App(){
  return(
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<AuthPage1/>}></Route>
          <Route path="/" element={<ProtectedRoute><DashboardLayout/></ProtectedRoute>} ></Route>
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<AuthPage1/>}></Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App;