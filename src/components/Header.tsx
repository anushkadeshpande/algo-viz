const Header = ({isCollapsed = false}: {isCollapsed?: boolean}) => {
  if (isCollapsed) {
    return (
      <div className="font-mono font-extrabold text-white text-2xl pb-3 border-b-4 border-b-gray-500 px-2 text-center w-full overflow-hidden" title="Algorithm Visualizer">
        <span className="text-pink-400">A</span>
        <span className="text-yellow-500">v</span>
      </div>
    );
  }

  return (
    <div className="font-mono font-extrabold text-white text-xl sm:text-2xl pb-3 border-b-4 border-b-gray-500 px-2 text-center w-full overflow-hidden">
      <span className="text-pink-400">Algorithm</span>.
      <span className="text-yellow-500">visualize()</span>;
    </div>
  );
};

export default Header;
