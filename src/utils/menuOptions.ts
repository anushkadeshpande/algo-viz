import {
  ARRAY,
  BINARY_SEARCH,
  BINARY_TREE,
  BUBBLE_SORT,
  GRAPH,
  HEAP,
  LINKED_LIST,
  QUICK_SORT,
  SEARCHING,
  SORTING,
  STACK,
  TRIE,
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
  { title: STACK, options: [] },
  { title: LINKED_LIST, options: [] },
  { title: BINARY_TREE, options: [] },
  { title: TRIE, options: [] },
  { title: GRAPH, options: [] },
  { title: HEAP, options: [] }
];
