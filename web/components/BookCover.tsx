"use client";

import { useEffect, useState } from "react";
import styles from "./BookCard.module.css";

type Props = {
  src: string;
  title: string;
};

export function BookCover({ src, title }: Props) {
  const isLocalAsset = src.startsWith("/");
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(
    isLocalAsset ? "loaded" : "loading",
  );
  const [wide, setWide] = useState(false);

  useEffect(() => {
    setStatus(src.startsWith("/") ? "loaded" : "loading");
    setWide(false);
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
        className={[
          styles.cover,
          status === "loaded" ? styles.coverVisible : "",
          wide ? styles.coverContain : "",
        ].join(" ")}
        src={src}
        alt={`Cover for ${title}`}
        loading="lazy"
        decoding="async"
        onLoad={(e) => {
          const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
          // Square or landscape art would lose its title under object-fit: cover.
          setWide(h > 0 && w / h > 0.9);
          setStatus("loaded");
        }}
        onError={() => setStatus("error")}
      />
    </>
  );
}
