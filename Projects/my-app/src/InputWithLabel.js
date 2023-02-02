import * as React from "react";

const InputWithLabel = ({
  id,
  value,
  type = "text",
  onInputChange,
  children,
  isFocused,
}) => {
  const inputRef = React.useRef();

  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <label htmlFor={id} className="label">
        {children}
      </label>
      <input
        ref={inputRef}
        value={value}
        type={type}
        id={id}
        autoFocus={isFocused}
        onChange={onInputChange}
        className="input"
      />
    </>
  );
};

export { InputWithLabel };