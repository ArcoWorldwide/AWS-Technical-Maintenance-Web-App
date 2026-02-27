import { useState, useMemo, useEffect } from "react";
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiX } from "react-icons/fi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Role labels (Display)
const ROLES = ["Superadmin", "Admin", "Technical", "COO", "MD", "QHSE"];

// Backend roles are lowercase
const normalizeRole = (role) => {
  if (!role) return "";
  return role.charAt(0).toUpperCase() + role.slice(1);
};

const roleColors = {
  Superadmin: "bg-purple-100 text-purple-700",
  Admin: "bg-blue-100 text-blue-700",
  Technical: "bg-amber-100 text-amber-700",
  COO: "bg-green-100 text-green-700",
  MD: "bg-indigo-100 text-indigo-700",
  QHSE: "bg-rose-100 text-rose-700",
};

export default function SuperAdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // ===============================
  // FETCH USERS
  // ===============================
  const fetchUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/auth/users/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch users");

      const data = await res.json();

      if (!Array.isArray(data)) {
        setUsers([]);
        return;
      }

      // Normalize roles and id
      const formatted = data.map((u) => ({
        ...u,
        id: u._id,
        role: normalizeRole(u.role),
      }));

      setUsers(formatted);
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchUsers();
  }, [token]);

  // ===============================
  // FILTER USERS
  // ===============================
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase());

      const matchesRole = roleFilter === "All" || u.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  // ===============================
  // CREATE OR UPDATE
  // ===============================
const saveUser = async (form) => {
  setLoading(true);
  setError("");

  try {
    const payload = {
      name: form.name,
      email: form.email,
      role: form.role.toLowerCase(),
    };

    let res;

    if (editingUser?.id) {
      // UPDATE (assuming PATCH exists)
      res = await fetch(
        `${API_BASE_URL}/auth/users/${editingUser.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
    } else {
      // ✅ CORRECT CREATE ROUTE
      res = await fetch(
        `${API_BASE_URL}/auth/users/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
    }

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.message || `HTTP ${res.status}`);
    }

    await fetchUsers();
    setEditingUser(null);
  } catch (err) {
    console.error("SAVE ERROR:", err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  // ===============================
  // DELETE
  // ===============================
  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/auth/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete user");

      await fetchUsers();
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-6 md:ml-64">
      <div className="bg-white border rounded-xl p-6 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold">User Management</h1>
          <p className="text-xs text-gray-500">
            {filteredUsers.length} total users
          </p>
          {error && (
            <p className="text-red-500 text-xs mt-2">{error}</p>
          )}
        </div>

        <button
          onClick={() => setEditingUser({})}
          className="px-4 py-2 bg-[#3C498B] text-white rounded-md flex items-center gap-2"
        >
          <FiPlus /> Add User
        </button>
      </div>

      {/* TABLE */}
      <div className="mt-6 bg-white border rounded-xl overflow-x-auto">
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
              <tr key={u.id} className="border-t">
                <td className="px-4 py-3">
                  <div className="font-medium">{u.name}</div>
                  <div className="text-xs text-gray-500">
                    {u.email}
                  </div>
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      roleColors[u.role] || "bg-gray-100"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>

                <td className="px-4 py-3">
                  {u.createdAt
                    ? new Date(u.createdAt).toLocaleDateString()
                    : "-"}
                </td>

                <td className="px-4 py-3 flex justify-end gap-2">
                  <button
                    onClick={() => setEditingUser(u)}
                    className="p-2 hover:bg-gray-100 rounded"
                  >
                    <FiEdit />
                  </button>

                  <button
                    onClick={() => deleteUser(u.id)}
                    className="p-2 hover:bg-red-100 text-red-600 rounded"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

// ===============================
// MODAL
// ===============================
function UserModal({ user, onClose, onSave, loading }) {
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "Admin",
  });

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-xl p-5 space-y-4">
        <h2 className="font-semibold text-lg">
          {user?.id ? "Edit User" : "Add User"}
        </h2>

        <input
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Full Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <select
          className="w-full border rounded-lg px-3 py-2"
          value={form.role}
          onChange={(e) =>
            setForm({ ...form, role: e.target.value })
          }
        >
          {ROLES.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>

        <div className="flex justify-end gap-2 pt-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={() => onSave(form)}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}