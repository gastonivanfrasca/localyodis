import { Download, Rss, Upload } from "lucide-react";

import { ExportConfigModal } from "../../components/ExportConfigModal";
import { ImportConfigModal } from "../../components/ImportConfigModal";
import { Link } from "react-router";
import { MenuItem } from "../../components/v2/MenuItem";
import { NavBar } from "../../components/BottomNavBar";
import { NavigationWithBack } from "../../components/v2/NavigationItems";
import { ThemeSwitcher } from "../../components/ThemeSwitcher";
import { useNavigation } from "../../context/hooks";
import { useState } from "react";

export const Menu = () => {
  const { isDesktop } = useNavigation();
  const [exportOpen, setExportOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  return (
    <div className="w-full h-screen dark:bg-slate-900 max-h-screen md:flex md:flex-row md:gap-0 gap-8">
      <NavBar items={<NavigationWithBack />} desktop={isDesktop} />
      <div className="flex flex-col gap-5 py-6 px-6 w-full dark:text-white text-black">
        <div className="flex items-baseline justify-between mb-1">
          <div className="text-2xl font-bold tracking-tight mb-4">Settings</div>
          <ThemeSwitcher />
        </div>
        <div className="flex flex-col gap-4 justify-center items-center w-full">
          <Link
            to={"/sources"}
            className="cursor-pointer w-full justify-center items-center flex"
          >
            <MenuItem icon={<Rss />} label="Sources" />
          </Link>
          <MenuItem
            icon={<Upload />}
            label="Export Configuration"
            onClick={() => setExportOpen(true)}
          />
          <MenuItem
            icon={<Download />}
            label="Import Configuration"
            onClick={() => setImportOpen(true)}
          />
        </div>
      </div>
      <ExportConfigModal
        isOpen={exportOpen}
        onClose={() => setExportOpen(false)}
      />
      <ImportConfigModal
        isOpen={importOpen}
        onClose={() => setImportOpen(false)}
      />
    </div>
  );
};
