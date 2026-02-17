import { useEffect, useMemo, useState } from "react";
import {
  FiPlus,
  FiX,
  FiCheck,
  FiSlash,
  FiSearch,
  FiPlay,
} from "react-icons/fi";

import CanAccess from "../../components/reusables/CanAccess";
import { PERMISSIONS } from "../../utils/constants/permissions";

/* -------------------------------------------------------------------------- */
/*                             DEMO ROLE SWITCHER                             */
/* -------------------------------------------------------------------------- */
/*
Change this to test:
"ADMIN"
"TECHNICAL"
"GENERAL"
*/
const CURRENT_ROLE = "ADMIN";

/* -------------------------------------------------------------------------- */
/*                            AIRCRAFT MASTER LIST                            */
/* -------------------------------------------------------------------------- */

const aircraftMaster = [
  { name: "MFE Fighter VTOL", serial: "MFE-VTOL-001" },
  { name: "Yangda Sky Whale VTOL", serial: "YSW-VTOL-114" },
  { name: "JOUAV CW25D", serial: "JOUAV-25D-778" },
  { name: "M300", serial: "DJI-M300-8821" },
  { name: "M350", serial: "DJI-M350-5532" },
  { name: "M400", serial: "DJI-M400-0091" },
  { name: "M4T", serial: "DJI-M4T-9912" },
  { name: "Mavic 3 Series", serial: "DJI-M3-2211" },
  { name: "Mavic 3 Classic", serial: "DJI-M3C-4455" },
  { name: "Mavic 3 Pro", serial: "DJI-M3P-7755" },
  { name: "Matrice 350", serial: "DJI-M350-6622" },
  { name: "Matrice 300", serial: "DJI-M300-9901" },
];

/* -------------------------------------------------------------------------- */
/*                         SCHEDULED MAINTENANCE REASONS                      */
/* -------------------------------------------------------------------------- */

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
];

/* -------------------------------------------------------------------------- */
/*                              INITIAL REQUESTS                              */
/* -------------------------------------------------------------------------- */

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
];

/* -------------------------------------------------------------------------- */
/*                                  BADGES                                    */
/* -------------------------------------------------------------------------- */

const approvalBadge = (status) => {
  const map = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };
  return (
    <span className={`px-2 py-1 rounded-full text-[10px] ${map[status]}`}>
      {status.toUpperCase()}
    </span>
  );
};

const workBadge = (status) => {
  const map = {
    pending: "bg-gray-100 text-gray-700",
    in_progress: "bg-blue-100 text-blue-800",
    done: "bg-green-100 text-green-800",
    declined: "bg-red-100 text-red-800",
  };
  const label = {
    pending: "Pending",
    in_progress: "In Progress",
    done: "Completed",
    declined: "Declined",
  };
  return (
    <span className={`px-2 py-1 rounded-full text-[10px] ${map[status]}`}>
      {label[status]}
    </span>
  );
};

/* -------------------------------------------------------------------------- */
/*                               MAIN COMPONENT                               */
/* -------------------------------------------------------------------------- */

export default function MaintenancePage() {
  const [records, setRecords] = useState(initialData);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);

  /* ----------------------------- ANALYTICS -------------------------------- */

  const analytics = useMemo(() => {
    return {
      pending: records.filter((r) => r.workStatus === "pending").length,
      inProgress: records.filter((r) => r.workStatus === "in_progress").length,
      done: records.filter((r) => r.workStatus === "done").length,
    };
  }, [records]);

  /* ------------------------------ FILTER ---------------------------------- */

  const filtered = useMemo(() => {
    return records.filter((r) =>
      Object.values(r).join(" ").toLowerCase().includes(search.toLowerCase())
    );
  }, [records, search]);

  /* -------------------------- ADMIN APPROVAL ------------------------------ */

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

  /* -------------------------- TECH WORK STATUS ---------------------------- */

  const handleMarkDone = (id) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, workStatus: "done" } : r
      )
    );
  };

  const handleStartWork = (id) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, workStatus: "in_progress" } : r
      )
    );
  };

  return (
    <main className="min-h-screen px-4 py-6 md:pl-[240px]">
      {/* ---------------------------- HEADER -------------------------------- */}

      <div className="bg-white rounded-2xl shadow p-6 flex justify-between items-center max-w-[1600px] mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Aircraft Maintenance
          </h1>
          <p className="text-sm text-gray-500">
            Track requests, approvals & completion workflow
          </p>
        </div>

        <CanAccess permission={PERMISSIONS.REQUEST_MAINTENANCE}>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-[#3C498B] text-white px-4 py-2 rounded-xl text-sm"
          >
            <FiPlus />
            Request Maintenance
          </button>
        </CanAccess>
      </div>

      {/* ---------------------------- ANALYTICS ------------------------------ */}

      <div className="grid md:grid-cols-3 gap-4 max-w-[1600px] mx-auto mt-6">
        <AnalyticsCard title="Total Pending" value={analytics.pending} />
        <AnalyticsCard title="In Progress" value={analytics.inProgress} />
        <AnalyticsCard title="Completed" value={analytics.done} />
      </div>

      {/* ---------------------------- SEARCH -------------------------------- */}

      <div className="max-w-[1600px] mx-auto mt-6 bg-white p-4 rounded-xl shadow flex items-center gap-2">
        <FiSearch />
        <input
          placeholder="Search aircraft..."
          className="w-full outline-none text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ---------------------------- TABLE --------------------------------- */}

      <div className="max-w-[1600px] mx-auto mt-6 bg-white rounded-2xl shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Aircraft</th>
              <th className="px-4 py-3 text-left">Location</th>
              <th className="px-4 py-3 text-left">Hours</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Reason</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Approval</th>

              {CURRENT_ROLE === "ADMIN" && (
                <th className="px-4 py-3 text-left">Admin</th>
              )}

              {(CURRENT_ROLE === "ADMIN" ||
                CURRENT_ROLE === "TECHNICAL") && (
                <th className="px-4 py-3 text-left">Work</th>
              )}
            </tr>
          </thead>

          <tbody>
            {filtered.map((item) => (
              <tr
                key={item.id}
                className="border-t hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelected(item)}
              >
                <td className="px-4 py-3 font-medium">
                  {item.aircraftModel}
                  <div className="text-xs text-gray-500">
                    {item.serialNumber}
                  </div>
                </td>
                <td className="px-4 py-3">{item.location}</td>
                <td className="px-4 py-3">{item.flightHours}</td>
                <td className="px-4 py-3 capitalize">
                  {item.maintenanceType}
                </td>
                <td className="px-4 py-3">
                  {item.reason.slice(0, 30)}...
                </td>
                <td className="px-4 py-3">
                  {workBadge(item.workStatus)}
                </td>
                <td className="px-4 py-3">
                  {approvalBadge(item.approval)}
                </td>

                {/* ---------------- ADMIN COLUMN ---------------- */}

                {CURRENT_ROLE === "ADMIN" && (
                  <td
                    className="px-4 py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {item.approval === "pending" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleApproval(item.id, "approved")
                          }
                          className="text-green-600"
                        >
                          <FiCheck />
                        </button>
                        <button
                          onClick={() =>
                            handleApproval(item.id, "rejected")
                          }
                          className="text-red-600"
                        >
                          <FiSlash />
                        </button>
                      </div>
                    )}
                  </td>
                )}

                {/* ---------------- WORK COLUMN ---------------- */}

                {(CURRENT_ROLE === "ADMIN" ||
                  CURRENT_ROLE === "TECHNICAL") && (
                  <td
                    className="px-4 py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {item.approval === "approved" &&
                      item.workStatus !== "done" && (
                        <div className="flex gap-2">
                          {item.workStatus === "pending" && (
                            <button
                              onClick={() =>
                                handleStartWork(item.id)
                              }
                              className="text-blue-600"
                            >
                              <FiPlay />
                            </button>
                          )}
                          <button
                            onClick={() =>
                              handleMarkDone(item.id)
                            }
                            className="text-green-600 text-xs"
                          >
                            Mark Done
                          </button>
                        </div>
                      )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <DetailModal
          item={selected}
          onClose={() => setSelected(null)}
        />
      )}

      {showModal && (
        <RequestModal
          onClose={() => setShowModal(false)}
          onSubmit={(data) =>
            setRecords((prev) => [data, ...prev])
          }
        />
      )}
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/*                              ANALYTICS CARD                                */
/* -------------------------------------------------------------------------- */

function AnalyticsCard({ title, value }) {
  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-3xl font-bold mt-2">{value}</h3>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                DETAIL MODAL                                */
/* -------------------------------------------------------------------------- */

function DetailModal({ item, onClose }) {
  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto p-6">
      <button
        onClick={onClose}
        className="flex items-center gap-2 mb-6"
      >
        <FiX /> Close
      </button>

      <h2 className="text-2xl font-bold mb-6">
        Maintenance Request Details
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
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

      <div className="mt-6">
        <h4 className="font-semibold mb-2">Reason</h4>
        <p className="text-gray-600">{item.reason}</p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               REQUEST MODAL                                */
/* -------------------------------------------------------------------------- */

function RequestModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    aircraftModel: "",
    serialNumber: "",
    location: "",
    flightHours: "",
    maintenanceType: "",
    reason: "",
  });

  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (form.aircraftModel) {
      const filtered = aircraftMaster.filter((a) =>
        a.name.toLowerCase().includes(form.aircraftModel.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
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
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto p-6">
      <button
        onClick={onClose}
        className="flex items-center gap-2 mb-6"
      >
        <FiX /> Close
      </button>

      <h2 className="text-2xl font-bold mb-6">
        Request Maintenance
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="relative">
          <label className="text-sm text-gray-500">
            Aircraft Model
          </label>
          <input
            className="w-full border rounded px-3 py-2"
            value={form.aircraftModel}
            onChange={(e) =>
              setForm({ ...form, aircraftModel: e.target.value })
            }
          />
          {suggestions.length > 0 && (
            <div className="absolute bg-white border rounded w-full mt-1 max-h-40 overflow-y-auto z-50">
              {suggestions.map((s, i) => (
                <div
                  key={i}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => handleSelectAircraft(s)}
                >
                  {s.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="text-sm text-gray-500">
            Serial Number
          </label>
          <input
            className="w-full border rounded px-3 py-2"
            value={form.serialNumber}
            readOnly
          />
        </div>

        <div>
          <label className="text-sm text-gray-500">
            Location
          </label>
          <input
            className="w-full border rounded px-3 py-2"
            value={form.location}
            onChange={(e) =>
              setForm({ ...form, location: e.target.value })
            }
          />
        </div>

        <div>
          <label className="text-sm text-gray-500">
            Flight Hours
          </label>
          <input
            type="number"
            className="w-full border rounded px-3 py-2"
            value={form.flightHours}
            onChange={(e) =>
              setForm({ ...form, flightHours: e.target.value })
            }
          />
        </div>

        {/* ---------------- TYPE CHECKBOX ---------------- */}

        <div className="md:col-span-2 flex gap-6 mt-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="type"
              onChange={() =>
                setForm({
                  ...form,
                  maintenanceType: "scheduled",
                  reason: "",
                })
              }
            />
            Scheduled
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="type"
              onChange={() =>
                setForm({
                  ...form,
                  maintenanceType: "unscheduled",
                  reason: "",
                })
              }
            />
            Unscheduled
          </label>
        </div>

        {/* ---------------- REASON LOGIC ---------------- */}

        {form.maintenanceType === "scheduled" && (
          <div className="md:col-span-2">
            <label className="text-sm text-gray-500">
              Scheduled Reason
            </label>
            <select
              className="w-full border rounded px-3 py-2"
              value={form.reason}
              onChange={(e) =>
                setForm({ ...form, reason: e.target.value })
              }
            >
              <option value="">Select reason</option>
              {scheduledReasons.map((r, i) => (
                <option key={i}>{r}</option>
              ))}
            </select>
          </div>
        )}

        {form.maintenanceType === "unscheduled" && (
          <div className="md:col-span-2">
            <label className="text-sm text-gray-500">
              Maintenance Reason
            </label>
            <textarea
              className="w-full border rounded px-3 py-2 min-h-[120px]"
              value={form.reason}
              onChange={(e) =>
                setForm({ ...form, reason: e.target.value })
              }
            />
          </div>
        )}

        <div className="md:col-span-2 flex justify-end gap-4 mt-4">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={handleSubmit}
            className="bg-[#3C498B] text-white px-4 py-2 rounded-xl"
          >
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   INFO                                     */
/* -------------------------------------------------------------------------- */

function Info({ label, value }) {
  return (
    <div className="bg-gray-50 p-4 rounded-xl">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium mt-1">{value}</p>
    </div>
  );
}
