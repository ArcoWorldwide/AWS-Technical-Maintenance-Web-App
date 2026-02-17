import { useState } from "react";
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

  const handleAddReport = (newReport) => {
    setReports((prev) => [newReport, ...prev]);
  };

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

        {/* REPORT LIST */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {reports.map((report) => (
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
        </div>

        {/* VIEW REPORT MODAL */}
        {selectedReport && (
          <ViewReportModal
            report={selectedReport}
            onClose={() => setSelectedReport(null)}
          />
        )}

        {/* UPLOAD MODAL */}
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
/*                             VIEW REPORT MODAL                                */
/* -------------------------------------------------------------------------- */

function ViewReportModal({ report, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 p-4 flex items-center justify-center">
      <div className="bg-white rounded-2xl max-w-4xl w-full p-4 sm:p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        >
          <FiX />
        </button>

        <h3 className="text-lg sm:text-2xl font-bold mb-1">
          {report.title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 mb-4">
          {report.date}
        </p>

        <p className="text-sm sm:text-base text-gray-700 mb-6">
          {report.content}
        </p>

        {/* PDF PREVIEW */}
        {report.pdfUrl ? (
          <div className="border rounded-xl overflow-hidden h-[400px]">
            <iframe
              src={report.pdfUrl}
              title="PDF Preview"
              className="w-full h-full"
            />
          </div>
        ) : (
          <p className="text-sm text-gray-400 italic">
            No PDF attached to this report.
          </p>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                            UPLOAD REPORT MODAL                               */
/* -------------------------------------------------------------------------- */

function UploadReportModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    title: "",
    date: "",
    content: "",
  });
  const [pdfFile, setPdfFile] = useState(null);
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
    setPdfFile(file);
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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 p-4 flex items-center justify-center">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-4 sm:p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600"
        >
          <FiX />
        </button>

        <h3 className="text-lg sm:text-xl font-bold mb-4">
          Upload Maintenance Report
        </h3>

        <div className="space-y-4">
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

          {/* PDF UPLOAD */}
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

          {/* PDF PREVIEW */}
          {pdfUrl && (
            <div className="border rounded-xl overflow-hidden h-[250px] relative">
              <iframe
                src={pdfUrl}
                title="PDF Preview"
                className="w-full h-full"
              />
              <button
                onClick={() => {
                  setPdfFile(null);
                  setPdfUrl(null);
                }}
                className="absolute top-2 right-2 bg-white p-1 rounded shadow"
              >
                <FiTrash2 />
              </button>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={onClose}
              className="text-sm text-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="bg-[#3C498B] text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
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
        className="w-full border rounded-lg px-3 py-2 text-sm min-h-[120px]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
