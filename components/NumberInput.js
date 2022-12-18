import React from "react";

export default function NumberInput({
  placeholderInput,
  title,
  stateVar,
  userInput,
}) {
  const changeStateVar = (event, changeFunc) => {
    changeFunc(event.target.value);
  };

  return (
    <div className="meal-basic-input">
      <p>{title}: </p>
      <input
        type="number"
        placeholder={placeholderInput}
        value={stateVar}
        onChange={(e) => changeStateVar(e, userInput)}
      />
    </div>
  );
}
