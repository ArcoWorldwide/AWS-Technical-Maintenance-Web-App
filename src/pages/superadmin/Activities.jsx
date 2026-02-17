import { useMemo, useState } from "react";
import {
  FiCheckCircle,
  FiXCircle,
  FiTrash2,
  FiEdit,
  FiPlusCircle,
  FiTool,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

/* -------------------------------------------------------------------------- */
/*                                DEMO DATA                                    */
/* -------------------------------------------------------------------------- */

const activityData = [
  {
    id: 1,
    user: "Praise",
    email: "praise@arcoworldwide.ng",
    action: "deleted a maintenance report",
    type: "delete",
    date: "2026-02-14T09:30:00",
  },
  {
    id: 2,
    user: "Tim",
    email: "tim@arcoworldwide.ng",
    action: "updated maintenance request #MR-204",
    type: "update",
    date: "2026-02-14T10:10:00",
  },
  {
    id: 3,
    user: "Blessing",
    email: "blessing@arcoworldwide.ng",
    action: "approved maintenance request #MR-210",
    type: "approve",
    date: "2026-02-14T11:15:00",
  },
  {
    id: 4,
    user: "Emeka",
    email: "emeka@arcoworldwide.ng",
    action: "added purchased battery (BAT-4482)",
    type: "add",
    date: "2026-02-14T12:25:00",
  },
  {
    id: 5,
    user: "Tolu",
    email: "tolu@arcoworldwide.ng",
    action: "declined maintenance request #MR-215",
    type: "decline",
    date: "2026-02-14T13:40:00",
  },
  {
    id: 6,
    user: "Samuel",
    email: "samuel@arcoworldwide.ng",
    action: "added new fleet aircraft (Falcon-X7)",
    type: "add",
    date: "2026-02-14T15:05:00",
  },
];

/* -------------------------------------------------------------------------- */
/*                               HELPERS                                       */
/* -------------------------------------------------------------------------- */

const PAGE_SIZE = 10;

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getIcon = (type) => {
  switch (type) {
    case "approve":
      return <FiCheckCircle className="text-green-600" />;
    case "decline":
      return <FiXCircle className="text-red-600" />;
    case "delete":
      return <FiTrash2 className="text-red-600" />;
    case "update":
      return <FiEdit className="text-blue-600" />;
    case "add":
      return <FiPlusCircle className="text-indigo-600" />;
    default:
      return <FiTool className="text-gray-500" />;
  }
};

/* -------------------------------------------------------------------------- */
/*                               MAIN PAGE                                     */
/* -------------------------------------------------------------------------- */

export default function ActivitiesPage() {
  const [page, setPage] = useState(1);

  const paginatedActivities = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return activityData.slice(start, start + PAGE_SIZE);
  }, [page]);

  const totalPages = Math.ceil(activityData.length / PAGE_SIZE);

  return (
    <main className="relative min-h-screen px-4 sm:px-6 py-6 md:pl-[240px]">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 shadow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Activities
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            System-wide action tracking & user notifications
          </p>
        </div>

        <div className="text-xs sm:text-sm text-gray-500">
          {activityData.length} total actions
        </div>
      </div>

      {/* Activity List */}
      <div className="mt-6 bg-white rounded-2xl shadow divide-y">
        {paginatedActivities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-3 sm:gap-4 px-4 sm:px-6 py-4 hover:bg-gray-50 transition"
          >
            <div className="mt-1 text-lg">
              {getIcon(activity.type)}
            </div>

            <div className="flex-1">
              <p className="text-sm sm:text-base text-gray-800 leading-relaxed">
                <span className="font-semibold">
                  {activity.user}
                </span>{" "}
                <span className="text-gray-500 text-xs sm:text-sm">
                  ({activity.email})
                </span>{" "}
                {activity.action}
              </p>

              <p className="text-xs text-gray-400 mt-1">
                {formatDate(activity.date)}
              </p>
            </div>
          </div>
        ))}

        {paginatedActivities.length === 0 && (
          <div className="p-6 text-center text-gray-500 text-sm">
            No activities available.
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm rounded-lg ${
              page === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            <FiChevronLeft />
            Prev
          </button>

          <span className="text-xs sm:text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm rounded-lg ${
              page === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            Next
            <FiChevronRight />
          </button>
        </div>
      )}
    </main>
  );
}
