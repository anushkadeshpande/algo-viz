import {
  ARRAY,
  BINARY_SEARCH,
  BINARY_TREE,
  BUBBLE_SORT,
  GRAPH,
  LINKED_LIST,
  QUICK_SORT,
  SEARCHING,
  SORTING,
} from "./constants";

export const menuOptions = [
  {
    title: ARRAY,
    options: [
      {
        title: SEARCHING,
        options: [BINARY_SEARCH],
      },
      {
        title: SORTING,
        options: [BUBBLE_SORT, QUICK_SORT],
      },
    ],
  },
  { title: LINKED_LIST, options: [] },
  { title: BINARY_TREE, options: [] },
  { title: GRAPH, options: [] }
];
