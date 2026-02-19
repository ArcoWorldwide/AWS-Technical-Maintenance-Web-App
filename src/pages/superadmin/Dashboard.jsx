import { useState, useEffect } from "react";
import { BiChart, BiBattery } from "react-icons/bi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";


// 12 MONTH DATA (JAN - DEC)
const maintenanceData = [
  { month: "Jan", requests: 18 },
  { month: "Feb", requests: 10 },
  { month: "Mar", requests: 30 },
  { month: "Apr", requests: 25 },
  { month: "May", requests: 70 },
  { month: "Jun", requests: 90 },
  { month: "Jul", requests: 3 },
  { month: "Aug", requests: 2 },
  { month: "Sep", requests: 10 },
  { month: "Oct", requests: 80 },
  { month: "Nov", requests: 26 },
  { month: "Dec", requests: 90 },
];
/* ----------- UPDATED PIE DATA (BATTERY STATUS) ----------- */

const batteryStatusData = [
  { name: "Commissioned", value: 45 },
  { name: "In Use", value: 35 },
  { name: "Decommissioned", value: 20 },
];

const BATTERY_COLORS = ["#007BFF", "#40B869", "#FF3B30"];

const requestsData = [
  { id: "REQ-001", aircraft: "Quadcopter UAV", site: "Port Harcourt", hours: 12, maintenance: "Battery Check", severity: "High", status: "In Progress", actions: "View", submittedBy: "EAndrew" },
  { id: "REQ-002", aircraft: "Fixed-Wing Drone", site: "Lagos", hours: 8, maintenance: "Propeller Replacement", severity: "Medium", status: "Pending", actions: "View", submittedBy: "PJames" },
  { id: "REQ-003", aircraft: "Hexacopter UAV", site: "Abuja", hours: 15, maintenance: "Motor Inspection", severity: "Low", status: "Completed", actions: "View", submittedBy: "Tunde" },
  { id: "REQ-004", aircraft: "Fixed-Wing Drone", site: "Port Harcourt", hours: 10, maintenance: "Software Update", severity: "Medium", status: "Rejected", actions: "View", submittedBy: "Sammie" },
  { id: "REQ-005", aircraft: "Quadcopter UAV", site: "Lagos", hours: 7, maintenance: "Battery Check", severity: "High", status: "Pending", actions: "View", submittedBy: "Tim" },
];

/* ----------- UPDATED FLEET SUMMARY DATA ----------- */

const fleetSummaryData = [
  { aircraft: "In Use", total: 18 },
  { aircraft: "Grounded", total: 6 },
  { aircraft: "Under Maintenance", total: 9 },
];

// =================== TABLE COMPONENT ===================
const Table = ({ columns, data, onRowClick }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full border border-gray-200 rounded-lg divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {columns.map((col) => (
            <th
              key={col.key}
              className="text-left px-3 py-2 text-xs text-gray-600 whitespace-nowrap"
            >
              {col.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-100">
        {data.map((row) => (
          <tr
            key={row.id || row.aircraft}
            className="hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => onRowClick && onRowClick(row)}
          >
            {columns.map((col) => (
              <td
                key={col.key}
                className="px-3 py-2 text-xs text-gray-700 whitespace-nowrap"
              >
                {col.render ? col.render(row) : row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/* ========================== BAR CHART COMPONENT ========================== */

const BarChartComponent = () => {
  const [barSize, setBarSize] = useState(10);

  useEffect(() => {
    // Function to update bar size based on screen width
    const updateBarSize = () => {
      if (window.innerWidth < 768) { // Mobile breakpoint (sm/md)
        setBarSize(7);
      } else {
        setBarSize(15);
      }
    };

    updateBarSize(); // Set initial size
    window.addEventListener("resize", updateBarSize);

    return () => window.removeEventListener("resize", updateBarSize);
  }, []);

  return (
    <ResponsiveContainer width="100%" height={265}>
      <BarChart
        data={maintenanceData}
        margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#6E7479" }} />
        <YAxis tick={{ fontSize: 10, fill: "#6E7479" }} />
        <Tooltip contentStyle={{ borderRadius: "6px", border: "none" }} />
        <Bar
          dataKey="requests"
          fill="#007BFF"
          radius={[4, 4, 0, 0]}
          barSize={barSize} // <-- Dynamic value
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

// =================== PIE CHART COMPONENT ===================
const PieChartComponent = () => (
  <div className="flex flex-col items-center">
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={batteryStatusData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={70}
          label
          labelLine={false}
        >
          {batteryStatusData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={BATTERY_COLORS[index % BATTERY_COLORS.length]}
            />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>

    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-700">
      {batteryStatusData.map((entry, idx) => (
        <div key={idx} className="flex items-center gap-1">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: BATTERY_COLORS[idx] }}
          ></span>
          {entry.name} ({entry.value}%)
        </div>
      ))}
    </div>
  </div>
);

  /* -------- UPDATED FLEET SUMMARY TABLE -------- */

  const fleetColumns = [
    { title: "Fleet Status", key: "aircraft" },
    { title: "Total", key: "total" },
  ];

  const handleRowClick = (row) => {
    alert(
      `Request Info:\nAircraft: ${row.aircraft}\nSite: ${row.site}\nMaintenance: ${row.maintenance}\nStatus: ${row.status}`
    );
  };

// =================== DASHBOARD ===================
export default function Dashboard() {
  const requestColumns = [
    { title: "Aircraft", key: "aircraft" },
    { title: "Site", key: "site" },
    { title: "Hours", key: "hours" },
    { title: "Maintenance", key: "maintenance" },
    { title: "Severity", key: "severity" },
    {
      title: "Status",
      key: "status",
      render: (data) => {
        let bgColor = "", textColor = "";
        switch (data.status) {
          case "Pending": bgColor = "bg-yellow-100"; textColor = "text-yellow-600"; break;
          case "In Progress": bgColor = "bg-blue-100"; textColor = "text-blue-600"; break;
          case "Completed": bgColor = "bg-green-100"; textColor = "text-green-600"; break;
          case "Rejected": bgColor = "bg-red-100"; textColor = "text-red-600"; break;
          default: bgColor = "bg-gray-100"; textColor = "text-gray-600";
        }
        return <span className={`px-2 py-0.5 text-[10px] rounded-full font-medium ${bgColor} ${textColor}`}>{data.status}</span>;
      },
    },
    { title: "Actions", key: "actions" },
    { title: "Submitted By", key: "submittedBy" },
  ];

  const topAircraftColumns = [
    { title: "Aircraft", key: "aircraft" },
    { title: "Completed Requests", key: "completedRequests" },
  ];

  const handleRowClick = (row) => {
    alert(`Request Info:\nAircraft: ${row.aircraft}\nSite: ${row.site}\nMaintenance: ${row.maintenance}\nStatus: ${row.status}`);
  };

  return (
    <section className="md:ml-[220px] px-4 sm:px-6 py-6 min-h-screen">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* LEFT MAIN CONTENT */}
        <div className="xl:col-span-2 flex flex-col gap-6">

          {/* SUMMARY CARD */}
          <div className="bg-white rounded-xl mt-3 p-4 flex justify-between items-center gap-4 shadow-md">
            <div className="space-y-1 w-full">
              <h3 className="text-xs text-gray-500">Total Maintenance Requests</h3>
              <h2 className="text-2xl font-semibold text-gray-700">1,500</h2>
              <div className="flex flex-wrap gap-1">
                <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-600">Pending: 320</span>
                <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-600">In Progress: 410</span>
                <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-600">Completed: 230</span>
                <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-600">Rejected: 75</span>
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 flex items-center justify-center">
              <BiBattery className="text-blue-500 w-8 h-8" />
            </div>
          </div>

          {/* METRIC CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 flex flex-col justify-between shadow-md">
              <h3 className="text-xs text-gray-500 mb-1">Approved Requests</h3>
              <h2 className="text-xl font-semibold text-gray-700 mb-1">540</h2>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="px-2 py-0.5 bg-green-100 text-green-600 rounded-full flex items-center gap-1">
                  <BiChart /> 12.4%
                </span>
                vs last month
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 flex flex-col justify-between shadow-md">
              <h3 className="text-xs text-gray-500 mb-1">Active Engineers & Pilots</h3>
              <h2 className="text-xl font-semibold text-gray-700 mb-1">1,380</h2>
              <div className="flex flex-wrap gap-1 text-xs">
                <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full">Engineers: 420</span>
                <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full">Pilots: 960</span>
              </div>
            </div>
          </div>

          {/* BAR CHART */}
          <div className="bg-white rounded-xl p-4 shadow-md">
            <h3 className="text-xs text-gray-500 font-semibold mb-1">
              Maintenance Requests (Jan - Dec)
            </h3>
            <BarChartComponent />
          </div>

        </div>

        {/* RIGHT SIDEBAR */}
        <div className="flex flex-col gap-4">

          {/* UPDATED FLEET SUMMARY */}
          <div className="bg-white mt-3 rounded-xl p-4 shadow-md overflow-x-auto">
            <h2 className="text-xs text-gray-500 font-semibold mb-2">
              Fleet Summary
            </h2>
            <Table columns={fleetColumns} data={fleetSummaryData} />
          </div>


          {/* UPDATED PIE CHART */}
          <div className="bg-white rounded-xl p-4 shadow-md">
            <h3 className="text-xs text-gray-500 font-semibold mb-2">
              Battery Status Distribution
            </h3>
            <PieChartComponent />
          </div>
        </div>

        {/* FULL WIDTH RECENT MAINTENANCE REQUESTS TABLE */}
        <div className="xl:col-span-3 mt-6">
          <div className="bg-white rounded-xl p-4 shadow-md overflow-x-auto">
            <h2 className="text-xs text-gray-500 font-semibold mb-2">Recent Maintenance Requests</h2>
            <Table columns={requestColumns} data={requestsData.slice(0, 5)} onRowClick={handleRowClick} />
          </div>
        </div>

      </div>
    </section>
  );
}
