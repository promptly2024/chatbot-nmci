"use client"

import UserManagement from "@/components/UserManagement"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function SuperAdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeSection, setActiveSection] = useState<string | null>(null)

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
        
        {activeSection === "userManagement" && ( <UserManagement /> )}

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
