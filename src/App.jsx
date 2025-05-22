
// import AuthPage1 from './components/AuthPage1';
// import DashboardLayout from './layout/DashboardLayout';
// function App() {
//   return (
//     <div className="App">
//     <AuthPage1/>
//     {/* <DashboardLayout/> */}
//     </div>
//   );
// }

// export default App;
import {BrowserRouter as Router,Route,Routes} from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout";

import AuthPage1 from "./components/AuthPage1";
function App(){
  return(
    <>
      <Router>
        <Routes>
          <Route path="/" element={<DashboardLayout/>}></Route>
          <Route path="/register" element={<AuthPage1/>}></Route>
          <Route path="/login" element={<AuthPage1/>}></Route>
        </Routes>
      </Router>
    </>
  )
}

export default App;