"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { STAR_REPO } from "../lib/repo";
import { useStarAccess } from "./StarAccessProvider";
import styles from "./StarGateModal.module.css";

type Props = {
  open: boolean;
  bookTitle: string;
  onClose: () => void;
  onUnlocked: () => void;
};

export function StarGateModal({
  open,
  bookTitle,
  onClose,
  onUnlocked,
}: Props) {
  const titleId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const { markUnlocked } = useStarAccess();
  const [username, setUsername] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    setError(null);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => inputRef.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open || !mounted) return null;

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/access/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        username?: string;
      };
      if (!res.ok || !data.ok) {
        setError(data.error || "Verification failed.");
        return;
      }
      markUnlocked(data.username || username.trim().replace(/^@/, ""));
      onUnlocked();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return createPortal(
    <div className={styles.backdrop} role="presentation" onClick={onClose}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        <div className={styles.layout}>
          <div className={styles.copy}>
            <p className={styles.kicker}>Unlock reading</p>
            <h2 id={titleId} className={styles.title}>
              Star the repo first
            </h2>
            <p className={styles.body}>
              To open <strong>{bookTitle}</strong>, star{" "}
              <a
                href={STAR_REPO.starUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {STAR_REPO.owner}/{STAR_REPO.name}
              </a>{" "}
              on GitHub, then enter your username so we can confirm you&apos;re
              on the stargazer list.
            </p>
            <ol className={styles.steps}>
              <li>
                <a
                  className={styles.starBtn}
                  href={STAR_REPO.starUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Star on GitHub
                </a>
              </li>
              <li>Come back and verify your username below.</li>
            </ol>
          </div>

          <form className={styles.form} onSubmit={verify}>
            <label className={styles.label} htmlFor="gh-username">
              GitHub username
            </label>
            <input
              ref={inputRef}
              id="gh-username"
              className={styles.input}
              name="username"
              autoComplete="username"
              placeholder="octocat"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={busy}
              required
            />
            {error ? (
              <p className={styles.error} role="alert">
                {error}
              </p>
            ) : null}
            <button type="submit" className={styles.submit} disabled={busy}>
              {busy ? "Checking stargazers…" : "Verify & unlock"}
            </button>
          </form>
        </div>
      </div>
    </div>,
    document.body,
  );
}
