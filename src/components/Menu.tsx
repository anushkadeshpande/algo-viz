import { useState } from "react";
import { menuOptions } from "../utils/menuOptions";

const Menu = () => {
  const [selectedMenuOption, setSelectedMenuOption] = useState("");
  const [selectedSubMenuOption, setSelectedSubMenuOption] = useState("");

  return (
    <nav className="p-6 w-full flex flex-col flex-wrap">
      <ul className="text-gray-400 text-lg font-bold">
        {menuOptions.map((option) => (
          <li
            key={option.title}
            className="bg-gray-700 px-4 py-2 rounded-md cursor-pointer my-3 ease-in duration-300"
            onClick={() =>
              setSelectedMenuOption((prevOption) =>
                prevOption == "" ? option.title : ""
              )
            }
          >
            {option.title}
            {selectedMenuOption === option.title ? (
              <ul>
                {option.options.map((op) => (
                  <li
                    key={op.title}
                    className="bg-slate-600 pl-4 rounded-md my-2"
                  >
                    {op.title}
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
