import { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";

const EquipeContext = createContext();

export const EquipeProvider = ({ children }) => {
  const [equipe, setEquipe] = useState(null);
  const { user } = useAuth();
  const administrador = equipe?.administradores.some(
    (admin) => admin.id === user?.id
  ) || false;

  return (
    <EquipeContext.Provider value={{ equipe, setEquipe, administrador }}>
      {children}
    </EquipeContext.Provider>
  );
};

export const useEquipe = () => {
  const context = useContext(EquipeContext);
  if (!context) {
    throw new Error("useEquipe must be used within a EquipeProvider");
  }
  return context;
};
