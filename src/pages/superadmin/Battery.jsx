// ============================================================================
// FULL BATTERY PAGE — ENTERPRISE VERSION
// ROLE BASED + VALIDATION + AUDIT TRAIL + AUTO HEALTH + CRITICAL BADGES
// ============================================================================

import { useEffect, useMemo, useState } from "react";
import {
  FiPlus,
  FiSearch,
  FiX,
  FiAlertTriangle,
  FiUser,

} from "react-icons/fi";

import CanAccess from "../../components/reusables/CanAccess";
import { PERMISSIONS } from "../../utils/constants/permissions";

/* ============================================================================
   CONFIGURATION
============================================================================ */

const CRITICAL_CYCLE_THRESHOLD = 300;

/* ============================================================================
   HEALTH AUTO DEGRADATION LOGIC
============================================================================ */

function calculateHealth(cycles) {
  if (cycles >= 400) return "Expired";
  if (cycles >= 300) return "Critical";
  if (cycles >= 200) return "Weak";
  if (cycles >= 100) return "Good";
  return "Excellent";
}

/* ============================================================================
   INITIAL DEMO DATA (2 PER TAB)
============================================================================ */

const initialBatteries = [
  /* ====================== IN USE ====================== */
  {
    id: "BAT-001",
    tag: "BAT-001",
    type: "LiPo 6S 10000mAh",
    chemistry: "Lithium Polymer",
    capacity: "10000mAh",
    voltage: "22.2V",
    cycles: 120,
    health: calculateHealth(120),
    purchaseDate: "2024-01-12",
    manufacturer: "DJI",
    supplier: "DroneTech Africa",
    warrantyExpiry: "2026-01-12",
    status: "IN_USE",
    aircraftNumber: "AC-045",
    aircraft: "Matrice 300 RTK",
    callSign: "CAA",
    assignedDate: "2024-11-12",
    assignedBy: "Admin User",
    decommissionedDate: null,
    lastInspection: "2025-01-10",
    storageLocation: null,
    auditTrail: [
      { action: "PURCHASED", by: "Admin User", date: "2024-01-12" },
      { action: "ASSIGNED", by: "Admin User", date: "2024-11-12" },
    ],
  },
  {
    id: "BAT-002",
    tag: "BAT-002",
    type: "Li-Ion 4S 8000mAh",
    chemistry: "Lithium Ion",
    capacity: "8000mAh",
    voltage: "14.8V",
    cycles: 280,
    health: calculateHealth(280),
    purchaseDate: "2023-06-18",
    manufacturer: "Tattu",
    supplier: "Main Supplier",
    warrantyExpiry: "2026-06-18",
    status: "IN_USE",
    aircraftNumber: "AC-102",
    aircraft: "Mavic 3 Pro",
    callSign: "NCAA",
    assignedDate: "2025-01-02",
    assignedBy: "Tech Officer",
    decommissionedDate: null,
    lastInspection: "2025-02-01",
    storageLocation: null,
    auditTrail: [
      { action: "ASSIGNED", by: "Tech Officer", date: "2025-01-02" },
    ],
  },

  /* ====================== IN STORE ====================== */
  {
    id: "BAT-003",
    tag: "BAT-003",
    type: "LiPo 6S 12000mAh",
    chemistry: "Lithium Polymer",
    capacity: "12000mAh",
    voltage: "22.2V",
    cycles: 10,
    health: calculateHealth(10),
    purchaseDate: "2025-01-10",
    manufacturer: "DJI",
    supplier: "DroneTech Africa",
    warrantyExpiry: "2027-01-10",
    status: "IN_STORE",
    aircraftNumber: null,
    aircraft: null,
    callSign: null,
    assignedDate: null,
    assignedBy: null,
    decommissionedDate: null,
    lastInspection: "2025-02-10",
    storageLocation: "Main Store Rack A1",
    auditTrail: [
      { action: "PURCHASED", by: "System Admin", date: "2025-01-10" },
    ],
  },
  {
    id: "BAT-004",
    tag: "BAT-004",
    type: "Li-Ion 4S 6000mAh",
    chemistry: "Lithium Ion",
    capacity: "6000mAh",
    voltage: "14.8V",
    cycles: 0,
    health: calculateHealth(0),
    purchaseDate: "2025-02-05",
    manufacturer: "Tattu",
    supplier: "Main Supplier",
    warrantyExpiry: "2028-02-05",
    status: "IN_STORE",
    aircraftNumber: null,
    aircraft: null,
    callSign: null,
    assignedDate: null,
    assignedBy: null,
    decommissionedDate: null,
    lastInspection: "2025-02-12",
    storageLocation: "Main Store Rack B3",
    auditTrail: [
      { action: "PURCHASED", by: "System Admin", date: "2025-02-05" },
    ],
  },

  /* ====================== DECOMMISSIONED ====================== */
  {
    id: "BAT-005",
    tag: "BAT-005",
    type: "LiPo 6S 10000mAh",
    chemistry: "Lithium Polymer",
    capacity: "10000mAh",
    voltage: "22.2V",
    cycles: 380,
    health: calculateHealth(380),
    purchaseDate: "2022-03-10",
    manufacturer: "DJI",
    supplier: "SkySupply Ltd",
    warrantyExpiry: "2024-03-10",
    status: "DECOMMISSIONED",
    aircraftNumber: "AC-021",
    aircraft: "WingtraOne Gen II",
    callSign: "CAA",
    assignedDate: "2023-08-19",
    assignedBy: "Admin",
    decommissionedDate: "2025-01-28",
    lastInspection: "2024-12-30",
    storageLocation: null,
    auditTrail: [
      { action: "ASSIGNED", by: "Admin", date: "2023-08-19" },
      { action: "DECOMMISSIONED", by: "Admin", date: "2025-01-28" },
    ],
  },
  {
    id: "BAT-006",
    tag: "BAT-006",
    type: "Li-Ion 4S 5000mAh",
    chemistry: "Lithium Ion",
    capacity: "5000mAh",
    voltage: "14.8V",
    cycles: 420,
    health: calculateHealth(420),
    purchaseDate: "2021-09-01",
    manufacturer: "Tattu",
    supplier: "Legacy Supplier",
    warrantyExpiry: "2023-09-01",
    status: "DECOMMISSIONED",
    aircraftNumber: "AC-009",
    aircraft: "Matrice 350 RTK",
    callSign: "NCAA",
    assignedDate: "2022-02-10",
    assignedBy: "Tech",
    decommissionedDate: "2025-02-02",
    lastInspection: "2024-11-01",
    storageLocation: null,
    auditTrail: [
      { action: "ASSIGNED", by: "Tech", date: "2022-02-10" },
      { action: "DECOMMISSIONED", by: "Admin", date: "2025-02-02" },
    ],
  },
];

/* ============================================================================
   MAIN COMPONENT
============================================================================ */

export default function BatteryPage() {
  const [batteries, setBatteries] = useState(initialBatteries);
  const [tab, setTab] = useState("IN_USE");
  const [search, setSearch] = useState("");
  const [selectedBattery, setSelectedBattery] = useState(null);
  const [assigningBattery, setAssigningBattery] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const currentUser = "System Admin";

  useEffect(() => {
    if (selectedBattery || showAssignModal || showPurchaseModal) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [selectedBattery, showAssignModal, showPurchaseModal]);

  const filtered = useMemo(() => {
    return batteries.filter((b) => {
      const matches =
        b.tag.toLowerCase().includes(search.toLowerCase()) ||
        (b.aircraftNumber || "")
          .toLowerCase()
          .includes(search.toLowerCase());
      return matches && b.status === tab;
    });
  }, [batteries, search, tab]);

  /* ======================== ASSIGN ======================== */

  const handleAssign = (formData) => {
    setBatteries((prev) =>
      prev.map((b) => {
        if (b.id !== assigningBattery.id) return b;

        return {
          ...b,
          status: "IN_USE",
          aircraftNumber: formData.aircraftNumber,
          aircraft: formData.aircraft,
          callSign: formData.callSign,
          assignedDate: formData.assignedDate,
          assignedBy: currentUser,
          storageLocation: null,
          auditTrail: [
            ...b.auditTrail,
            {
              action: "ASSIGNED",
              by: currentUser,
              date: new Date().toISOString().slice(0, 10),
            },
          ],
        };
      })
    );

    setShowAssignModal(false);
    setSelectedBattery(null);
    setTab("IN_USE");
  };

  /* ======================== DECOMMISSION ======================== */

  const handleDecommission = (id) => {
    setBatteries((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;

        return {
          ...b,
          status: "DECOMMISSIONED",
          decommissionedDate: new Date()
            .toISOString()
            .slice(0, 10),
          auditTrail: [
            ...b.auditTrail,
            {
              action: "DECOMMISSIONED",
              by: currentUser,
              date: new Date()
                .toISOString()
                .slice(0, 10),
            },
          ],
        };
      })
    );

    setSelectedBattery(null);
    setTab("DECOMMISSIONED");
  };

  /* ======================== PURCHASE ======================== */

  const handlePurchase = (formData) => {
    const newBattery = {
      ...formData,
      id: formData.tag,
      cycles: 0,
      health: calculateHealth(0),
      status: "IN_STORE",
      aircraftNumber: null,
      aircraft: null,
      callSign: null,
      assignedDate: null,
      assignedBy: null,
      decommissionedDate: null,
      auditTrail: [
        {
          action: "PURCHASED",
          by: currentUser,
          date: new Date().toISOString().slice(0, 10),
        },
      ],
    };

    setBatteries((prev) => [...prev, newBattery]);
    setShowPurchaseModal(false);
    setTab("IN_STORE");
  };

  /* ============================================================================
     RENDER
  ============================================================================ */

  return (
    <main className="min-h-screen px-4 sm:px-6 py-6 md:pl-[240px]">

{/* HEADER */}
<div className="max-w-[1600px] mx-auto bg-white rounded-2xl shadow 
                px-4 py-4 sm:p-6 
                flex justify-between items-center">

  {/* Responsive Header Text */}
  <h1 className="text-base sm:text-xl font-semibold sm:font-bold">
    Battery Lifecycle Management
  </h1>

  {tab === "IN_STORE" && (
    <CanAccess permission={PERMISSIONS.EDIT_FLEET}>
      
      {/* Desktop Button */}
      <button
        onClick={() => setShowPurchaseModal(true)}
        className="hidden sm:flex items-center gap-2 
                   bg-[#3C498B] text-white 
                   px-4 py-2 rounded-xl text-sm 
                   hover:opacity-90 transition"
      >
        <FiPlus />
        Add Purchased Battery
      </button>

      {/* Mobile Icon Button */}
      <button
        onClick={() => setShowPurchaseModal(true)}
        className="sm:hidden flex items-center justify-center
                   bg-[#3C498B] text-white 
                   p-1 rounded-sm 
                   hover:opacity-90 transition"
        aria-label="Add Purchased Battery"
      >
        <FiPlus size={18} />
      </button>

    </CanAccess>
  )}
</div>


{/* SEARCH */}
<div className="max-w-[1600px] mx-auto mt-4 
                bg-white rounded-xl shadow 
                px-3 sm:px-4 
                py-2 sm:py-3 
                flex items-center gap-2 sm:gap-3">

  <FiSearch className="text-sm sm:text-base" />

  <input
    placeholder="Search by tag or aircraft number..."
    className="w-full outline-none 
               text-xs sm:text-sm"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
</div>


      {/* TABS */}
      <div className="max-w-[1600px] mx-auto mt-4 flex gap-2 flex-wrap">
        {["IN_STORE", "IN_USE",  "DECOMMISSIONED"].map(
          (t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-md text-xs ${
                tab === t
                  ? "bg-[#3C498B] text-white"
                  : "bg-white shadow"
              }`}
            >
              {t.replace("_", " ")}
            </button>
          )
        )}
      </div>

      {/* GRID */}
      <div className="max-w-[1600px] mx-auto mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((battery) => (
          <div
            key={battery.id}
            onClick={() => setSelectedBattery(battery)}
            className="bg-white rounded-2xl p-5 shadow cursor-pointer relative"
          >
            {battery.cycles >=
              CRITICAL_CYCLE_THRESHOLD && (
              <div className="absolute top-3 right-3 text-[10px] bg-red-100 text-red-600 px-2 py-1 rounded-full flex items-center gap-1">
                <FiAlertTriangle size={10} />
                Critical Cycles
              </div>
            )}

            <h3 className="font-semibold">
              {battery.tag}
            </h3>

            <p className="text-xs text-gray-500">
              {battery.type}
            </p>

            <div className="mt-3 text-xs space-y-1">
              <p>Cycles: {battery.cycles}</p>
              <p>Health: {battery.health}</p>

              {battery.status === "IN_USE" && (
                <p>
                  Aircraft No: {battery.aircraftNumber}
                </p>
              )}

              {battery.status === "IN_STORE" && (
                <p>
                  Storage: {battery.storageLocation}
                </p>
              )}

              {battery.status ===
                "DECOMMISSIONED" && (
                <p>
                  Decommissioned:{" "}
                  {battery.decommissionedDate}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedBattery && (
        <BatteryDetailModal
          battery={selectedBattery}
          onClose={() => setSelectedBattery(null)}
          onAssign={() => {
            setAssigningBattery(selectedBattery);
            setShowAssignModal(true);
          }}
          onDecommission={handleDecommission}
        />
      )}

      {showAssignModal && assigningBattery && (
        <AssignBatteryModal
          battery={assigningBattery}
          onClose={() => setShowAssignModal(false)}
          onSubmit={handleAssign}
        />
      )}

      {showPurchaseModal && (
        <PurchaseBatteryModal
          onClose={() => setShowPurchaseModal(false)}
          onSubmit={handlePurchase}
        />
      )}
    </main>
  );
}

/* ============================================================================
   DETAIL MODAL
============================================================================ */

function BatteryDetailModal({
  battery,
  onClose,
  onAssign,
  onDecommission,
}) {
  return (
    <div className="fixed inset-0 bg-white z-50 p-6 overflow-y-auto">

      <button
        onClick={onClose}
        className="mb-4 flex items-center gap-2 text-sm"
      >
        <FiX /> Close
      </button>

      <h2 className="text-xl font-bold mb-6">
        {battery.tag}
      </h2>

      <div className="grid md:grid-cols-2 gap-4 text-sm">
        {Object.entries(battery).map(
          ([key, value]) => {
            if (
              [
                "id",
                "auditTrail",
                "status",
              ].includes(key)
            )
              return null;

            return (
              <div key={key}>
                <p className="text-xs text-gray-500 capitalize">
                  {key}
                </p>
                <p className="font-medium">
                  {value || "—"}
                </p>
              </div>
            );
          }
        )}
      </div>

      <div className="mt-8 flex gap-4">

        {battery.status === "IN_STORE" && (
          <button
            onClick={onAssign}
            className="bg-[#3C498B] text-white px-5 py-2 rounded-xl text-sm"
          >
            Assign Battery
          </button>
        )}

        {battery.status === "IN_USE" && (
          <button
            onClick={() =>
              onDecommission(battery.id)
            }
            className="bg-red-600 text-white px-5 py-2 rounded-xl text-sm"
          >
            Mark as Decommissioned
          </button>
        )}
      </div>

      <div className="mt-10">
        <h3 className="font-semibold mb-3">
          Audit Trail
        </h3>

        <div className="space-y-2 text-xs">
          {battery.auditTrail.map(
            (entry, index) => (
              <div
                key={index}
                className="flex items-center gap-2"
              >
                <FiUser />
                <span>
                  {entry.action} by {entry.by} on{" "}
                  {entry.date}
                </span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   ASSIGN MODAL
============================================================================ */

function AssignBatteryModal({
  battery,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState({
    aircraftNumber: "",
    aircraft: "",
    callSign: "",
    assignedDate: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.aircraftNumber) {
      setError("Aircraft Number is required");
      return;
    }

    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-white z-50 p-6 overflow-y-auto">

      <button
        onClick={onClose}
        className="mb-4 flex items-center gap-2 text-sm"
      >
        <FiX /> Close
      </button>

      <h2 className="text-xl font-bold mb-6">
        Assign Battery — {battery.tag}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-2 gap-4"
      >
        <Input
          label="Aircraft Number"
          onChange={(v) =>
            setForm({
              ...form,
              aircraftNumber: v,
            })
          }
        />
        <Input
          label="Aircraft"
          onChange={(v) =>
            setForm({ ...form, aircraft: v })
          }
        />
        <Input
          label="Call Sign"
          onChange={(v) =>
            setForm({ ...form, callSign: v })
          }
        />
        <Input
          label="Assigned Date"
          type="date"
          onChange={(v) =>
            setForm({
              ...form,
              assignedDate: v,
            })
          }
        />

        {error && (
          <div className="md:col-span-2 text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="md:col-span-2 flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="text-sm"
          >
            Cancel
          </button>
          <button className="bg-[#3C498B] text-white px-4 py-2 rounded-xl text-sm">
            Confirm Assignment
          </button>
        </div>
      </form>
    </div>
  );
}

/* ============================================================================
   PURCHASE MODAL
============================================================================ */

function PurchaseBatteryModal({
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState({
    tag: "",
    type: "",
    chemistry: "",
    capacity: "",
    voltage: "",
    purchaseDate: "",
    manufacturer: "",
    supplier: "",
    warrantyExpiry: "",
    lastInspection: "",
    storageLocation: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-white z-50 p-6 overflow-y-auto">

      <button
        onClick={onClose}
        className="mb-4 flex items-center gap-2 text-sm"
      >
        <FiX /> Close
      </button>

      <h2 className="text-xl font-bold mb-6">
        Add Purchased Battery
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-2 gap-4"
      >
        {Object.keys(form).map((key) => (
          <Input
            key={key}
            label={key}
            type={
              key.includes("Date")
                ? "date"
                : "text"
            }
            onChange={(v) =>
              setForm({
                ...form,
                [key]: v,
              })
            }
          />
        ))}

        <div className="md:col-span-2 flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="text-sm"
          >
            Cancel
          </button>
          <button className="bg-[#3C498B] text-white px-4 py-2 rounded-xl text-sm">
            Save Battery
          </button>
        </div>
      </form>
    </div>
  );
}

/* ============================================================================
   SHARED INPUT COMPONENT
============================================================================ */

function Input({
  label,
  type = "text",
  onChange,
}) {
  return (
    <div>
      <label className="text-xs text-gray-500 capitalize">
        {label}
      </label>
      <input
        type={type}
        className="w-full border rounded-xl px-3 py-2 text-sm"
        onChange={(e) =>
          onChange(e.target.value)
        }
      />
    </div>
  );
}
