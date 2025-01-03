import Image from "@components/image/Image";
import { IdentificationResult as Result } from "@interfaces/IdentificationResult";
import React from "react";
import "./Results.scss";

function IdentificationResult({ result }: { result: Result }) {
  return (
    <div className="result-card">
      <div className="result-info">
        <span id="title">{result.title}</span>
        <span id="date">{result.date}</span>
        <span id="description">{result.overview}</span>
      </div>

      {result.poster && (
        <Image
          src={`https://image.tmdb.org/t/p/original${result.poster}`}
          alt="Poster"
          isRelative={false}
          errorSrc="/img/fileNotFound.jpg"
        />
      )}
    </div>
  );
}

export default React.memo(IdentificationResult);
