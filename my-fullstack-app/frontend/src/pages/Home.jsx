import React from 'react';
import AdminDashboard from '../admin/AdminDashboard';
// import Navbar from '../component/Nav';




const Home = () => {
  return (
    <div>
   {/* <Navbar /> */}
 <AdminDashboard />
     
    </div>
  );
};

export default Home;





//  {userdata.role === "admin" && <AdminDashboard />}
//       {userdata.role === "salesman" && <SalesDashboard />}