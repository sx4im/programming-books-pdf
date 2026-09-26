import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p>
          Ultimate Programming Books — curated index. Suggest titles via GitHub
          issues; maintainers attach Drive links.
        </p>
        <a
          href="https://github.com/sx4im/programming-books-pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          View on GitHub
        </a>
      </div>
    </footer>
  );
}
