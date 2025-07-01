"use client"

import { useEffect, useState, useRef } from "react"
import { Building2, Ticket, Clock, CheckCircle2, XCircle, Activity, BarChart3, Bell } from "lucide-react"
import { useDeptAuth } from "../../context/DeptAuthContext"
import { getDepartmentTickets, getLoggedInDepartmentalAdmin } from "../../service/deptAuthService"
import { useNavigate } from "react-router-dom"
import React from "react"
import io from "socket.io-client"

export default function DepartmentDashboard() {
  const { deptAdmin: contextDeptAdmin } = useDeptAuth()
  const [deptAdmin, setDeptAdmin] = useState(contextDeptAdmin)
  const [loading, setLoading] = useState(true)
  const [tickets, setTickets] = useState([])
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const [activeView, setActiveView] = useState("cards")
  const [notification, setNotification] = useState(null)
  const [connectionStatus, setConnectionStatus] = useState("disconnected")
  const socketRef = useRef(null)

  // Calculate stats from tickets data
  const stats = {
    totalTickets: tickets.length,
    pendingTickets: tickets.filter((ticket) => ticket.status === "pending").length,
    inProgressTickets: tickets.filter((ticket) => ticket.status === "in_progress").length,
    resolvedTickets: tickets.filter((ticket) => ticket.status === "resolved").length,
    revokedTickets: tickets.filter((ticket) => ticket.status === "revoked").length,
  }

  // Get recent tickets (last 5)
  const recentTickets = tickets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)

  const ticketData = [
    {
      name: "Pending",
      value: stats.pendingTickets,
      color: "#3B82F6",
      gradient: "from-blue-400 to-blue-600",
      icon: Clock,
      bgGradient: "from-blue-50 to-blue-100",
      textColor: "text-blue-700",
      description: "Awaiting assignment",
    },
    {
      name: "In Progress",
      value: stats.inProgressTickets,
      color: "#F59E0B",
      gradient: "from-amber-400 to-orange-500",
      icon: Activity,
      bgGradient: "from-amber-50 to-orange-100",
      textColor: "text-orange-700",
      description: "Currently being worked on",
    },
    {
      name: "Resolved",
      value: stats.resolvedTickets,
      color: "#10B981",
      gradient: "from-emerald-400 to-green-500",
      icon: CheckCircle2,
      bgGradient: "from-emerald-50 to-green-100",
      textColor: "text-green-700",
      description: "Successfully completed",
    },
    {
      name: "Revoked",
      value: stats.revokedTickets,
      color: "#EF4444",
      gradient: "from-red-400 to-red-600",
      icon: XCircle,
      bgGradient: "from-red-50 to-red-100",
      textColor: "text-red-700",
      description: "Cancelled or rejected",
    },
  ]

  // Helper to get building name from location (handles both string and object)
  const getBuildingName = (building) => (typeof building === "string" ? building : building?.name || "Unknown Building")

  // Always sync deptAdmin with context
  useEffect(() => {
    setDeptAdmin(contextDeptAdmin)
  }, [contextDeptAdmin])

  // Fetch full admin info first
  useEffect(() => {
    async function fetchFullAdmin() {
      try {
        const result = await getLoggedInDepartmentalAdmin()
        if (result.success && result.data) {
          const adminData = result.data.admin || result.data
          console.log("Fetched full admin data:", adminData)
          setDeptAdmin(adminData)
        }
      } catch (error) {
        console.error("Error fetching admin data:", error)
      }
    }

    fetchFullAdmin()
  }, [])

  // WebSocket connection effect - runs after we have full admin data
  useEffect(() => {
    if (!deptAdmin || !deptAdmin.department) {
      console.log("DeptAdmin or department not available yet, skipping WebSocket setup")
      return
    }

    // Clean up existing connection
    if (socketRef.current) {
      socketRef.current.disconnect()
      socketRef.current = null
    }

    console.log("Setting up WebSocket connection for admin:", deptAdmin)

    const socket = io("http://localhost:5000", {
      transports: ["polling", "websocket"],
      withCredentials: true,
      timeout: 20000,
    })

    socketRef.current = socket

    // Connection event handlers
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id)
      setConnectionStatus("connected")

      // Determine room IDs to join
      const roomsToJoin = []

      // Always join the department ID room (primary room for notifications)
      if (typeof deptAdmin.department === "object" && deptAdmin.department._id) {
        roomsToJoin.push(deptAdmin.department._id.toString())
      }

      // Also join department name room for compatibility
      const departmentName = typeof deptAdmin.department === "object" ? deptAdmin.department.name : deptAdmin.department

      if (departmentName) {
        roomsToJoin.push(`department-${departmentName.toLowerCase()}`)
      }

      // For Network Engineers, also join location-specific rooms
      if (deptAdmin.isNetworkEngineer && deptAdmin.locations?.length > 0) {
        deptAdmin.locations.forEach((location) => {
          const buildingId = typeof location.building === "object" ? location.building._id : location.building
          if (buildingId && location.floor !== undefined) {
            roomsToJoin.push(`network-${buildingId}-${location.floor}`)
          }
        })
      }

      console.log("Joining rooms:", roomsToJoin)

      // Join all relevant rooms
      roomsToJoin.forEach((room) => {
        socket.emit("join-room", room)
      })

      // Test echo
      socket.emit("test-echo", "hello from dashboard frontend")
    })

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error)
      setConnectionStatus("error")
    })

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason)
      setConnectionStatus("disconnected")
    })

    socket.on("room-joined", (data) => {
      console.log("Successfully joined room:", data)
      setConnectionStatus("connected-room")
    })

    socket.on("test-echo", (msg) => {
      console.log("Echo from backend:", msg)
    })

    // New comment notification handler
    socket.on("new-comment", (data) => {
      console.log("Received new-comment event:", data)

      setNotification({
        message: `New comment from ${data.employeeName || "Employee"} on: ${data.title}`,
        ticketId: data.ticketId,
        timestamp: new Date().toISOString(),
      })

      // Auto-dismiss notification after 10 seconds
      setTimeout(() => {
        setNotification(null)
      }, 10000)

      // Refresh tickets to show updated data
      fetchTickets()
    })

    // New ticket notification handler
    socket.on("new-ticket", (data) => {
      console.log("Received new-ticket event:", data)

      setNotification({
        message: `New ticket raised: ${data.title} (Priority: ${data.priority})`,
        ticketId: data.ticketId,
        timestamp: new Date().toISOString(),
      })

      // Auto-dismiss notification after 10 seconds
      setTimeout(() => {
        setNotification(null)
      }, 10000)

      // Refresh tickets to show updated data
      fetchTickets()
    })

    return () => {
      if (socketRef.current) {
        console.log("Cleaning up socket connection")
        socketRef.current.disconnect()
        socketRef.current = null
      }
      setConnectionStatus("disconnected")
    }
  }, [deptAdmin]) // Dependency on full deptAdmin object

  // Fetch tickets
  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      setLoading(true)
      setError(null)

      const result = await getDepartmentTickets()

      if (result.success) {
        setTickets(result.tickets)
      } else {
        setError(result.message)
      }
    } catch (error) {
      console.error("Error fetching tickets:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Connection status indicator
  const ConnectionStatus = () => {
    const statusConfig = {
      connected: { color: "bg-green-500", text: "Connected", icon: "🟢" },
      "connected-room": { color: "bg-green-500", text: "Connected & Joined Room", icon: "✅" },
      disconnected: { color: "bg-red-500", text: "Disconnected", icon: "🔴" },
      error: { color: "bg-yellow-500", text: "Connection Error", icon: "⚠️" },
    }

    const config = statusConfig[connectionStatus] || statusConfig.disconnected

    return (
      <div className="flex items-center gap-2 text-sm">
        <div className={`w-2 h-2 rounded-full ${config.color}`}></div>
        <span className="text-gray-600">WebSocket: {config.text}</span>
      </div>
    )
  }

  function ViewToggle() {
    return (
      <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
        {[
          { id: "cards", label: "Cards", icon: BarChart3 },
          { id: "wave", label: "Wave", icon: Activity },
        ].map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setActiveView(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
              activeView === id ? "bg-white shadow-md text-blue-600 font-medium" : "text-gray-600 hover:text-gray-800"
            }`}
          >
            {React.createElement(icon, { size: 18 })}
            {label}
          </button>
        ))}
      </div>
    )
  }

  function CardsView() {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {ticketData.map((item) => {
          const percentage = stats.totalTickets ? ((item.value / stats.totalTickets) * 100).toFixed(1) : 0
          const Icon = item.icon
          return (
            <div
              key={item.name}
              className={`relative overflow-hidden bg-gradient-to-br ${item.bgGradient} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group cursor-pointer`}
            >
              <div className="absolute inset-0 opacity-10">
                <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-white/30"></div>
                <div className="absolute -right-8 top-12 w-12 h-12 rounded-full bg-white/20"></div>
              </div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 bg-gradient-to-r ${item.gradient} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="text-white" size={24} />
                  </div>
                  <div className={`text-right ${item.textColor}`}>
                    <div className="text-xs font-medium opacity-75">{percentage}%</div>
                  </div>
                </div>
                <div className="mb-2">
                  <h3 className={`text-3xl font-bold ${item.textColor} mb-1`}>{item.value}</h3>
                  <p className={`text-sm font-semibold ${item.textColor} mb-1`}>{item.name}</p>
                  <p className={`text-xs ${item.textColor} opacity-75`}>{item.description}</p>
                </div>
                <div className="w-full bg-white/30 rounded-full h-2 mt-4">
                  <div
                    className={`h-2 bg-gradient-to-r ${item.gradient} rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  function WaveView() {
    return (
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-8">
        <div className="mb-8 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Ticket Flow Analysis</h3>
          <p className="text-gray-600">Interactive wave representation of ticket distribution</p>
        </div>
        <div className="relative h-64 flex items-end justify-center gap-4">
          {ticketData.map((item) => {
            const maxVal = Math.max(...ticketData.map((d) => d.value))
            const height = maxVal ? (item.value / maxVal) * 200 : 0
            const Icon = item.icon
            return (
              <div key={item.name} className="flex flex-col items-center group cursor-pointer">
                <div
                  className={`relative bg-gradient-to-t ${item.gradient} rounded-t-2xl transition-all duration-700 ease-out hover:scale-105 shadow-lg`}
                  style={{ width: "80px", height: `${height}px` }}
                >
                  <div
                    className={`absolute -top-6 left-1/2 transform -translate-x-1/2 p-2 bg-gradient-to-r ${item.gradient} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="text-white" size={20} />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{item.value}</span>
                  </div>
                  <div className="absolute inset-0 bg-white/20 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="mt-4 text-center">
                  <p className={`font-semibold text-sm ${item.textColor}`}>{item.name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.totalTickets ? ((item.value / stats.totalTickets) * 100).toFixed(1) : 0}%
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4B2D87]"></div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-4 animate-slide-in border-l-4 border-blue-300">
          <Bell className="text-blue-200" size={20} />
          <div className="flex-1">
            <p className="font-medium">{notification.message}</p>
            <p className="text-xs text-blue-200 mt-1">{new Date(notification.timestamp).toLocaleTimeString()}</p>
          </div>
          <div className="flex gap-2">
            <button
              className="bg-white/20 px-3 py-1 rounded text-sm hover:bg-white/30 transition"
              onClick={() => {
                setNotification(null)
                navigate(`/dept/tickets/${notification.ticketId}`)
              }}
            >
              View
            </button>
            <button
              className="bg-white/20 px-3 py-1 rounded text-sm hover:bg-white/30 transition"
              onClick={() => setNotification(null)}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">Error: {error}</p>
        </div>
      )}

      {/* Welcome Section with Connection Status */}
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          Welcome, <span>{deptAdmin?.name || "Department Admin"}</span>
        </h1>
        <ConnectionStatus />
      </div>

      {/* Debug Info */}
      {deptAdmin && (
        <div className="mb-4 p-3 bg-gray-100 rounded-lg text-sm">
          <p>
            <strong>Department:</strong>{" "}
            {typeof deptAdmin.department === "object" ? deptAdmin.department.name : deptAdmin.department}
          </p>
          <p>
            <strong>Department ID:</strong>{" "}
            {typeof deptAdmin.department === "object" ? deptAdmin.department._id : "N/A"}
          </p>
          <p>
            <strong>Is Network Engineer:</strong> {deptAdmin.isNetworkEngineer ? "Yes" : "No"}
          </p>
          {deptAdmin.locations && (
            <p>
              <strong>Locations:</strong> {deptAdmin.locations.length}
            </p>
          )}
        </div>
      )}

      {/* Network Engineer Locations Section */}
      {deptAdmin?.isNetworkEngineer && deptAdmin.locations?.length > 0 && (
        <section className="mb-10">
          <header className="mb-6 flex items-center gap-2">
            <Building2 className="text-gray-500" size={22} />
            <h2 className="text-2xl font-semibold text-gray-800 tracking-wide">Assigned Locations</h2>
          </header>
          <div className="overflow-x-auto rounded-xl shadow border border-gray-200 bg-white">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-300 text-gray-700">
                  <th className="px-6 py-3 text-left font-semibold rounded-tl-xl">Building</th>
                  <th className="px-6 py-3 text-left font-semibold">Floor</th>
                  <th className="px-6 py-3 text-left font-semibold rounded-tr-xl">Labs</th>
                </tr>
              </thead>
              <tbody>
                {deptAdmin.locations.map((loc, idx) => (
                  <tr key={idx} className="even:bg-gray-50 hover:bg-gray-100 transition-colors">
                    <td className="px-6 py-3 font-medium text-gray-900">{getBuildingName(loc.building)}</td>
                    <td className="px-6 py-3 text-gray-800">{loc.floor}</td>
                    <td className="px-6 py-3">
                      {loc.labs && loc.labs.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {loc.labs.map((lab, i) => (
                            <span
                              key={i}
                              className="inline-block bg-gray-200 text-gray-800 px-2 py-0.5 rounded-full text-xs font-semibold"
                            >
                              Lab {lab}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">No labs assigned</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-purple-100 rounded-xl shadow-lg border border-purple-300 p-6 transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Total Tickets</p>
              <h3 className="text-3xl font-bold text-purple-800 mt-1">{stats.totalTickets}</h3>
            </div>
            <div className="p-3 bg-purple-500 rounded-xl shadow-lg">
              <Ticket className="text-white" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-blue-100 rounded-xl shadow-lg border border-blue-300 p-6 transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Pending Tickets</p>
              <h3 className="text-3xl font-bold text-blue-800 mt-1">{stats.pendingTickets}</h3>
            </div>
            <div className="p-3 bg-blue-500 rounded-xl shadow-lg">
              <Clock className="text-white" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-yellow-100 rounded-xl shadow-lg border border-yellow-300 p-6 transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 font-medium">In Progress</p>
              <h3 className="text-3xl font-bold text-yellow-800 mt-1">{stats.inProgressTickets}</h3>
            </div>
            <div className="p-3 bg-yellow-400 rounded-xl shadow-lg">
              <Activity className="text-white" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-green-100 rounded-xl shadow-lg border border-green-300 p-6 transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Resolved Tickets</p>
              <h3 className="text-3xl font-bold text-green-800 mt-1">{stats.resolvedTickets}</h3>
            </div>
            <div className="p-3 bg-green-500 rounded-xl shadow-lg">
              <CheckCircle2 className="text-white" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-red-100 rounded-xl shadow-lg border border-red-300 p-6 transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">Revoked Tickets</p>
              <h3 className="text-3xl font-bold text-red-800 mt-1">{stats.revokedTickets}</h3>
            </div>
            <div className="p-3 bg-red-500 rounded-xl shadow-lg">
              <XCircle className="text-white" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tickets */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-shadow duration-300 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="p-2 bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg mr-3">
              <Ticket className="text-white" size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Recent Tickets</h2>
          </div>
          <button
            onClick={fetchTickets}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Refresh
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Title</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Created At</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Raised By</th>
              </tr>
            </thead>
            <tbody>
              {recentTickets.length > 0 ? (
                recentTickets.map((ticket) => (
                  <tr
                    key={ticket._id}
                    className="border-b border-gray-100 hover:bg-blue-50 transition-colors duration-200 cursor-pointer"
                    onClick={() => navigate(`/dept/tickets/${ticket._id}`)}
                    tabIndex={0}
                    aria-label={`View details for ticket ${ticket.title}`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") navigate(`/dept/tickets/${ticket._id}`)
                    }}
                  >
                    <td className="py-4 px-4 text-sm text-gray-900 font-medium">{ticket.title}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          ticket.status === "pending"
                            ? "bg-blue-100 text-blue-800 border border-blue-300"
                            : ticket.status === "in_progress"
                              ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                              : ticket.status === "resolved"
                                ? "bg-green-100 text-green-800 border border-green-300"
                                : "bg-red-100 text-red-800 border border-red-300"
                        }`}
                      >
                        {ticket.status === "in_progress"
                          ? "In Progress"
                          : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">{ticket.raised_by?.name || "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <Ticket className="text-gray-300 mb-2" size={48} />
                      <p className="text-lg font-medium">No tickets found</p>
                      <p className="text-sm">Tickets will appear here once they are created</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Distribution Analysis */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center mb-8 w-full">
        <div className="mb-8 w-full">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Ticket Distribution Analytics</h2>
          <p className="text-gray-600">Choose your preferred visualization style</p>
        </div>
        <ViewToggle />
        <div className="transition-all duration-500 ease-in-out w-full">
          {activeView === "cards" && <CardsView />}
          {activeView === "wave" && <WaveView />}
        </div>
        <div className="mt-12 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 w-full">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {(stats.totalTickets ? (stats.resolvedTickets / stats.totalTickets) * 100 : 0).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Resolution Rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{stats.pendingTickets + stats.inProgressTickets}</div>
              <div className="text-sm text-gray-600">Active Tickets</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{stats.resolvedTickets}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
