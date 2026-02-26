import { useState, useEffect, useMemo } from "react";
import {
  FiX,
  FiFileText,
  FiUpload,
  FiPlus,
  FiTrash2,
  FiPaperclip,
} from "react-icons/fi";

/* ROLE-BASED ACCESS */
import CanAccess from "../../components/reusables/CanAccess";
import { PERMISSIONS } from "../../utils/constants/permissions";

/* -------------------------------------------------------------------------- */
/*                                DEMO DATA                                    */
/* -------------------------------------------------------------------------- */

const initialReportsData = [
  {
    id: 1,
    title: "Battery Performance Report",
    date: "2026-02-01",
    content:
      "Full report on battery performance, charging cycles, temperature logs, and efficiency metrics...",
    pdfUrl: null,
  },
  {
    id: 2,
    title: "Motor Maintenance Overview",
    date: "2026-01-28",
    content:
      "Complete motor inspection details including RPM analysis, replacement logs, and vibration reports...",
    pdfUrl: null,
  },
  {
    id: 3,
    title: "Flight Data Analysis",
    date: "2026-01-20",
    content:
      "Full flight data with GPS paths, altitude changes, incidents, and pilot notes...",
    pdfUrl: null,
  },
];

/* -------------------------------------------------------------------------- */
/*                                 MAIN PAGE                                   */
/* -------------------------------------------------------------------------- */

export default function ReportsPage() {
  const [reports, setReports] = useState(initialReportsData);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddReport = (newReport) => {
    setReports((prev) => [newReport, ...prev]);
  };

  // Filter reports based on search
  const filteredReports = useMemo(() => {
    if (!searchTerm) return reports;
    const term = searchTerm.toLowerCase();
    return reports.filter(
      (r) =>
        r.title.toLowerCase().includes(term) ||
        r.content.toLowerCase().includes(term)
    );
  }, [reports, searchTerm]);

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 p-4 sm:p-6 md:ml-64">
        {/* HEADER */}
        <div className="bg-white shadow-md rounded-2xl mb-6 p-4 sm:p-6 flex justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-2xl font-semibold text-gray-800 mb-1">
              Maintenance Reports
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 max-w-2xl">
              View uploaded maintenance reports, attach PDFs, and review
              historical maintenance documentation.
            </p>
          </div>

          <CanAccess permission={PERMISSIONS.UPLOAD_REPORT}>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 bg-[#3C498B] text-white px-3 py-2 rounded-lg text-xs sm:text-sm"
            >
              <FiUpload />
              <span className="hidden sm:inline">Upload Report</span>
            </button>
          </CanAccess>
        </div>

        {/* SEARCH BAR */}
        <div className="max-w-4xl mx-auto mb-4">
          <input
            type="text"
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border rounded-xl px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#3C498B]"
          />
        </div>

        {/* REPORT LIST */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              onClick={() => setSelectedReport(report)}
              className="flex justify-between items-center bg-white rounded-xl p-4 shadow hover:shadow-lg cursor-pointer transition"
            >
              <div>
                <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                  {report.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500">
                  {report.date}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {report.pdfUrl && (
                  <span className="flex items-center gap-1 text-xs text-green-600">
                    <FiPaperclip /> PDF
                  </span>
                )}
                <FiFileText className="text-gray-400 text-lg" />
              </div>
            </div>
          ))}

          {filteredReports.length === 0 && (
            <p className="text-center text-gray-400 mt-6">
              No reports match your search.
            </p>
          )}
        </div>

        {selectedReport && (
          <ViewReportModal
            report={selectedReport}
            onClose={() => setSelectedReport(null)}
          />
        )}

        {showUploadModal && (
          <UploadReportModal
            onClose={() => setShowUploadModal(false)}
            onSubmit={handleAddReport}
          />
        )}
      </main>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                             FULL PAGE MODAL WRAPPER                         */
/* -------------------------------------------------------------------------- */

function useLockBodyScroll() {
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);
}

/* -------------------------------------------------------------------------- */
/*                             VIEW REPORT MODAL                               */
/* -------------------------------------------------------------------------- */

function ViewReportModal({ report, onClose }) {
  useLockBodyScroll();

return (
  <div className="fixed inset-0 z-50 bg-white flex flex-col">
    <div className="flex justify-between items-center p-4 bg-white shadow">
      <div>
        <h3 className="text-lg font-semibold">{report.title}</h3>
        <p className="text-xs text-gray-500">{report.date}</p>
      </div>

      <button
        onClick={onClose}
        className="text-gray-600 hover:text-gray-900"
      >
        <FiX size={22} />
      </button>
    </div>

    {report.pdfUrl ? (
      <iframe
        src={`${report.pdfUrl}#toolbar=1`}
        title="PDF Preview"
        className="flex-1 w-full"
        style={{ border: "none" }}
      />
    ) : (
      <div className="p-6 text-gray-500">
        No PDF attached to this report.
      </div>
    )}
  </div>
);
}

/* -------------------------------------------------------------------------- */
/*                            UPLOAD REPORT MODAL                              */
/* -------------------------------------------------------------------------- */

function UploadReportModal({ onClose, onSubmit }) {
  useLockBodyScroll();

  const [form, setForm] = useState({
    title: "",
    date: "",
    content: "",
  });

  const [pdfUrl, setPdfUrl] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (file) => {
    if (!file || file.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("PDF must be less than 10MB.");
      return;
    }

    setError("");
    setPdfUrl(URL.createObjectURL(file));
  };

  const handleSubmit = () => {
    onSubmit({
      id: Date.now(),
      ...form,
      pdfUrl,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
      <div className="max-w-3xl mx-auto p-6 sm:p-10 relative min-h-screen">
        <button
          onClick={onClose}
          className="fixed top-6 right-6 text-gray-600"
        >
          <FiX size={22} />
        </button>

        <h3 className="text-lg sm:text-2xl font-bold mb-6">
          Upload Maintenance Report
        </h3>

        <div className="space-y-6">
          <Input
            label="Report Title"
            value={form.title}
            onChange={(v) => setForm({ ...form, title: v })}
          />

          <Input
            label="Date"
            type="date"
            value={form.date}
            onChange={(v) => setForm({ ...form, date: v })}
          />

          <Textarea
            label="Summary / Notes"
            value={form.content}
            onChange={(v) => setForm({ ...form, content: v })}
          />

          <div>
            <label className="text-xs text-gray-500">
              Attach PDF Report
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => handleFileChange(e.target.files[0])}
              className="w-full text-sm"
            />
            {error && (
              <p className="text-xs text-red-600 mt-1">{error}</p>
            )}
          </div>

          {pdfUrl && (
            <div className="border rounded-xl overflow-hidden h-[350px] relative">
              <iframe
                src={pdfUrl}
                title="PDF Preview"
                className="w-full h-full"
              />
              <button
                onClick={() => setPdfUrl(null)}
                className="absolute top-2 right-2 bg-white p-1 rounded shadow"
              >
                <FiTrash2 />
              </button>
            </div>
          )}

          <div className="flex justify-end gap-4 pt-8">
            <button onClick={onClose} className="text-gray-600 text-sm">
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              className="bg-[#3C498B] text-white px-6 py-2 rounded-lg text-sm flex items-center gap-2"
            >
              <FiPlus />
              Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              SMALL COMPONENTS                               */
/* -------------------------------------------------------------------------- */

function Input({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="text-xs text-gray-500">{label}</label>
      <input
        type={type}
        className="w-full border rounded-lg px-3 py-2 text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function Textarea({ label, value, onChange }) {
  return (
    <div>
      <label className="text-xs text-gray-500">{label}</label>
      <textarea
        className="w-full border rounded-lg px-3 py-2 text-sm min-h-[150px]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}