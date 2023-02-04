import * as React from 'react';
import {sortBy} from 'lodash';

import { ReactComponent as Check } from "./check.svg";

const SORTS = {
  NONE: (list) => list,
  TITLE: (list) => sortBy(list, 'title'),
  AUTHOR: (list) => sortBy(list, 'author'),
  COMMENT: (list) => sortBy(list, 'num_comments').reverse(),
  POINT: (list) => sortBy(list, 'points').reverse(),
}

const List = React.memo(
  ({ list, onRemoveItem }) =>
    {
      const [sort, setSort] = React.useState({
        sortKey: 'NONE',
        isReverse: false,
      });

      const handleSort = (sortKey) => {
        const isReverse = sort.sortKey === sortKey && !sort.isReverse;
        setSort({sortKey, isReverse});
      };

      const sortFunction = SORTS[sort.sortKey];
      const sortedList = sort.isReverse 
        ? sortFunction(list).reverse()
        : sortFunction(list);

      return (
        <div>
          <div>
            <span>
              <button
                type="button"
                className="button"
                style={{ width: "40%" }}
                onClick={() => handleSort("TITLE")}
              >
                Title
              </button>
            </span>
            <span>
              <button
                type="button"
                className="button"
                style={{ width: "30%" }}
                onClick={() => handleSort("AUTHOR")}
              >
                Author
              </button>
            </span>
            <span>
              <button
                type="button"
                className="button"
                style={{ width: "10%" }}
                onClick={() => handleSort("COMMENT")}
              >
                Comments
              </button>
            </span>
            <span>
              <button
                type="button"
                className="button"
                style={{ width: "10%" }}
                onClick={() => handleSort("POINT")}
              >
                Points
              </button>
            </span>
            <span style={{ width: "10%" }}>Actions</span>
          </div>

          <ul>
            {sortedList.map((item) => (
              <Item
                key={item.objectID}
                item={item}
                onRemoveItem={onRemoveItem}
              />
            ))}
          </ul>
        </div>
      );
    }
);

const Item = ({ item, onRemoveItem }) => {
  const handleRemoveItem = () => {
    onRemoveItem(item);
  };

  return (
    <li className="item">
      <span style={{ width: "40%" }}>
        <a href={item.url}>{item.title}</a>
      </span>
      <span style={{ width: "30%" }}>{item.author}</span>
      <span style={{ width: "10%" }}>{item.num_comments}</span>
      <span style={{ width: "10%" }}>{item.points}</span>
      <span style={{ width: "10%" }}>
        <button
          type="button"
          onClick={() => handleRemoveItem(item)}
          className="button button_small"
        >
          <Check height="18px" width="18px" />
        </button>
      </span>
    </li>
  );
};

export { List };
