"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface User {
  id: string
  name: string
  email: string
}

export default function SuperAdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)

  const [form, setForm] = useState({ name: "", email: "", password: "", role: "ADMIN" })
  const [formError, setFormError] = useState("")
  const [formSuccess, setFormSuccess] = useState("")

  // Redirect if not authenticated or not superadmin
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  useEffect(() => {
    if (session && session.user.role !== 'SUPERADMIN') {
      toast.error("Access denied")
      router.push("/")
    }
  }, [session, router])

  // Fetch users for user management section
  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/users")
      if (!res.ok) throw new Error()
      const data = await res.json()
      setUsers(data.users)
    } catch {
      toast.error("Failed to fetch users")
    } finally {
      setLoading(false)
    }
  }

  // Load users when user management section is active
  useEffect(() => {
    if (activeSection === "userManagement") fetchUsers()
  }, [activeSection])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setFormError("")
    setFormSuccess("")
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setFormError(data.message || "Failed to add user")
      } else {
        setFormSuccess("User added successfully")
        setForm({ name: "", email: "", password: "", role: "admin" }) // Reset form
        fetchUsers()
      }
    } catch {
      setFormError("Failed to add user")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" })
      if (!res.ok) {
        toast.error("Failed to delete user")
      } else {
        toast.success("User deleted")
        fetchUsers()
      }
    } catch {
      toast.error("Failed to delete user")
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading") return <div>Loading...</div>

  return (
    <div className="max-w-7xl mx-auto p-8">
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
        <div>Welcome, {session?.user.name}</div>
      </header>

      <nav className="mb-8 flex gap-6 overflow-auto">
        {[
          { key: "userManagement", label: "User Management" },
          { key: "systemSettings", label: "System Configuration" },
          { key: "erpAudit", label: "ERP Audit Panel" },
          { key: "advancedMonitoring", label: "Advanced Monitoring" },
          { key: "productTracking", label: "Product Tracking" },
        ].map(section => (
          <button
            key={section.key}
            onClick={() => setActiveSection(section.key)}
            className={`px-4 py-2 rounded border ${
              activeSection === section.key ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
          >
            {section.label}
          </button>
        ))}
      </nav>

      <main>
        {activeSection === null && (
          <p className="text-gray-600">Select a section to manage.</p>
        )}

        {activeSection === "userManagement" && (
          <section>
            <h2 className="text-2xl font-semibold mb-4">User Management</h2>

            {/* Add User Form */}
            <form onSubmit={handleAddUser} className="flex flex-col gap-4 max-w-md mb-8 border p-6 rounded shadow">
              <h3 className="text-xl font-semibold mb-2">Add Admin / Manager</h3>
              <input
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                required
                className="p-2 border rounded"
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                className="p-2 border rounded"
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className="p-2 border rounded"
              />
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="p-2 border rounded"
              >
                <option value="ADMIN">Admin</option>
                <option value="MANAGER">Manager</option>
              </select>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Adding..." : "Add User"}
              </button>
              {formError && <p className="text-red-600">{formError}</p>}
              {formSuccess && <p className="text-green-600">{formSuccess}</p>}
            </form>

            {/* User List */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Manage Users</h3>
              {loading && <p>Loading users...</p>}
              {!loading && users.length === 0 && <p>No users found.</p>}
              <ul className="space-y-3">
                {users.map(user => (
                  <li
                    key={user.id}
                    className="flex justify-between items-center border p-3 rounded"
                  >
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={loading}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {activeSection === "systemSettings" && (
          <section>
            <h2 className="text-2xl font-semibold mb-4">System Configuration</h2>
            <p className="text-gray-600">Configure API keys, security settings, session timeouts, and backups here.</p>
            {/* Add actual forms or components as needed */}
          </section>
        )}

        {activeSection === "erpAudit" && (
          <section>
            <h2 className="text-2xl font-semibold mb-4">ERP Audit Panel</h2>
            <p className="text-gray-600">Upload and review ERP logs, assessment reports, and track optimization progress.</p>
            {/* Add ERP audit UI here */}
          </section>
        )}

        {activeSection === "advancedMonitoring" && (
          <section>
            <h2 className="text-2xl font-semibold mb-4">Advanced Monitoring</h2>
            <p className="text-gray-600">View system error logs, API call monitoring, performance and security audit analytics.</p>
            {/* Add monitoring UI here */}
          </section>
        )}

        {activeSection === "productTracking" && (
          <section>
            <h2 className="text-2xl font-semibold mb-4">Product Tracking Management</h2>
            <p className="text-gray-600">Configure tracking rules, monitor order status updates, and generate tracking reports.</p>
            {/* Add product tracking UI here */}
          </section>
        )}
      </main>
    </div>
  )
}
