import { useState, useMemo } from "react";
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiX } from "react-icons/fi";

// Grab API base URL from env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Roles
const ROLES = ["Superadmin", "Admin", "Technical", "COO", "MD", "QHSE"];

const roleColors = {
  Superadmin: "bg-purple-100 text-purple-700",
  Admin: "bg-blue-100 text-blue-700",
  Technical: "bg-amber-100 text-amber-700",
  COO: "bg-green-100 text-green-700",
  MD: "bg-indigo-100 text-indigo-700",
  QHSE: "bg-rose-100 text-rose-700",
};

// Initial users (optional fallback)
const initialUsers = [];

export default function SuperAdminUsers() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Filtered users for search & role filter
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === "All" || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  // Fetch users from backend (optional, if you have GET /users endpoint)
  // You can implement this if needed:
  // useEffect(() => { fetchUsers(); }, []);

  // Save user: call backend
  const saveUser = async (data) => {
    setLoading(true);
    setError("");

    try {
      let updatedUsers = [...users];

      if (editingUser?.id) {
        // If editing, update locally only (or call PATCH endpoint if exists)
        updatedUsers = updatedUsers.map((u) =>
          u.id === editingUser.id ? { ...u, ...data } : u
        );
      } else {
        // Create user via backend
        const token = localStorage.getItem("token"); // Admin token
        const response = await fetch(`${API_BASE_URL}/auth/users/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            role: data.role.toLowerCase(), // lowercase if backend expects it
          }),
        });

        if (!response.ok) {
          const resData = await response.json();
          throw new Error(resData.message || "Failed to create user.");
        }

        // Optionally add created user to local state (backend may return the user)
        updatedUsers = [
          ...updatedUsers,
          {
            ...data,
            id: Date.now(), // temporary id if backend doesn't return one
            createdAt: new Date().toISOString().split("T")[0],
          },
        ];
      }

      setUsers(updatedUsers);
      setEditingUser(null);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = (id) => {
    if (window.confirm("Delete this user?")) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
      // Optionally, call DELETE backend endpoint here
    }
  };

  return (
    <div className="min-h-screen px-4 py-6 md:ml-64">
      {/* HEADER */}
      <div className="bg-white border rounded-xl p-4 sm:p-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">User Management</h1>
          <p className="text-xs text-gray-500">{filteredUsers.length} total users</p>
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>

        <button
          onClick={() => setEditingUser({})}
          className="h-10 w-10 sm:w-auto sm:px-4 sm:py-2 rounded-md bg-[#3C498B] text-white flex items-center justify-center gap-2 text-sm hover:bg-[#3C498B]"
        >
          <FiPlus />
          <span className="hidden sm:inline">Add User</span>
        </button>
      </div>

      {/* FILTERS */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            className="w-full pl-10 pr-3 py-2 text-sm border rounded-lg"
            placeholder="Search users"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="border rounded-lg px-3 py-2 text-sm"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="All">All Roles</option>
          {ROLES.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
      </div>

      {/* TABLE */}
      <div className="hidden md:block mt-6 bg-white border rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Created</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="font-medium">{u.name}</div>
                  <div className="text-xs text-gray-500">{u.email}</div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${roleColors[u.role]}`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3">{u.createdAt}</td>
                <td className="px-4 py-3 flex justify-end gap-2">
                  <button
                    onClick={() => setEditingUser(u)}
                    className="p-2 rounded hover:bg-gray-100"
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => deleteUser(u.id)}
                    className="p-2 rounded hover:bg-red-100 text-red-600"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden mt-6 space-y-3">
        {filteredUsers.map((u) => (
          <div key={u.id} className="bg-white border rounded-xl p-4 space-y-2">
            <div className="font-semibold">{u.name}</div>
            <div className="text-xs text-gray-500">{u.email}</div>
            <span
              className={`inline-block text-xs px-2 py-1 rounded-full ${roleColors[u.role]}`}
            >
              {u.role}
            </span>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setEditingUser(u)} className="p-2 rounded bg-gray-100">
                <FiEdit size={14} />
              </button>
              <button
                onClick={() => deleteUser(u.id)}
                className="p-2 rounded bg-red-100 text-red-600"
              >
                <FiTrash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingUser && (
        <UserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={saveUser}
          loading={loading}
        />
      )}
    </div>
  );
}

// Modal Component
function UserModal({ user, onClose, onSave, loading }) {
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "Admin",
  });

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white w-full max-w-md rounded-xl p-5 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold">{user?.id ? "Edit User" : "Add User"}</h2>
          <button onClick={onClose}>
            <FiX />
          </button>
        </div>

        <input
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <select
          className="w-full border rounded-lg px-3 py-2 text-sm"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          {ROLES.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>

        <div className="flex justify-end gap-2 pt-3">
          <button
            onClick={onClose}
            className="px-3 py-2 text-sm border rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}