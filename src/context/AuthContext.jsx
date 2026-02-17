import { createContext, useContext, useState } from "react";
import { rolePermissions } from "../utils/constants/rolePermissions";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const loginAsRole = (role) => {
    setUser({
      role,
      permissions: rolePermissions[role],
    });
  };

  const hasPermission = (permission) =>
    user?.permissions?.includes(permission);

  return (
    <AuthContext.Provider value={{ user, loginAsRole, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
