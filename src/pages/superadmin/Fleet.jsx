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

/* -------------------------------------------------------------------------- */
/*                    SCHEDULED MAINTENANCE CONFIGURATION                     */
/* -------------------------------------------------------------------------- */

const MAINTENANCE_CONFIG = {
  MFE: {
    engine: [50, 200],
  },
  DJI: {
    engine: [200, 300, 500],
  },
  CW25: {
    engine: [50, 100, 150, 200], // 200 = engine replacement
    airframe: [100, 200, 300],
  },
  SKYWHALE: {
    airframe: [100, 200, 300],
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
    flightHours: "412",
    batteryCycles: "138",
    firmware: "v04.01.02",
    callSign: "CAA, NCAA",
    loaner: false,
    excludedLegal: false,
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
    loaner: false,
    excludedLegal: false,
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
    flightHours: "188",
    batteryCycles: "76",
    firmware: "v2.6.1",
    callSign: "CAA",
    loaner: false,
    excludedLegal: false,
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
    loaner: true,
    excludedLegal: false,
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
    flightHours: "311",
    batteryCycles: "102",
    firmware: "v1.8.4",
    callSign: "EASA, CAA",
    loaner: false,
    excludedLegal: false,
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

function getAircraftCategory(model) {
  if (model.includes("MFE")) return "MFE";
  if (model.includes("DJI")) return "DJI";
  if (model.includes("CW25")) return "CW25";
  if (model.includes("SKYWHALE")) return "SKYWHALE";
  return null;
}

function getNextDueInterval(aircraft) {
  const category = getAircraftCategory(aircraft.model);
  if (!category) return null;

  const config = MAINTENANCE_CONFIG[category];
  if (!config) return null;

  const hours = Number(aircraft.flightHours);

  const allIntervals = [
    ...(config.engine || []),
    ...(config.airframe || []),
  ];

  const next = allIntervals.find((interval) => hours < interval);

  return next || null;
}

function isApproachingMaintenance(aircraft) {
  const next = getNextDueInterval(aircraft);
  if (!next) return false;

  const hours = Number(aircraft.flightHours);

  return next - hours <= 10 && next - hours > 0;
}

function isOverdueMaintenance(aircraft) {
  const category = getAircraftCategory(aircraft.model);
  if (!category) return false;

  const config = MAINTENANCE_CONFIG[category];
  const hours = Number(aircraft.flightHours);

  const allIntervals = [
    ...(config.engine || []),
    ...(config.airframe || []),
  ];

  return allIntervals.some((interval) => hours >= interval);
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
          border rounded-sm 
          px-2 py-1 
          sm:px-3 sm:py-1.5 
          text-xs sm:text-sm
          w-full sm:w-auto
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

    {(isApproachingMaintenance(aircraft) ||
      isOverdueMaintenance(aircraft)) && (
      <span className="absolute top-3 right-3 text-red-600 text-lg">
        ●
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

function AircraftModal({ aircraft, onClose, onUpdateHours }) {  return (
    <div className="fixed inset-0 bg-black/40 z-50 overflow-y-auto">
      <div className="bg-white mx-auto mb-10 shadow-xl p-8">
        <div className="flex justify-between items-center mt-10 mb-6">
          <h2 className="text-lg sm:text-2xl font-bold">{aircraft.model}</h2>
          <button onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-4 text-sm">
          {Object.entries(aircraft).map(([key, value]) => {
            if (key === "history" || key === "scheduledMaintenance")
              return null;

            return (
              <Info
                key={key}
                label={key}
                value={value?.toString()}
              />
            );
          })}
        </div>

<CanAccess permission={PERMISSIONS.EDIT_FLEET}>
  <div className="mt-6 flex justify-end">
    <button
      onClick={() => {
        const newHours = prompt("Enter new flight hours:");
        if (!newHours) return;
        onUpdateHours(aircraft.id, newHours);
      }}
      className="bg-[#3C498B] text-white px-4 py-2 rounded-xl text-sm"
    >
      Update Flight Hours
    </button>
  </div>
</CanAccess>

<div className="mt-4 flex justify-end">
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

      // Save data so Maintenance page can auto-fill
      localStorage.setItem(
        "prefilledMaintenance",
        JSON.stringify(maintenancePayload)
      );

      // Redirect
      window.location.href = "/maintenance";
    }}
    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm transition"
  >
    Request Maintenance
  </button>
</div> 

        {/* Scheduled Maintenance */}
        <h3 className="mt-8 font-semibold">
          Scheduled Maintenance Reasons
        </h3>
<select
  className="mt-3 border rounded-xl px-3 py-2 text-sm"
  onChange={(e) => {
    const selectedReason = e.target.value;

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

    window.location.href = "/maintenance";
  }}
>
  <option>Select Maintenance Reason</option>

  {(() => {
    const category = getAircraftCategory(aircraft.model);
    if (!category) return null;

    const config = MAINTENANCE_CONFIG[category];

    const reasons = [
      ...(config.engine || []).map((h) => `Engine - ${h} Hours`),
      ...(config.airframe || []).map((h) => `Airframe - ${h} Hours`),
    ];

    return reasons.map((reason, i) => (
      <option key={i} value={reason}>
        {reason}
      </option>
    ));
  })()}
</select>

        {/* Maintenance History */}
        <h3 className="mt-8 font-semibold">Maintenance History</h3>
        {aircraft.history.length === 0 && (
          <p className="text-sm text-gray-500 mt-3">
            No records available.
          </p>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              ADD AIRCRAFT MODAL                              */
/* -------------------------------------------------------------------------- */

function AddAircraftModal({ onClose, onSave }) {
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
    loaner: false,
    excludedLegal: false,
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
      <div className="bg-white mx-auto shadow-xl p-8">
        <div className="flex justify-between mt-10 items-center mb-6">
          <h2 className="text-2xl font-bold">Add New Aircraft</h2>
          <button onClick={onClose}>
            <FiX />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-3 gap-4 text-sm"
        >
          {Object.keys(form).map((field) => {
            if (
              field === "loaner" ||
              field === "excludedLegal"
            )
              return null;

            return (
              <Input
                key={field}
                label={field}
                name={field}
                value={form[field]}
                onChange={handleChange}
              />
            );
          })}

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
    <div className="bg-gray-50 rounded-xl p-4">
      <div className="text-xs text-gray-500 capitalize">
        {label}
      </div>
      <div className="font-medium break-words">
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
