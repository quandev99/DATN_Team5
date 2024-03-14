import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { getDecodedAccessToken } from "../decoder";

const PrivateRouterLogin = ({ isAuth }: any) => {
  const navigate = useNavigate();

  const data: any = getDecodedAccessToken();
  const roleName = useMemo(() => data?.role_name, [data]);

  useEffect(() => {
    if (
      roleName !== "Admin" &&
      roleName !== "Member" &&
      roleName !== "Customer"
    ) {
      navigate("/login");
    }
  }, [isAuth, roleName, navigate]);

  return isAuth &&
    (roleName === "Admin" ||
      roleName === "Member" ||
      roleName === "Customer") ? (
    <Outlet />
  ) : null;
};

export default PrivateRouterLogin;
