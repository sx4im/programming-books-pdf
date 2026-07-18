"use client";

import { useEffect, useState } from "react";
import styles from "./BookCard.module.css";

type Props = {
  src: string;
  title: string;
};

export function BookCover({ src, title }: Props) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(
    "loading",
  );

  useEffect(() => {
    setStatus("loading");
  }, [src]);

  if (!src.trim() || status === "error") {
    return (
      <div className={styles.blank} aria-hidden>
        <span className={styles.blankSpine} />
        <span className={styles.blankLabel}>Cover</span>
      </div>
    );
  }

  return (
    <>
      {status === "loading" ? (
        <div className={styles.skeleton} aria-hidden />
      ) : null}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={
          status === "loaded"
            ? `${styles.cover} ${styles.coverVisible}`
            : styles.cover
        }
        src={src}
        alt={`Cover for ${title}`}
        loading="lazy"
        decoding="async"
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("error")}
      />
    </>
  );
}
