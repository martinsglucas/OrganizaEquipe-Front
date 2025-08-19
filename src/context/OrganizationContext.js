import { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";

const OrganizationContext = createContext();

export const OrganizationProvider = ({ children }) => {
  const [organization, setOrganization] = useState(null);
  const { user } = useAuth();
  const administrador = organization?.admins.some(
    (admin) => admin.id === user?.id
  ) || false;

  return (
    <OrganizationContext.Provider value={{ organization, setOrganization, administrador }}>
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error("useOrganization must be used within a OrganizationProvider");
  }
  return context;
};
