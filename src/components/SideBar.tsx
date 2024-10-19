import Header from "./Header";
import Menu from "./Menu";

const SideBar = () => {
  return (
    <div className="bg-gray-800 w-80 flex flex-col h-screen items-center pt-3">
      <Header />
      <Menu />
    </div>
  );
};

export default SideBar;
