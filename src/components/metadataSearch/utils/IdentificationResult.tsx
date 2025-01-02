import Image from "@components/image/Image";
import { IdentificationResult as Result } from "@interfaces/IdentificationResult";
import React from "react";

function IdentificationResult({ result }: { result: Result }) {
  return (
    <div className="result-card">
      <div className="result-info">
        <span id="result-title">{result.title}</span>
        <span id="result-duration">{result.date}</span>
      </div>

      {result.poster && (
        <Image
          src={result.poster}
          alt="Poster"
          isRelative={false}
          errorSrc="/img/fileNotFound.jpg"
        />
      )}
    </div>
  );
}

export default React.memo(IdentificationResult);
