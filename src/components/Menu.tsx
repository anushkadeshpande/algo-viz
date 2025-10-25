import { useState } from "react";
import { menuOptions } from "../utils/menuOptions";

const Menu = ({setView, setIsOpen, isCollapsed = false, view}: any) => {
  const [selectedMenuOption, setSelectedMenuOption] = useState("");
  const [selectedSubMenuOption, setSelectedSubMenuOption] = useState("");

  const handleAlgorithmSelect = (algorithm: string) => {
    setView(algorithm);
    // Close sidebar on mobile when an algorithm is selected
    if (setIsOpen) {
      setIsOpen(false);
    }
  };

  // Collapsed view - show only icons
  if (isCollapsed) {
    return (
      <nav className="p-2 w-full flex flex-col items-center gap-2 mt-4">
        {menuOptions.map((option) => (
          <div
            key={option.title}
            className="bg-gray-700 p-3 rounded-md cursor-pointer hover:bg-gray-600 transition-colors group relative"
            title={option.title}
          >
            {/* Icon based on option type */}
            <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {option.title === "Sorting" ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
              ) : option.title === "Searching" ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
            {/* Tooltip on hover */}
            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg">
              {option.title}
              <div className="text-xs text-gray-400 mt-1">
                {option.options.map(o => o.title).join(", ")}
              </div>
            </div>
          </div>
        ))}
      </nav>
    );
  }

  // Expanded view - show full menu
  return (
    <nav className="p-6 w-full flex flex-col flex-wrap">
      <ul className="text-gray-400 text-lg font-bold">
        {/* Show menu options */}
        {menuOptions.map((option) => (
          <li
            key={option.title}
            className="bg-gray-700 px-4 py-2 rounded-md cursor-pointer my-3"
            // hover:pb-4 ease-in duration-300 transition-all
            onClick={() =>
              setSelectedMenuOption(option.title)
            }
            // onMouseLeave={() =>
            //   setSelectedMenuOption("")
            // }
          >
            <span>{option.title}</span>
            {/* Show sub menu options */}
            {selectedMenuOption === option.title ? (
              <ul>
                {option.options.map((op) => (
                  <li
                    key={op.title}
                    className="bg-slate-600 pl-4 rounded-md my-2"
                    onClick={() =>
                      setSelectedSubMenuOption(op.title)
                    }
                  >
                    <span>{op.title}</span>

                    {/* Show sub sub menu options */}
                    {
                      selectedSubMenuOption === op.title? <ul>
                        {
                          op.options.map(o => <li key={o}
                            className={`pl-4 rounded-md my-2 transition-colors ${
                              view === o 
                                ? 'bg-gray-600 text-white font-semibold border-l-4 border-yellow-500' 
                                : 'bg-slate-600 hover:bg-slate-500'
                            }`}
                            onClick={() =>
                              handleAlgorithmSelect(o)
                            }
                            >
                            <span>{o}</span>
                          </li>)
                        }
                      </ul> : ""
                    }
                  </li>
                ))}
              </ul>
            ) : (
              ""
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Menu;
