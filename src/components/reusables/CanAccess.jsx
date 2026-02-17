import { useAuth } from "../../context/AuthContext";

const CanAccess = ({ permission, children }) => {
  const { hasPermission } = useAuth();

  if (!hasPermission(permission)) return null;

  return children;
};

export default CanAccess;
