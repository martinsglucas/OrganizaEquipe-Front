import styles from "./Sidebar.module.css";
import { FaTimes } from "react-icons/fa";
import { MdPerson, MdPersonOff } from "react-icons/md";

import SidebarItem from "./SidebarItem";

function Sidebar({ active }) {
  const closeSidebar = () => active(false);

  return (
    <div className={styles.container}>
      <FaTimes className={styles.svg} onClick={closeSidebar} />
      <div className={styles.content}>
        <SidebarItem
          to={"/perfil"}
          Icon={MdPerson}
          Text={"Meu Perfil"}
          onClick={closeSidebar}
        />
        <SidebarItem
          to={"/indisponibilidade"}
          Icon={MdPersonOff}
          Text={"Indisponibilidade"}
          onClick={closeSidebar}
        />
      </div>
    </div>
  );
}

export default Sidebar;
