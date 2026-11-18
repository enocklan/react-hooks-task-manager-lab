
import { useRef, useState } from "react";
import TaskList from "./TaskList";

function SearchBar() {
  const searchInput = useRef(null);
  const [query, setQuery] = useState("");

  function handleSearch() {
    setQuery(searchInput.current.value);
  }

  return (
    <div>
      <input
        ref={searchInput}
        type="text"
        placeholder="Search tasks..."
        onChange={handleSearch}
      />

      <TaskList query={query} />
    </div>
  );
}

export default SearchBar;
