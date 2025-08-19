import { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";

const TeamContext = createContext();

export const EquipeProvider = ({ children }) => {
  const [team, setTeam] = useState(null);
  const [teams, setTeams] = useState([]);
  const { user } = useAuth();
  const admin = team?.admins.some(
    (admin) => admin.id === user?.id
  ) || false;

  return (
    <TeamContext.Provider value={{ team, setTeam, admin, teams, setTeams }}>
      {children}
    </TeamContext.Provider>
  );
};

export const useTeam = () => {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error("useTeam must be used within a EquipeProvider");
  }
  return context;
};
