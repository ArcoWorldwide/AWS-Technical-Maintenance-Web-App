import { useEffect, useMemo, useState, useRef } from "react";
import {
  FiPlus,
  FiX,
  FiCheck,
  FiSlash,
  FiSearch,
  FiDownload,
  FiUpload,
} from "react-icons/fi";
import CanAccess from "../../components/reusables/CanAccess";
import { PERMISSIONS } from "../../utils/constants/permissions";
import jsPDF from "jspdf";

/* -------------------------- DEMO ROLE -------------------------- */
const CURRENT_ROLE = "ADMIN";

/* -------------------------- AIRCRAFT MASTER -------------------------- */
const aircraftMaster = [
  { name: "MFE Fighter VTOL", serial: "MFE-VTOL-001" },
  { name: "Yangda Sky Whale VTOL", serial: "YSW-VTOL-114" },
  { name: "JOUAV CW25D", serial: "JOUAV-25D-778" },
  { name: "M300", serial: "DJI-M300-8821" },
];

/* -------------------------- SCHEDULED MAINTENANCE REASONS -------------------------- */
const scheduledReasons = [
  "50 Hour Routine Inspection",
  "100 Hour Full Inspection",
  "Battery Health Check",
  "Motor Bearing Inspection",
  "Propeller Replacement Cycle",
  "Firmware Update Validation",
  "IMU Calibration",
  "Compass Calibration",
  "ESC Diagnostics",
  "Payload Mount Inspection",
  "Landing Gear Stress Check",
  "Airframe Structural Assessment",
  "GNSS Signal Integrity Test",
  "Camera Sensor Cleaning",
  "Thermal Sensor Calibration",
  "Waterproof Seal Inspection",
  "Internal Wiring Audit",
  "Cooling System Inspection",
  "Telemetry Verification",
  "Post-Mission Scheduled Inspection",
  "Navigation System Check",
  "Obstacle Sensor Calibration",
  "Rotor Balance Check",
  "Flight Controller Diagnostics",
  "Altitude Sensor Calibration",
  "Payload Sensor Verification",
  "Flight Log Sync",
  "Battery Replacement Cycle",
  "Propulsion System Inspection",
  "Emergency Systems Check",
  "Data Link Integrity Test",
];

/* -------------------------- INITIAL DATA -------------------------- */
const initialData = [
  {
    id: "MT-1001",
    aircraftModel: "Matrice 300",
    serialNumber: "DJI-M300-8821",
    location: "Port Harcourt Hub",
    flightHours: 96,
    maintenanceType: "scheduled",
    reason: "100 Hour Full Inspection",
    approval: "pending",
    workStatus: "pending",
    requestedBy: "ops.team@arcoworldwide.com",
    requestedAt: "2026-02-01",
  },
  {
    id: "MT-1002",
    aircraftModel: "Mavic 3 Pro",
    serialNumber: "DJI-M3P-7755",
    location: "Lagos Base",
    flightHours: 143,
    maintenanceType: "unscheduled",
    reason: "Gimbal vibration detected during flight.",
    approval: "approved",
    workStatus: "in_progress",
    requestedBy: "ops@arcoworldwide.com",
    requestedAt: "2026-02-02",
  },
  {
    id: "MT-1003",
    aircraftModel: "MFE Fighter VTOL",
    serialNumber: "MFE-VTOL-001",
    location: "Abuja Base",
    flightHours: 52,
    maintenanceType: "scheduled",
    reason: "50 Hour Routine Inspection",
    approval: "approved",
    workStatus: "pending",
    requestedBy: "tech@arcoworldwide.com",
    requestedAt: "2026-02-10",
  },
  {
    id: "MT-1004",
    aircraftModel: "Yangda Sky Whale VTOL",
    serialNumber: "YSW-VTOL-114",
    location: "Lagos Base",
    flightHours: 105,
    maintenanceType: "unscheduled",
    reason: "Motor overheating warning.",
    approval: "pending",
    workStatus: "pending",
    requestedBy: "ops@arcoworldwide.com",
    requestedAt: "2026-02-12",
  },
];

/* -------------------------- BADGES -------------------------- */
const approvalBadge = (status) => {
  const map = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };
  return (
    <span className={`px-1 py-[1px] rounded-full text-[8px] ${map[status]} uppercase`}>
      {status}
    </span>
  );
};

const workBadge = (status) => {
  const map = {
    pending: "bg-gray-200 text-gray-700",
    in_progress: "bg-blue-100 text-blue-800",
    done: "bg-green-100 text-green-800",
    declined: "bg-red-100 text-red-800",
  };
  const label = {
    pending: "Pending",
    in_progress: "In-Progress",
    done: "Completed",
    declined: "Declined",
  };
  return (
<span
  className={`px-0.5 py-[1px] rounded-full text-[8px] whitespace-nowrap ${map[status]}`}
>
  {label[status]}
</span>
  );
};

/* -------------------------- MAIN COMPONENT -------------------------- */
export default function MaintenancePage() {
  const [records, setRecords] = useState(initialData);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [prefillData, setPrefillData] = useState(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 6;

useEffect(() => {
  const prefill = localStorage.getItem("prefilledMaintenance");

  if (prefill) {
    const data = JSON.parse(prefill);

    // Store temporarily for modal
    setPrefillData({
      aircraftModel: data.model,
      serialNumber: data.serial,
      location: data.location,
      flightHours: data.flightHours,
      maintenanceType: "",
      reason: "",
    });

    setShowModal(true);

    localStorage.removeItem("prefilledMaintenance");
  }
}, []);

  /* -------------------------- ANALYTICS -------------------------- */
  const analytics = useMemo(() => {
    return {
      pending: records.filter((r) => r.workStatus === "pending").length,
      inProgress: records.filter((r) => r.workStatus === "in_progress").length,
      done: records.filter((r) => r.workStatus === "done").length,
    };
  }, [records]);

  /* -------------------------- FILTERED -------------------------- */
  const filtered = useMemo(() => {
    return records.filter((r) =>
      Object.values(r)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [records, search]);

  /* -------------------------- PAGINATION -------------------------- */
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  /* -------------------------- APPROVAL -------------------------- */
  const handleApproval = (id, decision) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              approval: decision,
              workStatus: decision === "rejected" ? "declined" : "pending",
            }
          : r
      )
    );
  };

  /* -------------------------- WORK STATUS -------------------------- */
  const handleStartWork = (id) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, workStatus: "in_progress" } : r
      )
    );
  };

  const handleMarkDone = (id, report) => {
    if (!report.title || !report.summary || !report.file) {
      alert("Please upload a completion report before marking done.");
      return;
    }
    setRecords((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, workStatus: "done", completionReport: report }
          : r
      )
    );
    setSelected(null);
  };

  return (
    <main className="min-h-screen px-4 py-6 md:pl-[240px]">
      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center max-w-[1600px] mx-auto gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            Aircraft Maintenance
          </h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1 md:mt-0">
            Track requests, approvals & completion workflow
          </p>
        </div>
        <CanAccess permission={PERMISSIONS.REQUEST_MAINTENANCE}>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-[#3C498B] text-white px-3 md:px-4 py-1.5 md:py-2 rounded-md text-xs md:text-sm"
          >
            <FiPlus />
            Request Maintenance
          </button>
        </CanAccess>
      </div>

      {/* ANALYTICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-[1600px] mx-auto mt-4 md:mt-6">
        <AnalyticsCard title="Pending" value={analytics.pending} />
        <AnalyticsCard title="In Progress" value={analytics.inProgress} />
        <AnalyticsCard title="Completed" value={analytics.done} />
      </div>

      {/* SEARCH */}
      <div className="max-w-[1600px] mx-auto mt-4 md:mt-6 bg-white p-3 md:p-4 rounded-xl shadow flex items-center gap-2">
        <FiSearch className="text-gray-400" />
        <input
          placeholder="Search aircraft..."
          className="w-full outline-none text-xs md:text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="max-w-[1600px] mx-auto mt-4 md:mt-6 bg-white rounded-2xl shadow overflow-auto">
        <table className="min-w-full text-xs md:text-sm">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-2 md:px-4 py-2 md:py-3 text-left">#</th>
              <th className="px-2 md:px-4 py-2 md:py-3 text-left">Aircraft</th>
              <th className="px-2 md:px-4 py-2 md:py-3 text-left">Location</th>
              <th className="px-2 md:px-4 py-2 md:py-3 text-left">Hours</th>
              <th className="px-2 md:px-4 py-2 md:py-3 text-left">Type</th>
              <th className="px-2 md:px-4 py-2 md:py-3 text-left">Reason</th>
              <th className="px-2 md:px-4 py-2 md:py-3 text-left">Status</th>
              <th className="px-2 md:px-4 py-2 md:py-3 text-left">Approval</th>
              {CURRENT_ROLE === "ADMIN" && <th className="px-2 md:px-4 py-2 md:py-3">Admin</th>}
              {(CURRENT_ROLE === "ADMIN" || CURRENT_ROLE === "TECHNICAL") && (
                <th className="px-2 md:px-4 py-2 md:py-3">Work</th>
              )}
            </tr>
          </thead>
<tbody>
  {paginated.map((item, index) => (
    <tr
      key={item.id}
      className="border-t hover:bg-gray-50 cursor-pointer"
      onClick={() => setSelected(item)}
    >
      <td className="px-2 md:px-4 py-2 md:py-3 font-medium">{index + 1}</td> {/* Serial Number */}
      <td className="px-2 md:px-4 py-2 md:py-3 font-medium whitespace-nowrap">
        {item.aircraftModel}
        <div className="text-[9px] md:text-xs text-blue-700 whitespace-nowrap">
          {item.serialNumber}
        </div>
      </td>
      <td className="px-2 md:px-4 py-2 md:py-3 whitespace-nowrap">{item.location}</td>
      <td className="px-2 md:px-4 py-2 md:py-3 whitespace-nowrap">{item.flightHours}</td>
      <td className="px-2 md:px-4 py-2 md:py-3 capitalize whitespace-nowrap">{item.maintenanceType}</td>
      <td className="px-2 md:px-4 py-2 md:py-3 whitespace-nowrap">{item.reason.slice(0, 30)}...</td>
      <td className="px-2 md:px-4 py-2 md:py-3 whitespace-nowrap">{workBadge(item.workStatus)}</td>
      <td className="px-2 md:px-4 py-2 md:py-3 whitespace-nowrap">{approvalBadge(item.approval)}</td>
                {CURRENT_ROLE === "ADMIN" && (
                  <td className="px-2 md:px-4 py-2 md:py-3" onClick={(e) => e.stopPropagation()}>
                    {item.approval === "pending" && (
                      <div className="flex gap-1 md:gap-2">
                        <button onClick={() => handleApproval(item.id, "approved")} className="text-green-600 text-[10px]">
                          <FiCheck />
                        </button>
                        <button onClick={() => handleApproval(item.id, "rejected")} className="text-red-600 text-[10px]">
                          <FiSlash />
                        </button>
                      </div>
                    )}
                  </td>
                )}
                {(CURRENT_ROLE === "ADMIN" || CURRENT_ROLE === "TECHNICAL") && (
                  <td className="px-2 md:px-4 py-2 md:py-3" onClick={(e) => e.stopPropagation()}>
                    {item.approval === "approved" && item.workStatus !== "done" && (
                      <div className="flex gap-1 md:gap-2">
{item.workStatus === "pending" && (
  <button
    onClick={() => handleStartWork(item.id)}
className="text-blue-600 text-[10px] font-semibold hover:text-blue-800"  >
    Ongoing
  </button>
)}

{item.workStatus === "in_progress" && (
  <CompletionButton
    item={item}
    onComplete={(report) => handleMarkDone(item.id, report)}
  />
)}
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4 mt-3 md:mt-4 text-xs md:text-sm">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-2 py-1 rounded border disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-2 py-1 rounded border disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {selected && (
        <DetailModal item={selected} onClose={() => setSelected(null)} />
      )}

{showModal && (
  <RequestModal
    prefillData={prefillData}
    onClose={() => {
      setShowModal(false);
      setPrefillData(null);
    }}
    onSubmit={(data) => {
      setRecords([data, ...records]);
      setPrefillData(null);
    }}
  />
)}
    </main>
  );
}

/* -------------------------- ANALYTICS CARD -------------------------- */
function AnalyticsCard({ title, value }) {
  return (
    <div className="bg-white rounded-2xl shadow p-4 md:p-6 flex justify-between items-center md:block">
      <p className="text-xs md:text-sm text-gray-500">{title}</p>
      <h3 className="text-xl md:text-3xl font-bold mt-1 md:mt-2">{value}</h3>
    </div>
  );
}

/* -------------------------- COMPLETION BUTTON -------------------------- */
function CompletionButton({ item, onComplete }) {
  const [open, setOpen] = useState(false);
  const [report, setReport] = useState({ title: "", summary: "", file: null });

  return (
    <>
      <button onClick={() => setOpen(true)} className="text-green-600 text-[10px] font-semibold hover:text-green-800">
        Done
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-xl p-4 md:p-6 w-full max-w-md md:max-w-lg relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-gray-500 text-lg md:text-xl"
            >
              <FiX />
            </button>
            <h3 className="font-bold mb-2 md:mb-3 text-sm md:text-lg">Completion Report</h3>
            <input
              type="text"
              placeholder="Report Title"
              className="w-full border rounded px-2 md:px-3 py-1.5 md:py-2 mb-2 text-xs md:text-sm"
              value={report.title}
              onChange={(e) => setReport({ ...report, title: e.target.value })}
            />
            <textarea
              placeholder="Short Summary"
              className="w-full border rounded px-2 md:px-3 py-1.5 md:py-2 mb-2 text-xs md:text-sm"
              value={report.summary}
              onChange={(e) => setReport({ ...report, summary: e.target.value })}
            />
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setReport({ ...report, file: e.target.files[0] })}
              className="mb-3 text-xs md:text-sm"
            />
            <div className="flex justify-end gap-2 md:gap-3">
              <button onClick={() => setOpen(false)} className="text-xs md:text-sm">Cancel</button>
              <button
                onClick={() => {
                  onComplete(report);
                  setOpen(false);
                }}
                className="bg-[#3C498B] text-white px-3 md:px-4 py-1.5 md:py-2 rounded-xl text-xs md:text-sm"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* -------------------------- DETAIL MODAL -------------------------- */
function DetailModal({ item, onClose }) {
  useEffect(() => {
  document.body.style.overflow = "hidden";

  return () => {
    document.body.style.overflow = "auto";
  };
}, []);
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text(`Maintenance Report - ${item.aircraftModel}`, 10, 10);
    doc.text(`Serial: ${item.serialNumber}`, 10, 20);
    doc.text(`Location: ${item.location}`, 10, 30);
    doc.text(`Flight Hours: ${item.flightHours}`, 10, 40);
    doc.text(`Type: ${item.maintenanceType}`, 10, 50);
    doc.text(`Reason: ${item.reason}`, 10, 60);
    doc.text(`Approval: ${item.approval}`, 10, 70);
    doc.text(`Work Status: ${item.workStatus}`, 10, 80);
    if (item.completionReport) {
      doc.text(`Report Title: ${item.completionReport.title}`, 10, 90);
      doc.text(`Summary: ${item.completionReport.summary}`, 10, 100);
    }
    doc.save(`${item.aircraftModel}_maintenance.pdf`);
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto">
      <div className="w-full min-h-screen p-6 md:p-10 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 text-lg md:text-xl"
        >
          <FiX />
        </button>
        <h2 className="text-xl mt-6 md:text-2xl font-bold mb-3 md:mb-4">
          Maintenance Request Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          <Info label="Request ID" value={item.id} />
          <Info label="Aircraft Model" value={item.aircraftModel} />
          <Info label="Serial Number" value={item.serialNumber} />
          <Info label="Location" value={item.location} />
          <Info label="Flight Hours" value={item.flightHours} />
          <Info label="Category" value={item.maintenanceType} />
          <Info label="Approval" value={item.approval} />
          <Info label="Status" value={item.workStatus} />
          <Info label="Requested By" value={item.requestedBy} />
          <Info label="Requested At" value={item.requestedAt} />
        </div>

        <div className="mt-3 md:mt-4">
          <h4 className="font-semibold mb-1 text-sm md:text-base">Reason</h4>
          <p className="text-gray-600 text-xs md:text-sm">{item.reason}</p>
        </div>

        {item.completionReport && (
          <div className="mt-3 md:mt-4">
            <h4 className="font-semibold mb-1 text-sm md:text-base">Completion Report</h4>
            <p className="text-gray-600 text-xs md:text-sm">
              Title: {item.completionReport.title}
            </p>
            <p className="text-gray-600 text-xs md:text-sm">
              Summary: {item.completionReport.summary}
            </p>
            <p className="text-gray-600 text-xs md:text-sm">
              File: {item.completionReport.file.name}
            </p>
          </div>
        )}

        <button
          onClick={handleExportPDF}
          className="mt-3 md:mt-4 flex items-center gap-2 bg-green-600 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-xl text-xs md:text-sm"
        >
          <FiDownload />
          Export PDF
        </button>
      </div>
    </div>
  );
}

/* -------------------------- REQUEST MODAL -------------------------- */
function RequestModal({ onClose, onSubmit, prefillData }) {  
  const [form, setForm] = useState(
  prefillData || {
    aircraftModel: "",
    serialNumber: "",
    location: "",
    flightHours: "",
    maintenanceType: "",
    reason: "",
  }
);

  const [suggestions, setSuggestions] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
  document.body.style.overflow = "hidden";

  return () => {
    document.body.style.overflow = "auto";
  };
}, []);

  useEffect(() => {
    if (form.aircraftModel) {
      const filtered = aircraftMaster.filter((a) =>
        a.name.toLowerCase().includes(form.aircraftModel.toLowerCase())
      );
      setSuggestions(filtered);
    } else setSuggestions([]);
  }, [form.aircraftModel]);

  const handleSelectAircraft = (aircraft) => {
    setForm({
      ...form,
      aircraftModel: aircraft.name,
      serialNumber: aircraft.serial,
    });
    setSuggestions([]);
  };

  const handleSubmit = () => {
    if (!form.aircraftModel || !form.serialNumber || !form.location)
      return alert("Please fill required fields");
    onSubmit({
      id: `MT-${Date.now()}`,
      ...form,
      approval: "pending",
      workStatus: "pending",
      requestedBy: "user@arcoworldwide.com",
      requestedAt: new Date().toISOString().split("T")[0],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-start pt-10 overflow-auto p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-4 md:p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 text-lg md:text-xl"
        >
          <FiX />
        </button>
        <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">
          Request Maintenance
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {/* Aircraft Model */}
          <div className="relative">
            <label className="text-xs md:text-sm text-gray-500">Aircraft Model</label>
            <input
              className="w-full border rounded px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm"
              value={form.aircraftModel}
              readOnly={!!prefillData}
              onChange={(e) =>
                setForm({ ...form, aircraftModel: e.target.value })
              }
            />
            {suggestions.length > 0 && (
              <div className="absolute bg-white border rounded w-full mt-1 max-h-36 overflow-y-auto z-50">
                {suggestions.map((s, i) => (
                  <div
                    key={i}
                    className="px-2 md:px-3 py-1 hover:bg-gray-100 cursor-pointer text-xs md:text-sm"
                    onClick={() => handleSelectAircraft(s)}
                  >
                    {s.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Serial Number */}
          <div>
            <label className="text-xs md:text-sm text-gray-500">Serial Number</label>
<input
  className="w-full border rounded px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm"
  value={form.serialNumber}
  onChange={(e) => setForm({ ...form, serialNumber: e.target.value })}
/>
          </div>

          <div>
            <label className="text-xs md:text-sm text-gray-500">Location</label>
            <input
              className="w-full border rounded px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm"
              value={form.location}
              onChange={(e) =>
                setForm({ ...form, location: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-xs md:text-sm text-gray-500">Flight Hours</label>
            <input
              type="number"
              className="w-full border rounded px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm"
              value={form.flightHours}
              onChange={(e) =>
                setForm({ ...form, flightHours: e.target.value })
              }
            />
          </div>

          {/* Type */}
          <div className="md:col-span-2 flex gap-4 md:gap-6 mt-2">
            <label className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
              <input
                type="radio"
                name="type"
                onChange={() =>
                  setForm({ ...form, maintenanceType: "scheduled", reason: "" })
                }
              />
              Scheduled
            </label>
            <label className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
              <input
                type="radio"
                name="type"
                onChange={() =>
                  setForm({ ...form, maintenanceType: "unscheduled", reason: "" })
                }
              />
              Unscheduled
            </label>
          </div>

          {/* Reason */}
          {form.maintenanceType === "scheduled" && (
            <div className="md:col-span-2 relative">
              <label className="text-xs md:text-sm text-gray-500">Scheduled Reason</label>
              <div
                className="w-full border rounded px-2 md:px-3 py-1.5 md:py-2 flex justify-between items-center cursor-pointer text-xs md:text-sm"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span>{form.reason || "Select reason"}</span>
                <FiX
                  onClick={(e) => {
                    e.stopPropagation();
                    setForm({ ...form, reason: "" });
                  }}
                  className="text-gray-400"
                />
              </div>
              {dropdownOpen && (
                <div className="absolute top-full left-0 right-0 bg-white border rounded mt-1 max-h-36 overflow-y-auto z-50 text-xs md:text-sm">
                  {scheduledReasons.map((r, i) => (
                    <div
                      key={i}
                      className="px-2 md:px-3 py-1 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setForm({ ...form, reason: r });
                        setDropdownOpen(false);
                      }}
                    >
                      {r}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {form.maintenanceType === "unscheduled" && (
            <div className="md:col-span-2">
              <label className="text-xs md:text-sm text-gray-500">Maintenance Reason</label>
              <textarea
                className="w-full border rounded px-2 md:px-3 py-1.5 md:py-2 min-h-[100px] md:min-h-[120px] text-xs md:text-sm"
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
              />
            </div>
          )}

          <div className="md:col-span-2 flex justify-end mt-12 mb-12 gap-2 md:gap-4  md:mt-4">
            <button onClick={onClose} className="text-xs md:text-sm">Cancel</button>
            <button
              onClick={handleSubmit}
              className="bg-[#3C498B] text-white px-3 md:px-4 py-1.5 md:py-2 rounded-xl text-xs md:text-sm"
            >
              Submit Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------- INFO BOX -------------------------- */
function Info({ label, value }) {
  return (
    <div className="bg-gray-50 p-2 md:p-4 rounded-xl">
      <p className="text-[9px] md:text-xs text-gray-500">{label}</p>
      <p className="font-medium text-xs md:text-sm mt-1">{value}</p>
    </div>
  );
}
