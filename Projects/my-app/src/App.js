import * as React from "react";
import axios from "axios";

import { SearchForm } from "./SearchForm";
import { List } from "./List";

import "./App.css";

const extractSearchTerm = (url) => url.replace(API_ENDPOINT, '');

const getLastSearches = (urls) =>
  urls
    .reduce((result, url, index) => {
      const searchTerm = extractSearchTerm(url);

      if (index === 0) {
        return result.concat(searchTerm);
      }

      const previouseSearchTerm = result[result.length - 1];

      if (searchTerm === previouseSearchTerm) {
        return result;
      } else {
        return result.concat(searchTerm);
      }
    }, [])
    .slice(-6)
    .slice(0, -1)
    .map(extractSearchTerm);

const getUrl = (searchTerm) => `${API_ENDPOINT}${searchTerm}`;

const storiesReducer = (state, action) => {
  switch (action.type) {
    case "STORIES_FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case "STORIES_FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case "STORIES_FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case "REMOVE_STORY":
      return {
        ...state,
        data: state.data.filter(
          (story) => action.payload.objectID !== story.objectID
        ),
      };
    default:
      throw new Error();
  }
};

const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";

const useSemiPersistentState = (key, initialState) => {
  const isMounted = React.useRef(false);

  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      console.log("A");
      localStorage.setItem(key, value);
    }
  }, [value, key]);

  return [value, setValue];
};

const getSumComments = (stories) => {
  console.log("C");

  return stories.data.reduce((result, value) => result + value.num_comments, 0);
};

function App() {
  const [searchTerm, setSearchTerm] = useSemiPersistentState(
    "searchTerm",
    "React"
  );

  const [urls, setUrls] = React.useState([getUrl(searchTerm)]);

  const [stories, dispatchStories] = React.useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });

  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFetchStories = React.useCallback(async () => {
    dispatchStories({ type: "STORIES_FETCH_INIT" });

    try {
      const lastUrl = urls[urls.length - 1];
      const result = await axios.get(lastUrl);

      dispatchStories({
        type: "STORIES_FETCH_SUCCESS",
        payload: result.data.hits,
      });
    } catch {
      dispatchStories({ type: "STORIES_FETCH_FAILURE" });
    }
  }, [urls]);

  React.useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleRemoveStory = React.useCallback((item) => {
    dispatchStories({
      type: "REMOVE_STORY",
      payload: item,
    });
  }, []);

  console.log("B:App");

  const sumComments = React.useMemo(() => getSumComments(stories), [stories,]);

  const handleSearchSubmit = (event) => {
    handleSearch(searchTerm);

    event.preventDefault();
  };

  const handleLastSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    handleSearch(searchTerm);
  };

  const handleSearch = (searchTerm) => {
    const url = getUrl(searchTerm);
    setUrls(urls.concat(url));
  };

  const lastSearches = getLastSearches(urls);

  return (
    <div className="container">
      <h1 className="headline-primary">My Hacker Stories with {sumComments} comments.</h1>

      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />

      <LastSearches
        lastSearches={lastSearches}
        onLastSearch={handleLastSearch}
      />

      {stories.isError && <p>Something went wrong ...</p>}

      {stories.isLoading ? (
        <p>Loading...</p>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}
    </div>
  );
}

const LastSearches = ({lastSearches, onLastSearch}) => (
  <>
    {lastSearches.map((searchTerm, index) => (
        <button
          key={searchTerm + index}
          type='button'
          onClick={() => onLastSearch(searchTerm)}  
        >
          {searchTerm}
        </button>
      ))}
  </>
)

export default App;
