import { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";

const TeamContext = createContext();

export const isTeamAdmin = (team, userId) =>
  Boolean(
    userId &&
      team?.admins?.some((admin) =>
        typeof admin === "object" ? admin.id === userId : admin === userId
      )
  );

export const TeamProvider = ({ children }) => {
  const [team, setTeam] = useState(null);
  const [teams, setTeams] = useState([]);
  const { user } = useAuth();
  const admin = isTeamAdmin(team, user?.id);

  return (
    <TeamContext.Provider value={{ team, setTeam, admin, teams, setTeams }}>
      {children}
    </TeamContext.Provider>
  );
};

export const useTeam = () => {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error("useTeam must be used within a TeamProvider");
  }
  return context;
};
