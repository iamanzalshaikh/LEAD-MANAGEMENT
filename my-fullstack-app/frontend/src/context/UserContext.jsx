// import { createContext, useContext, useEffect, useState , useCallback} from "react";
// import { AuthContext } from "./AuthContext";
// import axios from "axios";

// export const userDataContext = createContext();

// function UserContext({ children }) {
//   const [userdata, setUserData] = useState(null);
//   const { serverUrl } = useContext(AuthContext);

// //   const getCurrentUser = async () => {
// //     try {
// //       const result = await axios.get(
// //         `${serverUrl}/api/user/getCurrentUser`,
// //         {
// //           withCredentials: true,
// //         }
// //       );
// //       setUserData(result.data);
// //       console.log("Current user data:", result.data);
// //     } catch (error) {
// //       setUserData(null);
// //       console.error("Error fetching current user:", error.response?.data || error.message);
// //     }
// //   }, [serverUrl] );

// //  useEffect(() => {
// //     getCurrentUser();
// //   }, [getCurrentUser]);; // Re-run if serverUrl changes, though it's usually static


//   const getCurrentUser = useCallback(async () => {
//     try {
//       const result = await axios.get(`${serverUrl}/api/user/getCurrentUser`, {
//         withCredentials: true,
//       });
//       setUserData(result.data);
//       console.log("Current user data:", result.data);
//     } catch (error) {
//       setUserData(null);
//       console.error("Error fetching current user:", error.response?.data || error.message);
//     }
//   }, [serverUrl]);

//   useEffect(() => {
//     getCurrentUser();
//   }, [getCurrentUser]); // ✅ safe, won't rerun infinitely


//   const value = {
//     userdata,
//     setUserData,
//     getCurrentUser,
//   };

//   return (
//     <userDataContext.Provider value={value}>
//       {children}
//     </userDataContext.Provider>
//   );
// }

// export default UserContext;



// import { createContext, useContext, useEffect, useState, useRef } from "react";
// import { AuthContext } from "./AuthContext";
// import axios from "axios";

// export const userDataContext = createContext();

// function UserContext({ children }) {
//   const [userdata, setUserData] = useState(null);
//   const { serverUrl } = useContext(AuthContext);

//   // ✅ Track if user has been fetched
//   const hasFetched = useRef(false);

//  const getCurrentUser = async () => {
//         if (hasFetched.current) return; // Prevent multiple calls
//     hasFetched.current = true;
//     try {
//       const result = await axios.get(
//         `${serverUrl}/api/user/getCurrentUser`,
//         {
//           withCredentials: true,
//         }
//       );
//       setUserData(result.data);
//       console.log("Current user data:", result.data);
//     } catch (error) {
//       setUserData(null);
//       console.error("Error fetching current user:", error.response?.data || error.message);
//     }
//   };

//   useEffect(() => {
//     getCurrentUser();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []); // Only once on mount

//   return (
//     <userDataContext.Provider value={{ userdata, setUserData, getCurrentUser }}>
//       {children}
//     </userDataContext.Provider>
//   );
// }

// export default UserContext;



import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import axios from "axios";

export const userDataContext = createContext();

function UserContext({ children }) {
  const [userdata, setUserData] = useState(null);
  const [loaded, setLoaded] = useState(false); // ✅ track first load
  const { serverUrl } = useContext(AuthContext);

  const getCurrentUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/getCurrentUser`, {
        withCredentials: true,
      });
      setUserData(result.data);
      console.log("✅ Current user data:", result.data);
    } catch (error) {
      setUserData(null);
      console.error("❌ Error fetching current user:", error.response?.data || error.message);
    } finally {
      setLoaded(true); // ✅ done loading
    }
  };

  useEffect(() => {
    if (!loaded) {
      getCurrentUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  return (
    <userDataContext.Provider value={{ userdata, setUserData, getCurrentUser }}>
      {children}
    </userDataContext.Provider>
  );
}

export default UserContext;
