import Header from "./Header";
import Menu from "./Menu";

const SideBar = ({view, setView, isOpen, setIsOpen, isCollapsed, setIsCollapsed}: any) => {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        bg-gray-800 
        ${isCollapsed ? 'w-20' : 'w-80'}
        flex 
        flex-col 
        h-screen 
        items-center 
        pt-3
        fixed md:relative
        top-0 left-0
        z-40
        transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        overflow-y-auto
        overflow-x-hidden
      `}>
        <Header isCollapsed={isCollapsed} />
        
        {/* Collapse/Expand Toggle Button - Desktop Only */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex mt-3 bg-gray-700 text-white p-2 rounded-lg hover:bg-gray-600 transition-colors w-full mx-3 justify-center items-center"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          style={{ maxWidth: isCollapsed ? '56px' : 'calc(100% - 24px)' }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isCollapsed ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            )}
          </svg>
          {!isCollapsed && <span className="ml-2 text-sm">Collapse</span>}
        </button>

        <Menu view={view} setView={setView} setIsOpen={setIsOpen} isCollapsed={isCollapsed} />
      </div>
    </>
  );
};

export default SideBar;
