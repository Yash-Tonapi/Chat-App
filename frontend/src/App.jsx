import Navbar from "./components/Navbar";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";

import { Routes, Route} from "react-router-dom";

const App = () => {
  return ( 
  <div> 

    <Navbar />
    {/* Each Route has a path and an element(prop that tells React what to render) */}
    <Routes>
      <Route path="/" element= { <HomePage /> } />
      <Route path="/signup" element= { <SignUpPage /> } />
      <Route path="/login" element= { <LoginPage /> } />
      <Route path="/settings" element= { <SettingsPage /> } />
      <Route path="/profile" element= { <ProfilePage /> } />
    </Routes>

  </div>
  );
};
export default App