import PaginationNextSvg from "@/components/SVG/Pagination/PaginationNextSvg";
import PaginationPrevSvg from "@/components/SVG/Pagination/PaginationPrevSvg";

interface PropertyPaginationProps {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export default function PropertyPagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}: PropertyPaginationProps) {
  const isControlled = typeof onPageChange === "function" && totalPages >= 1;

  if (!isControlled) {
    return (
      <div className="tp-pagination tp-rent-pagination pt-30">
        <nav>
          <ul className="justify-content-center">
            <li>
              <button className="prev-page-number disabled">
                <PaginationPrevSvg /> Prev
              </button>
            </li>
            <li>
              <button className="disabled">1</button>
            </li>
            <li>
              <button className="current">2</button>
            </li>
            <li>
              <button className="disabled">3</button>
            </li>
            <li>
              <button className="next-page-number disabled">
                Next <PaginationNextSvg />
              </button>
            </li>
          </ul>
        </nav>
      </div>
    );
  }

  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;
  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) pages.push(i);

  return (
    <div className="tp-pagination tp-rent-pagination pt-30">
      <nav>
        <ul className="justify-content-center">
          <li>
            <button
              type="button"
              className={canPrev ? "prev-page-number" : "prev-page-number disabled"}
              disabled={!canPrev}
              onClick={() => canPrev && onPageChange(currentPage - 1)}
            >
              <PaginationPrevSvg /> Prev
            </button>
          </li>
          {pages.map((p) => (
            <li key={p}>
              <button
                type="button"
                className={p === currentPage ? "current" : "disabled"}
                onClick={() => onPageChange(p)}
              >
                {p}
              </button>
            </li>
          ))}
          <li>
            <button
              type="button"
              className={canNext ? "next-page-number" : "next-page-number disabled"}
              disabled={!canNext}
              onClick={() => canNext && onPageChange(currentPage + 1)}
            >
              Next <PaginationNextSvg />
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}