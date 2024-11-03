import { useState } from "react";
import { menuOptions } from "../utils/menuOptions";

const Menu = ({view, setView}: any) => {
  const [selectedMenuOption, setSelectedMenuOption] = useState("");
  const [selectedSubMenuOption, setSelectedSubMenuOption] = useState("");

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
                          op.options.map(o => <li key={op.title}
                            className="bg-slate-600 pl-4 rounded-md my-2"
                            onClick={() =>
                              setView(o)
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
