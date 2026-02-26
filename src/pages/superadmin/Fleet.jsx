import { useEffect, useMemo, useState } from "react";
import {
  FiPlus,
  FiSearch,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiTool,
  FiLayers,
  FiCalendar,
  FiFileText,
} from "react-icons/fi";

/* ROLE-BASED ACCESS */
import CanAccess from "../../components/reusables/CanAccess";
import { PERMISSIONS } from "../../utils/constants/permissions";
import { useNavigate } from "react-router-dom";

const MAINTENANCE_CONFIG = {

  /* ----------------------------------------------------- */
  /*                    GENERAL (Fallback)                 */
  /* ----------------------------------------------------- */

  GENERAL: {
    scheduled: [
      { code: "GEN-25", label: "25 Hour General Inspection", interval: 25 },
      { code: "GEN-50", label: "50 Hour General Inspection", interval: 50 },
      { code: "GEN-100", label: "100 Hour General Service", interval: 100 },
      { code: "GEN-200", label: "200 Hour Major Inspection", interval: 200 },
      { code: "GEN-300", label: "300 Hour Structural Check", interval: 300 },
      { code: "GEN-400", label: "400 Hour Deep System Overhaul", interval: 400 },
      { code: "ANNUAL", label: "Annual Airworthiness Review", interval: null },
      { code: "COMP", label: "Regulatory Compliance Check", interval: null },
      { code: "CAL", label: "Full System Calibration", interval: null },
      { code: "FW", label: "Firmware Audit & Update", interval: null },
      { code: "PAYLOAD", label: "Payload Mount Inspection", interval: null },
      { code: "FRAME", label: "Airframe Structural Inspection", interval: null },
      { code: "ELEC", label: "Electrical Wiring Check", interval: null },
      { code: "ESC", label: "ESC Recalibration", interval: null },
      { code: "MOTOR", label: "Motor Performance Test", interval: null },
    ],
  },

  /* ----------------------------------------------------- */
  /*                        DJI                            */
  /* ----------------------------------------------------- */

  DJI: {
    scheduled: [
      { code: "DJI-25", label: "25 Hour DJI System Check", interval: 25 },
      { code: "DJI-50", label: "50 Hour DJI Inspection", interval: 50 },
      { code: "DJI-100", label: "100 Hour DJI Maintenance", interval: 100 },
      { code: "DJI-200", label: "200 Hour DJI Major Service", interval: 200 },
      { code: "DJI-300", label: "300 Hour Motor Replacement", interval: 300 },
      { code: "DJI-400", label: "400 Hour ESC Replacement", interval: 400 },
      { code: "BAT-100", label: "Battery Health Check - 100 Hours", interval: 100 },
      { code: "BAT-200", label: "Battery Replacement - 200 Hours", interval: 200 },
      { code: "IMU-150", label: "IMU Recalibration - 150 Hours", interval: 150 },
      { code: "GPS-150", label: "GPS System Validation - 150 Hours", interval: 150 },
      { code: "CAM-100", label: "Gimbal & Camera Alignment - 100 Hours", interval: 100 },
      { code: "RTK-200", label: "RTK Module Accuracy Test - 200 Hours", interval: 200 },
      { code: "ANNUAL", label: "Annual DJI Compliance Review", interval: null },
    ],
  },

  /* ----------------------------------------------------- */
  /*                     FIXED WING                        */
  /* ----------------------------------------------------- */

  "FIXED WING": {
    scheduled: [
      { code: "FW-50", label: "50 Hour Fixed Wing Inspection", interval: 50 },
      { code: "FW-100", label: "100 Hour Wing Load Test", interval: 100 },
      { code: "FW-200", label: "200 Hour Structural Reinforcement", interval: 200 },
      { code: "FW-300", label: "300 Hour Control Surface Service", interval: 300 },
      { code: "FW-400", label: "400 Hour Major Overhaul", interval: 400 },
      { code: "WING-150", label: "Wing Integrity Scan - 150 Hours", interval: 150 },
      { code: "TAIL-200", label: "Tail Section Inspection - 200 Hours", interval: 200 },
      { code: "FUEL-100", label: "Fuel System Maintenance - 100 Hours", interval: 100 },
      { code: "NAV-100", label: "Navigation System Check - 100 Hours", interval: 100 },
      { code: "PAYLOAD-150", label: "Payload Mount Check - 150 Hours", interval: 150 },
    ],
  },

  /* ----------------------------------------------------- */
  /*                     VTOL DRONES                       */
  /* ----------------------------------------------------- */

  VTOL: {
    scheduled: [
      { code: "VTOL-50", label: "50 Hour VTOL Hybrid Check", interval: 50 },
      { code: "VTOL-100", label: "100 Hour VTOL Transition Test", interval: 100 },
      { code: "VTOL-200", label: "200 Hour VTOL Major Service", interval: 200 },
      { code: "TRANS-150", label: "Transition Mechanism Inspection - 150 Hours", interval: 150 },
      { code: "HYB-200", label: "Hybrid Motor System Service - 200 Hours", interval: 200 },
      { code: "PROP-100", label: "Lift Propeller Replacement - 100 Hours", interval: 100 },
      { code: "CTRL-150", label: "Flight Control System Test - 150 Hours", interval: 150 },
    ],
  },

  /* ----------------------------------------------------- */
  /*                     AGRICULTURE DRONES                */
  /* ----------------------------------------------------- */

  AGRICULTURE: {
    scheduled: [
      { code: "AG-25", label: "25 Hour Spray System Flush", interval: 25 },
      { code: "AG-50", label: "50 Hour Pump Inspection", interval: 50 },
      { code: "AG-100", label: "100 Hour Nozzle Replacement", interval: 100 },
      { code: "AG-150", label: "150 Hour Tank Pressure Test", interval: 150 },
      { code: "AG-200", label: "200 Hour Sprayer Overhaul", interval: 200 },
      { code: "AG-300", label: "300 Hour Structural Check", interval: 300 },
    ],
  },
};

/* -------------------------------------------------------------------------- */
/*                               DEMO FLEET DATA                               */
/* -------------------------------------------------------------------------- */

const initialFleet = [
  {
    id: 1,
    model: "DJI Matrice 300 RTK",
    serial: "DJI-M300-8821",
    manufacturer: "DJI",
    type: "Quadcopter",
    status: "In Service",
    owner: "AWS Nigeria",
    complianceCategory: "CAA Approved",
    firmwareVersion: "v04.01.02",
    hardwareVersion: "HW-1.3",
    weight: "6.3",
    color: "Grey",
    propulsionType: "Electric",
    maxSpeed: "23",
    maxVerticalSpeed: "6",
    maxPayload: "2.7",
    insurableValue: "12000000",
    purchaseDate: "2024-01-18",
    location: "Lagos Base",
    flightHours: "12",
    batteryCycles: "138",
    firmware: "v04.01.02",
    callSign: "CAA, NCAA",
    scheduledMaintenance: [],
    history: [
      {
        title: "Routine Inspection",
        date: "2024-11-02",
        notes: "Propellers replaced.",
        files: ["inspection-report.pdf"],
      },
    ],
  },
  {
    id: 2,
    model: "WingtraOne Gen II",
    serial: "WG-2219",
    manufacturer: "Wingtra",
    type: "Fixed Wing",
    status: "Under Maintenance",
    owner: "AWS Nigeria",
    complianceCategory: "EASA Certified",
    firmwareVersion: "v3.9.7",
    hardwareVersion: "HW-2.0",
    weight: "3.7",
    color: "White",
    propulsionType: "Electric",
    maxSpeed: "16",
    maxVerticalSpeed: "4",
    maxPayload: "1.5",
    insurableValue: "8500000",
    purchaseDate: "2023-10-04",
    location: "Abuja Hangar",
    flightHours: "982",
    batteryCycles: "402",
    firmware: "v3.9.7",
    callSign: "EASA",
    scheduledMaintenance: [],
    history: [],
  },
  {
    id: 3,
    model: "Autel Evo II Pro",
    serial: "AUT-EVO-5543",
    manufacturer: "Autel Robotics",
    type: "Quadcopter",
    status: "In Service",
    owner: "AWS Nigeria",
    complianceCategory: "CAA Approved",
    firmwareVersion: "v2.6.1",
    hardwareVersion: "HW-1.1",
    weight: "1.2",
    color: "Black",
    propulsionType: "Electric",
    maxSpeed: "19",
    maxVerticalSpeed: "5",
    maxPayload: "0.9",
    insurableValue: "4200000",
    purchaseDate: "2024-03-12",
    location: "Port Harcourt",
    flightHours: "10",
    batteryCycles: "76",
    firmware: "v2.6.1",
    callSign: "CAA",
    scheduledMaintenance: [],
    history: [],
  },
  {
    id: 4,
    model: "DJI Mavic 3 Enterprise",
    serial: "DJI-M3E-9007",
    manufacturer: "DJI",
    type: "Quadcopter",
    status: "Grounded",
    owner: "AWS Nigeria",
    complianceCategory: "CAA Approved",
    firmwareVersion: "v01.02.000",
    hardwareVersion: "HW-1.0",
    weight: "0.9",
    color: "Grey",
    propulsionType: "Electric",
    maxSpeed: "21",
    maxVerticalSpeed: "5",
    maxPayload: "1.1",
    insurableValue: "3900000",
    purchaseDate: "2022-07-21",
    location: "Maintenance Bay",
    flightHours: "1240",
    batteryCycles: "611",
    firmware: "v01.02.000",
    callSign: "CAA, NCAA",
    scheduledMaintenance: [],
    history: [],
  },
  {
    id: 5,
    model: "Quantum Trinity F90+",
    serial: "QT-F90-3311",
    manufacturer: "Quantum Systems",
    type: "Fixed Wing",
    status: "In Service",
    owner: "AWS Nigeria",
    complianceCategory: "EASA Certified",
    firmwareVersion: "v1.8.4",
    hardwareVersion: "HW-3.2",
    weight: "4.2",
    color: "White",
    propulsionType: "Electric",
    maxSpeed: "18",
    maxVerticalSpeed: "4",
    maxPayload: "1.8",
    insurableValue: "9700000",
    purchaseDate: "2024-05-29",
    location: "Survey Ops Unit",
    flightHours: "31",
    batteryCycles: "102",
    firmware: "v1.8.4",
    callSign: "EASA, CAA",
    scheduledMaintenance: [],
    history: [],
  },
];

/* -------------------------------------------------------------------------- */
/*                                 MAIN PAGE                                   */
/* -------------------------------------------------------------------------- */

const PAGE_SIZE = 6;

/* -------------------------------------------------------------------------- */
/*                    MAINTENANCE STATUS CALCULATIONS                         */
/* -------------------------------------------------------------------------- */

function getNextDueInterval(aircraft) {
  const category =
    MAINTENANCE_CONFIG[aircraft.manufacturer?.toUpperCase()] ||
    MAINTENANCE_CONFIG[aircraft.type?.toUpperCase()] ||
    MAINTENANCE_CONFIG.GENERAL;

  const hours = Number(aircraft.flightHours);

  const intervals = category.scheduled
    .filter((item) => item.interval)
    .map((item) => item.interval)
    .sort((a, b) => a - b);

  return intervals.find((interval) => hours < interval) || null;
}

function isApproachingMaintenance(aircraft) {
  const next = getNextDueInterval(aircraft);
  if (!next) return false;

  const hours = Number(aircraft.flightHours);

  return next - hours <= 10 && next - hours > 0;
}

function isOverdueMaintenance(aircraft) {
  const config =
    MAINTENANCE_CONFIG[aircraft.manufacturer?.toUpperCase()] ||
    MAINTENANCE_CONFIG[aircraft.type?.toUpperCase()] ||
    MAINTENANCE_CONFIG.GENERAL;

  if (!config || !config.scheduled) return false;

  const hours = Number(aircraft.flightHours);

  return config.scheduled.some(
    (item) =>
      item.interval &&
      hours >= item.interval &&
      !aircraft.history.some((h) =>
        h.title?.includes(item.interval + " Hour")
      )
  );
}

export default function FleetPage() {
  const [fleet, setFleet] = useState(initialFleet);
  const [selectedAircraft, setSelectedAircraft] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [page, setPage] = useState(1);

  const filteredFleet = useMemo(() => {
    let data = [...fleet];

    if (filter !== "ALL") {
      data = data.filter((f) => f.status === filter);
    }

    if (search) {
      data = data.filter(
        (f) =>
          f.model.toLowerCase().includes(search.toLowerCase()) ||
          f.serial.toLowerCase().includes(search.toLowerCase())
      );
    }

    return data;
  }, [fleet, filter, search]);

  const paginatedFleet = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredFleet.slice(start, start + PAGE_SIZE);
  }, [filteredFleet, page]);

  const totalPages = Math.ceil(filteredFleet.length / PAGE_SIZE);

  return (
    <main className="relative min-h-screen px-4 sm:px-6 py-6 md:pl-[240px]">
<div className="bg-white rounded-2xl shadow 
                px-4 py-4 sm:p-5 md:p-6 
                flex flex-col gap-4">

  {/* Top Section */}
  <div className="flex flex-col sm:flex-row 
                  sm:items-center sm:justify-between 
                  gap-3">

    {/* Title Section */}
    <div>
      <h1 className="text-lg sm:text-2xl font-semibold sm:font-bold text-gray-800">
        Fleet Management
      </h1>
      <p className="text-[11px] sm:text-sm text-gray-500 mt-1">
        UAV lifecycle monitoring & maintenance overview
      </p>
    </div>

    {/* Controls */}
    <div className="flex items-center gap-2 sm:gap-3">

      {/* Filter */}
      <select
className="
  w-full sm:w-44
  border border-gray-200
  bg-gray-50
  rounded-lg
  px-3 py-2
  text-sm
  focus:outline-none
  focus:ring-2
  focus:ring-[#3C498B]/30
  transition
"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="ALL">All</option>
        <option value="In Service">In Service</option>
        <option value="Under Maintenance">Under Maintenance</option>
        <option value="Grounded">Grounded</option>
      </select>

      <CanAccess permission={PERMISSIONS.EDIT_FLEET}>
        
        {/* Desktop Button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="
            hidden sm:flex items-center gap-2
            bg-[#3C498B] text-white
            px-4 py-2
            rounded-lg
            text-sm
            hover:opacity-90 transition
          "
        >
          <FiPlus />
          Add Aircraft
        </button>

        {/* Mobile Icon Button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="
            sm:hidden flex items-center justify-center
            bg-[#3C498B] text-white
            p-1.5
            rounded-sm
            hover:opacity-90 transition
          "
          aria-label="Add Aircraft"
        >
          <FiPlus size={14} />
        </button>

      </CanAccess>
    </div>
  </div>
</div>


{/* SEARCH */}
<div className="mt-4 sm:mt-6 
                flex items-center gap-2 
                bg-white 
                px-3 sm:px-4 
                py-2 sm:py-3 
                rounded-xl shadow">

  <FiSearch className="text-sm sm:text-base text-gray-500" />

  <input
    placeholder="Search by model or serial..."
    className="w-full outline-none 
               text-xs sm:text-sm"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
</div>


      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
{paginatedFleet.map((aircraft) => (
  <button
    key={aircraft.id}
    onClick={() => setSelectedAircraft(aircraft)}
    className="relative bg-white rounded-2xl shadow p-5 text-left hover:shadow-md transition"
  >

{isOverdueMaintenance(aircraft) && (
  <span className="absolute top-3 right-3 
                   bg-red-100 text-red-700 
                   text-[10px] font-semibold 
                   px-2 py-1 rounded-full">
    Overdue
  </span>
)}

{!isOverdueMaintenance(aircraft) &&
  isApproachingMaintenance(aircraft) && (
    <span className="absolute top-3 right-3 
                     bg-yellow-100 text-yellow-700 
                     text-[10px] font-semibold 
                     px-2 py-1 rounded-full">
      Due Soon
    </span>
)}

    <h3 className="font-semibold text-gray-800 mb-1">
      {aircraft.model}
    </h3>

    <p className="text-xs text-gray-500 mb-2">
      {aircraft.manufacturer}
    </p>

    <p
      className={`text-xs font-medium ${
        aircraft.status === "In Service"
          ? "text-green-600"
          : aircraft.status === "Under Maintenance"
          ? "text-yellow-600"
          : "text-red-600"
      }`}
    >
      {aircraft.status}
    </p>

    <div className="mt-3 text-xs text-gray-600 space-y-1">
      <div>Location: {aircraft.location}</div>
      <div>Flight Hours: {aircraft.flightHours}</div>
    </div>

  </button>
))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            <FiChevronLeft />
          </button>
          <span className="text-sm">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            <FiChevronRight />
          </button>
        </div>
      )}

{selectedAircraft && (
  <AircraftModal
    aircraft={selectedAircraft}
    onClose={() => setSelectedAircraft(null)}
    onUpdateHours={(id, hours) => {
      setFleet((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, flightHours: hours } : a
        )
      );

      setSelectedAircraft((prev) =>
        prev ? { ...prev, flightHours: hours } : prev
      );
    }}
  />
)}

      {showAddModal && (
        <AddAircraftModal
          onClose={() => setShowAddModal(false)}
          onSave={(newAircraft) => {
            setFleet([...fleet, newAircraft]);
          }}
        />
      )}
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/*                           AIRCRAFT DETAIL MODAL                              */
/* -------------------------------------------------------------------------- */

function AircraftModal({ aircraft, onClose, onUpdateHours }) {  
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const navigate = useNavigate(); 

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex">
      <div className="bg-white w-full h-full overflow-y-auto px-6 sm:px-10 py-8">
        <div className="flex justify-between items-start mt-6 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {aircraft.model}
            </h2>
            <div className="mt-3 flex gap-2 flex-wrap">
              <span
                className={`text-xs px-3 py-1 rounded-full font-medium
                  ${
                    aircraft.status === "In Service"
                      ? "bg-green-100 text-green-700"
                      : aircraft.status === "Under Maintenance"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
              >
                {aircraft.status}
              </span>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <FiX />
          </button>
        </div>

        {/* Aircraft Details Grid */}
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          {Object.entries(aircraft).map(([key, value]) => {
            if (key === "history" || key === "scheduledMaintenance") return null;
            return <Info key={key} label={key} value={value?.toString()} />;
          })}
        </div>

        {/* Actions */}
        <CanAccess permission={PERMISSIONS.EDIT_FLEET}>
          <div className="mt-6 flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={() => {
                const newHours = prompt("Enter new flight hours:");
                if (!newHours) return;
                onUpdateHours(aircraft.id, newHours);
              }}
              className="
                w-full sm:w-auto
                bg-[#3C498B] text-white
                px-3 sm:px-4
                py-1.5 sm:py-2
                text-xs sm:text-sm
                rounded-md sm:rounded-lg
                hover:opacity-90 transition
              "
            >
              Update Hours
            </button>

            <button
              onClick={() => {
                const maintenancePayload = {
                  aircraftId: aircraft.id,
                  model: aircraft.model,
                  serial: aircraft.serial,
                  manufacturer: aircraft.manufacturer,
                  type: aircraft.type,
                  location: aircraft.location,
                  flightHours: aircraft.flightHours,
                  status: aircraft.status,
                };

                localStorage.setItem(
                  "prefilledMaintenance",
                  JSON.stringify(maintenancePayload)
                );

                navigate("/dashboard/maintenance");
              }}
              className="
                w-full sm:w-auto
                bg-red-600 hover:bg-red-700 text-white
                px-3 sm:px-4
                py-1.5 sm:py-2
                text-xs sm:text-sm
                rounded-md sm:rounded-lg
                transition
              "
            >
              Request Maintenance
            </button>
          </div>
        </CanAccess>

        {/* Maintenance Overview */}
        <div className="mt-10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="bg-[#3C498B]/10 p-2 rounded-lg">
              <FiTool className="text-[#3C498B]" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">
                Maintenance Overview
              </h3>
              <p className="text-xs text-gray-500">
                Scheduled service & inspection tracking
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-white to-gray-50 border rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Current Flight Hours</p>
              <p className="text-2xl font-bold text-gray-800">{aircraft.flightHours} hrs</p>
            </div>

            <div>
              {isOverdueMaintenance(aircraft) && (
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
                  Overdue Maintenance
                </span>
              )}

              {!isOverdueMaintenance(aircraft) && isApproachingMaintenance(aircraft) && (
                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
                  Maintenance Due Soon
                </span>
              )}

              {!isOverdueMaintenance(aircraft) && !isApproachingMaintenance(aircraft) && (
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                  Maintenance Up To Date
                </span>
              )}
            </div>
          </div>

          {/* Schedule Maintenance */}
          <div className="bg-white border rounded-2xl p-5 space-y-4">
            <h4 className="text-sm font-semibold text-gray-700">Schedule Maintenance</h4>
            <select
              className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3C498B]/30 transition"
              defaultValue=""
              onChange={(e) => {
                const selectedReason = e.target.value;
                if (!selectedReason) return;

                const maintenancePayload = {
                  aircraftId: aircraft.id,
                  model: aircraft.model,
                  serial: aircraft.serial,
                  reason: selectedReason,
                  flightHours: aircraft.flightHours,
                };

                localStorage.setItem(
                  "prefilledMaintenance",
                  JSON.stringify(maintenancePayload)
                );

                navigate("/dashboard/maintenance");
              }}
            >
              <option value="">Select inspection type</option>
              {(
                MAINTENANCE_CONFIG[aircraft.manufacturer?.toUpperCase()] ||
                MAINTENANCE_CONFIG[aircraft.type?.toUpperCase()] ||
                MAINTENANCE_CONFIG.GENERAL
              ).scheduled.map((item) => (
                <option key={item.code} value={item.label}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          {/* Maintenance History */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-4">Maintenance History</h4>
            {aircraft.history.length === 0 ? (
              <div className="bg-gray-50 border rounded-xl p-6 text-center text-sm text-gray-500">
                No maintenance records yet.
              </div>
            ) : (
              <div className="relative border-l-2 border-gray-200 ml-3 space-y-6">
                {aircraft.history.map((item, index) => (
                  <div key={index} className="relative pl-6">
                    <div className="absolute -left-[9px] top-2 w-4 h-4 bg-[#3C498B] rounded-full border-4 border-white shadow" />
                    <div className="bg-gray-50 border rounded-xl p-4">
                      <div className="flex justify-between items-center">
                        <h5 className="font-semibold text-sm text-gray-800">{item.title}</h5>
                        <span className="text-xs text-gray-500">{item.date}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">{item.notes}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              ADD AIRCRAFT MODAL                              */
/* -------------------------------------------------------------------------- */

function AddAircraftModal({ onClose, onSave }) {

  useEffect(() => {
  const originalStyle = window.getComputedStyle(document.body).overflow;
  document.body.style.overflow = "hidden";

  return () => {
    document.body.style.overflow = originalStyle;
  };
}, []);

  const [form, setForm] = useState({
    model: "",
    serial: "",
    manufacturer: "",
    type: "",
    status: "In Service",
    owner: "",
    complianceCategory: "",
    firmwareVersion: "",
    hardwareVersion: "",
    weight: "",
    color: "",
    propulsionType: "Electric",
    maxSpeed: "",
    maxVerticalSpeed: "",
    maxPayload: "",
    insurableValue: "",
    purchaseDate: "",
    location: "",
    flightHours: "",
    batteryCycles: "",
    firmware: "",
    callSign: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave({
      ...form,
      id: Date.now(),
      scheduledMaintenance: [],
      history: [],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 overflow-y-auto">
    <div className="bg-white w-full h-full sm:h-auto sm:max-w-6xl 
                sm:rounded-2xl sm:mx-auto 
                p-6 sm:p-8">        <div className="flex justify-between mt-10 items-center mb-6">
          <h2 className="text-2xl font-bold">Add New Aircraft</h2>
          <button onClick={onClose}>
            <FiX />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-3 gap-4 text-sm"
        >
{Object.keys(form).map((field) => (
  <Input
    key={field}
    label={field}
    name={field}
    value={form[field]}
    onChange={handleChange}
  />
))}

          <div className="md:col-span-3 flex justify-end gap-3 mt-4">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="bg-[#3C498B] text-white px-6 py-2 rounded-xl">
              Save Aircraft
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 HELPERS                                     */
/* -------------------------------------------------------------------------- */

function Info({ label, value }) {
  return (
    <div className="bg-white border rounded-xl p-4">
      <div className="text-xs text-gray-400 capitalize mb-1">
        {label.replace(/([A-Z])/g, " $1")}
      </div>
      <div className="font-medium text-gray-800 break-words">
        {value || "-"}
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="text-xs text-gray-500 capitalize">
        {label}
      </label>
      <input
        {...props}
        className="w-full border rounded-xl px-3 py-2 text-sm"
      />
    </div>
  );
}

function Checkbox({ label, ...props }) {
  return (
    <label className="flex items-center gap-2 mt-4 text-sm">
      <input type="checkbox" {...props} />
      {label}
    </label>
  );
}
