import Header from "./Header";
import Menu from "./Menu";

const SideBar = ({view, setView}: any) => {
  return (
    <div className="bg-gray-800 w-80 flex flex-col h-screen items-center pt-3">
      <Header />
      <Menu view={view} setView={setView} />
    </div>
  );
};

export default SideBar;
