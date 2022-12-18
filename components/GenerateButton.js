import React from "react";

export default function GenerateButton({ callGenerateEndpoint, isGenerating }) {
  return (
    <div className="prompt-buttons">
      <a
        className={isGenerating ? "generate-button loading" : "generate-button"}
        onClick={callGenerateEndpoint}
      >
        <div className="generate">
          {isGenerating ? <span className="loader"></span> : <p>Generate</p>}
        </div>
      </a>
    </div>
  );
}
