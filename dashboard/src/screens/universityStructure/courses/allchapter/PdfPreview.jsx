import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { FaFilePdf } from "react-icons/fa";
import { HiOutlineArrowLeft, HiOutlineArrowRight } from "react-icons/hi2";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();

export const PdfPreview = ({ fileUrl, fileName }) => {
  const [totalPages, setTotalPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isFailed, setIsFailed] = useState(false);

  const pdfFile = useMemo(() => {
    if (!fileUrl) return null;

    return {
      url: fileUrl,
      withCredentials: false,
    };
  }, [fileUrl]);

  const handleLoadSuccess = ({ numPages }) => {
    setTotalPages(numPages);
    setPageNumber(1);
    setIsFailed(false);
  };

  const handleLoadError = (error) => {
    console.error("PDF load failed:", error);
    setIsFailed(true);
  };

  const goPrev = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const goNext = () => {
    setPageNumber((prev) => Math.min(prev + 1, totalPages || 1));
  };

  return (
    <section className="overflow-hidden rounded-[26px] border border-gray-200/70 bg-gray-50/45 p-3 shadow-[0_16px_38px_rgba(15,23,42,0.05)] dark:border-white/[0.05] dark:bg-white/[0.016] dark:shadow-[0_18px_42px_rgba(0,0,0,0.18)] sm:p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3 px-2 pt-1">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl border border-rose-300/20 bg-rose-500/[0.07] text-rose-600 dark:border-rose-300/[0.08] dark:bg-rose-300/[0.04] dark:text-rose-200/70">
            <FaFilePdf size={16} />
          </span>

          <div>
            <p className="text-[8px] font-semibold uppercase tracking-[0.13em] text-rose-600 dark:text-rose-200/55">Course resource</p>
            <p className="mt-0.5 text-[10px] font-semibold text-gray-700 dark:text-white/55">{fileName}</p>
          </div>
        </div>

        {totalPages > 0 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goPrev}
              disabled={pageNumber === 1}
              className="inline-flex h-9 items-center gap-2 rounded-xl border border-gray-200/80 bg-white/65 px-3 text-[9px] font-semibold text-gray-600 transition-all disabled:cursor-not-allowed disabled:opacity-35 dark:border-white/[0.06] dark:bg-white/[0.022] dark:text-white/45"
            >
              <HiOutlineArrowLeft size={13} />
              Prev
            </button>

            <span className="rounded-xl border border-gray-200/75 bg-white/55 px-3 py-2 text-[9px] font-semibold text-gray-500 dark:border-white/[0.055] dark:bg-white/[0.018] dark:text-white/40">
              {pageNumber}/{totalPages}
            </span>

            <button
              type="button"
              onClick={goNext}
              disabled={pageNumber === totalPages}
              className="inline-flex h-9 items-center gap-2 rounded-xl border border-cyan-300/25 bg-cyan-500/[0.07] px-3 text-[9px] font-semibold text-cyan-700 transition-all disabled:cursor-not-allowed disabled:opacity-35 dark:border-cyan-300/[0.09] dark:bg-cyan-300/[0.04] dark:text-cyan-200/70"
            >
              Next
              <HiOutlineArrowRight size={13} />
            </button>
          </div>
        )}
      </div>

      <div className="min-h-[78vh] overflow-auto rounded-[20px] border border-gray-200/70 bg-white p-4 dark:border-white/[0.06]">
        {!fileUrl || isFailed ? (
          <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
            <FaFilePdf size={34} className="text-red-500" />

            <h3 className="mt-4 text-sm font-semibold text-gray-800">PDF preview is not available</h3>

            <p className="mt-2 max-w-md text-xs leading-5 text-gray-500">The PDF file host blocked preview or the file URL is not reachable.</p>

            {fileUrl && (
              <a href={fileUrl} target="_blank" rel="noreferrer" className="mt-5 rounded-xl bg-red-500 px-5 py-2 text-xs font-semibold text-white">
                Open PDF
              </a>
            )}
          </div>
        ) : (
          <div className="flex justify-center">
            <Document file={pdfFile} onLoadSuccess={handleLoadSuccess} onLoadError={handleLoadError} loading={<div className="py-20 text-sm text-gray-500">Loading PDF...</div>}>
              <Page pageNumber={pageNumber} width={920} renderAnnotationLayer renderTextLayer />
            </Document>
          </div>
        )}
      </div>
    </section>
  );
};

PdfPreview.propTypes = {
  fileUrl: PropTypes.string,
  fileName: PropTypes.string,
};

PdfPreview.defaultProps = {
  fileUrl: "",
  fileName: "Course PDF",
};
