import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from "react";
import { getDecodedAccessToken } from '../decoder';

const PrivateRoute = ({ isAuth }: any) => {
  console.log(isAuth);
const navigate = useNavigate();

const data: any = getDecodedAccessToken();
const roleName = data?.role_name;
console.log("roleName", roleName);
  useEffect(() => {
    if (roleName !== "Admin" && roleName !== "Member") {
      navigate("/checkAdmin");
    } else if (roleName !== "Admin") {
        navigate("/member" + "/products");
    } else {
        navigate("/admin" + "/dashboard");
      }
  }, [roleName, navigate]);
  return roleName === "Admin" ? (
    <Outlet />
  ) : roleName === "Member" ? (
    <Outlet />
  ) : (
    <Navigate to="/checkAdmin" />
  );
};

export default PrivateRoute;