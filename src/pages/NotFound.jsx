import { Link } from "react-router-dom";
import { usePageMeta } from "../lib/seo";
import { Container } from "../components/Container";

export default function NotFound() {
  usePageMeta({ title: "Page not found | downloadReel" });

  return (
    <section className="flex min-h-[60vh] items-center py-20">
      <Container className="text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
          404
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
          page not found
        </h1>
        <p className="mt-3 text-sm text-muted">
          The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex h-10 items-center rounded-md bg-btn px-5 text-sm font-medium text-btn-fg transition-colors duration-150 hover:bg-btn-hover"
        >
          Back to home
        </Link>
      </Container>
    </section>
  );
}
