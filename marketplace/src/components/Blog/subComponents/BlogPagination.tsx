import PaginationNextSvg from "@/components/SVG/Pagination/PaginationNextSvg";
import PaginationPrevSvg from "@/components/SVG/Pagination/PaginationPrevSvg";

interface BlogPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function BlogPagination({ currentPage, totalPages, onPageChange }: BlogPaginationProps) {
    return (
        <div className="tp-pagination pt-30">
            <nav>
                <ul className="justify-content-center d-flex gap-2">
                    {/* Previous Button */}
                    <li>
                        <button
                            className={`prev-page-number ${currentPage === 1 ? "disabled" : ""}`}
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <PaginationPrevSvg />
                            {" "} Prev 
                        </button>
                    </li>

                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }, (_, index) => (
                        <li key={index}>
                            <button
                                className={`page-number ${currentPage === index + 1 ? "current" : ""}`}
                                onClick={() => onPageChange(index + 1)}
                            >
                                {index + 1}
                            </button>
                        </li>
                    ))}

                    {/* Next Button */}
                    <li>
                        <button
                            className={`next-page-number ${currentPage === totalPages ? "disabled" : ""}`}
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next {" "}
                            <PaginationNextSvg />
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
