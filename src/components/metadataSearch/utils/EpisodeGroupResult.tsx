import { EpisodeGroupResult as Result } from "@interfaces/EpisodeGroupResult";
import React from "react";

function EpisodeGroupResult({ result }: { result: Result }) {
  return (
    <div className="result-card">
      <div className="result-info">
        <span id="result-title">{result.name} ({result.type})</span>
        <span id="result-duration">{result.group_count}, {result.episode_count}</span>
        <span>{result.description}</span>
      </div>
    </div>
  );
}

export default React.memo(EpisodeGroupResult);