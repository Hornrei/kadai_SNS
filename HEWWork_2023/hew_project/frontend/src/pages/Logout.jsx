import React,{useEffect} from "react";
import { useNavigate,  } from "react-router-dom";
import { useCookies } from "react-cookie";
import { config } from "../config";

function Logout() {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["user_id"]);
  useEffect(() => {
    // fetch(`${config.apiUrl}/api/v1/auth/logout`, {
    //   method: "POST",
    //   credentials: "include",
    //   mode: "cors",
    // })
    //   .then((res) => res.json())
    //   .then((data) => {
    //     removeCookie("user_id");
    //     window.location.href= `${config.apiUrl}/api/v1/auth/logout/redirect`;
    //   })
    //   .catch((error) => {
    //     navigate("/");
    //   });
    removeCookie("user_id");
    window.location.href= `${config.apiUrl}/api/v1/auth/logout/redirect`;
  }
  ,[]);
  return (
    <>
    
    </>
  );
}

export default Logout;
