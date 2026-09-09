import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { USERS } from "../../data/users";
import { UserPlus, Pencil, Trash2 } from "lucide-react";
import "./UserManagement.css";

function CustomChartTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className="chart-tooltip">
      <p className="tooltip-label">{label}</p>
      <p className="tooltip-value">{payload[0].value} Users</p>
    </div>
  );
}

function UserManagement() {

  const [users, setUsers] = useState(USERS);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Total");
  const [roleFilter, setRoleFilter] = useState("All");

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "Content Creator",
    phone: "",
    location: "",
    bio: "",
    status: "Active",
  });
  const [editingUser, setEditingUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleAddUser = () => {

    const emailExists = users.some(
        (u) =>
            u.email === newUser.email &&
            (!isEditing || u.id !== editingUser.id)
        );

        if (emailExists) {
        alert("Email already exists!");
        return;
    }

    if (isEditing) {

        setUsers(
        users.map((u) =>
            u.id === editingUser.id
            ? {
                ...newUser,
                id: editingUser.id,
                }
            : u
        )
        );

    } else {

        const user = {
        id: users.length + 1,
        ...newUser,
        };

        setUsers([...users, user]);
    }

    setShowModal(false);
    setIsEditing(false);
    setEditingUser(null);

    setNewUser({
        name: "",
        email: "",
        password: "",
        role: "Content Creator",
        phone: "",
        location: "",
        bio: "",
        status: "Active",
    });
  };

  const handleDelete = (id) => {

    const confirmDelete = window.confirm(
        "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    setUsers(users.filter((user) => user.id !== id));
  };

  const statusData = useMemo(() => {
    const total = users.length;
    const active = users.filter((user) => user.status === "Active").length;
    const inactive = users.filter((user) => user.status !== "Active").length;

    return [
      { name: "Total", value: total, color: "#111827" },
      { name: "Active", value: active, color: "#b59f7d" },
      { name: "Inactive", value: inactive, color: "#6b7280" },
    ];
  }, [users]);

  const roleData = useMemo(() => {
    const filtered =
      selectedStatus === "Total"
        ? users
        : users.filter((user) =>
            selectedStatus === "Active"
              ? user.status === "Active"
              : user.status !== "Active"
          );
    const roles = [
      "Administrator",
      "Content Creator",
      "Business User",
      "Marketing Team",
    ];

    return roles.map((role) => ({
      role,
      count: filtered.filter((user) => user.role === role).length,
    }));
  }, [selectedStatus, users]);

  const handleExportCsv = () => {
    const headers = ["Name", "Email", "Role", "Phone", "Location", "Status"];
    const rows = filteredUsers.map((user) => [
      user.name,
      user.email,
      user.role,
      user.phone,
      user.location,
      user.status,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `user-management-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.role.toLowerCase().includes(search.toLowerCase());

    const matchesRole = roleFilter === "All" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (

    <div className="users-page">

      <div className="page-header">
        <div>
          <span className="eyebrow-text font-mono">
            ADMINISTRATION
          </span>

          <h1 className="page-title font-serif">
            User Management
          </h1>

          <p className="page-subtitle">
            Manage users, permissions and roles.
          </p>
        </div>
      </div>

      <div className="stats-container chart-grid">

        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h2>Status breakdown</h2>
              <p>Click a slice to update the role bar chart.</p>
            </div>
          </div>

          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={4}
                  isAnimationActive={true}
                  animationDuration={900}
                  animationEasing="ease-out"
                  onClick={(payload) => setSelectedStatus(payload.name)}
                >
                  {statusData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} cursor="pointer" />
                  ))}
                </Pie>
                <Tooltip content={<CustomChartTooltip />} cursor={false} wrapperStyle={{ outline: "none" }} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-meta">
            {statusData.map((entry) => (
              <button
                key={entry.name}
                className={`chart-pill ${selectedStatus === entry.name ? "is-selected" : ""}`}
                onClick={() => setSelectedStatus(entry.name)}
              >
                {entry.name} {entry.value}
              </button>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h2>{selectedStatus} role counts</h2>
              <p>Administrator, Content Creator, Business and Marketing users.</p>
            </div>
          </div>

          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={roleData} margin={{ top: 24, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis dataKey="role" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip content={<CustomChartTooltip />} cursor={false} wrapperStyle={{ outline: "none" }} />
                <Bar
                  dataKey="count"
                  fill="#111827"
                  radius={[8, 8, 0, 0]}
                  isAnimationActive={true}
                  animationDuration={900}
                  animationEasing="ease-out"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      <div className="toolbar toolbar-bottom">
        <div className="toolbar-search-row">
          <input
            type="text"
            placeholder="Search users by name, email or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-box"
          />

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="filter-select"
          >
            <option>All</option>
            <option>Administrator</option>
            <option>Business User</option>
            <option>Marketing Team</option>
            <option>Content Creator</option>
          </select>

          <div className="toolbar-action-group">
            <button className="filter-btn" onClick={handleExportCsv}>
              Export CSV
            </button>

            <button className="filter-btn clear" onClick={() => {
              setSearch("");
              setRoleFilter("All");
            }}>
              Clear
            </button>
          </div>
        </div>
      </div>

      <button className="floating-add-btn" onClick={() => setShowModal(true)}>
        <UserPlus size={18} />
        Add User
      </button>

      <div className="users-table">

        <div className="users-header font-mono">

          <span>Name</span>

          <span>Email</span>

          <span>Role</span>

          <span>Phone</span>

          <span>Status</span>

          <span>Actions</span>

        </div>

        {filteredUsers.map((user) => (

          <div
            className="users-row"
            key={user.id}
          >

            <span>{user.name}</span>

            <span>{user.email}</span>

            <span>{user.role}</span>

            <span>{user.phone}</span>

            <span className={`status-pill ${user.status === "Active" ? "active" : "inactive"}`}>
              {user.status}
            </span>

            <div className="action-buttons">

              <button
                className="icon-btn"
                onClick={() => {
                    setEditingUser(user);
                    setNewUser(user);
                    setIsEditing(true);
                    setShowModal(true);
                }}
              >

                <Pencil size={16} />

              </button>

              <button
                className="icon-btn delete"
                onClick={() => handleDelete(user.id)}
              >

                <Trash2 size={16} />

              </button>

            </div>

          </div>

        ))}

      </div>

      {showModal && (

        <div className="modal-overlay">

        <div className="user-modal">

            <h2>{isEditing ? "Edit User" : "Add User"}</h2>

            <input
            placeholder="Name"
            value={newUser.name}
            onChange={(e) =>
                setNewUser({
                ...newUser,
                name: e.target.value,
                })
            }
            />

            <input
            placeholder="Email"
            value={newUser.email}
            onChange={(e) =>
                setNewUser({
                ...newUser,
                email: e.target.value,
                })
            }
            />

            <input
            placeholder="Password"
            type="password"
            value={newUser.password}
            onChange={(e) =>
                setNewUser({
                ...newUser,
                password: e.target.value,
                })
            }
            />

            <select
              value={newUser.role}
              onChange={(e) =>
                setNewUser({
                  ...newUser,
                  role: e.target.value,
                })
              }
            >
              <option>Administrator</option>
              <option>Business User</option>
              <option>Marketing Team</option>
              <option>Content Creator</option>
            </select>

            <select
              value={newUser.status}
              onChange={(e) =>
                setNewUser({
                  ...newUser,
                  status: e.target.value,
                })
              }
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>

            <input
            placeholder="Phone"
            value={newUser.phone}
            onChange={(e) =>
                setNewUser({
                ...newUser,
                phone: e.target.value,
                })
            }
            />

            <input
            placeholder="Location"
            value={newUser.location}
            onChange={(e) =>
                setNewUser({
                ...newUser,
                location: e.target.value,
                })
            }
            />

            <textarea
            placeholder="Bio"
            value={newUser.bio}
            onChange={(e) =>
                setNewUser({
                ...newUser,
                bio: e.target.value,
                })
            }
            />

            <div className="modal-buttons">

            <button
                onClick={() => setShowModal(false)}
            >
                Cancel
            </button>

            <button
                className="sp-dark-btn"
                onClick={handleAddUser}
            >
                {isEditing ? "Update" : "Save"}
            </button>

            </div>

        </div>

        </div>

        )}

    </div>

  );

}

export default UserManagement;