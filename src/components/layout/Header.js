import { useState } from "react";
import styles from "./Header.module.css";
import { FaBars } from "react-icons/fa";

import Sidebar from "./Sidebar";

function Header() {
  const [sidebar, setSitebar] = useState(false);
  const showSidebar = () => setSitebar(!sidebar);

  return (
    <div className={styles.container}>
      <FaBars className={styles.svg} onClick={showSidebar} />
      {sidebar && <Sidebar active={setSitebar} />}
    </div>
  );
}

export default Header;
