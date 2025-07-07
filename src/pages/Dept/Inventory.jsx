"use client"

import { useState, useEffect } from "react"
import {
  Plus,
  Monitor,
  Cpu,
  Mouse,
  Keyboard,
  Building2,
  User,
  Mail,
  Hash,
  MapPin,
  Shield,
  Usb,
  HardDrive,
  AlertCircle,
  Copy,
  Zap,
  X,
  Save,
  Trash2,
  Package,
  Settings,
  Info,
} from "lucide-react"
import { getAllBuildings } from "../../service/adminAuthService"

const initialInventory = {
  tag: "",
  systemName: "",
  systemType: "Desktop",
  ownerName: "",
  ownerEmail: "",
  building: "",
  floor: "",
  labNumber: "",
  department: "",
  location: "",
  ipAddress: "",
  macAddress: "",
  usbStatus: "",
  hasAntivirus: "",
  desktopPolicy: "",
  remark: "",
  components: [],
}

const systemTypes = ["Desktop", "Server"]
const defaultComponentTypes = ["CPU", "Monitor", "Mouse", "Keyboard", "Printer", "Scanner"]
const usbOptions = ["Enabled", "Disabled"]
const yesNoOptions = ["Yes", "No"]

const componentIcons = {
  CPU: Cpu,
  Monitor: Monitor,
  Mouse: Mouse,
  Keyboard: Keyboard,
  Speaker: HardDrive,
  Webcam: HardDrive,
  Printer: HardDrive,
  UPS: Zap,
  Scanner: HardDrive,
  Default: Package,
}

// Customizable component sets for quick addition
const defaultComponentSets = {
  "Desktop Setup": [
    { componentType: "CPU", modelNumber: "", manufacturer: "" },
    { componentType: "Monitor", modelNumber: "", manufacturer: "" },
    { componentType: "Mouse", modelNumber: "", manufacturer: "" },
    { componentType: "Keyboard", modelNumber: "", manufacturer: "" },
  ],
  "Laptop Setup": [
    { componentType: "CPU", modelNumber: "", manufacturer: "" },
    { componentType: "Mouse", modelNumber: "", manufacturer: "" },
  ],
}

function InventoryManagement() {
  const [inventory, setInventory] = useState(initialInventory)
  const [allSystems, setAllSystems] = useState([])
  const [showBulkAdd, setShowBulkAdd] = useState(false)
  const [bulkComponents, setBulkComponents] = useState([])
  const [successMsg, setSuccessMsg] = useState("")
  const [showAddSystemForm, setShowAddSystemForm] = useState(false)
  
  // Building/Floor/Lab state
  const [buildings, setBuildings] = useState([])
  const [floors, setFloors] = useState([])
  const [labs, setLabs] = useState([])
  
  // Customizable component sets
  const [componentSets, setComponentSets] = useState(defaultComponentSets)
  const [showCustomizeSets, setShowCustomizeSets] = useState(false)
  const [newSetName, setNewSetName] = useState("")
  const [newSetComponents, setNewSetComponents] = useState([{ componentType: "", modelNumber: "", manufacturer: "" }])
  
  // Edit existing set functionality
  const [editingSet, setEditingSet] = useState(null)
  const [editSetName, setEditSetName] = useState("")
  const [editSetComponents, setEditSetComponents] = useState([])
  const [showOtherInput, setShowOtherInput] = useState({})
  const [otherComponentName, setOtherComponentName] = useState("")

  const showSuccess = (message) => {
    setSuccessMsg(message)
    setTimeout(() => setSuccessMsg(""), 4000)
  }

  // Fetch buildings on component mount
  useEffect(() => {
    fetchBuildings()
  }, [])

  const fetchBuildings = async () => {
    try {
      const buildingsData = await getAllBuildings()
      setBuildings(buildingsData)
    } catch (error) {
      console.error('Error fetching buildings:', error)
    }
  }

  // Update floors when building changes
  useEffect(() => {
    if (inventory.building) {
      const selectedBuilding = buildings.find(b => b._id === inventory.building)
      if (selectedBuilding && selectedBuilding.floors) {
        const availableFloors = selectedBuilding.floors.map(f => f.floor.toString())
        setFloors(availableFloors)
        setInventory(prev => ({ ...prev, floor: "", labNumber: "" }))
        setLabs([])
      }
    } else {
      setFloors([])
      setLabs([])
    }
  }, [inventory.building, buildings])

  // Update labs when floor changes
  useEffect(() => {
    if (inventory.building && inventory.floor) {
      const selectedBuilding = buildings.find(b => b._id === inventory.building)
      if (selectedBuilding && selectedBuilding.floors) {
        const selectedFloor = selectedBuilding.floors.find(f => f.floor.toString() === inventory.floor)
        if (selectedFloor && selectedFloor.labs) {
          setLabs(selectedFloor.labs)
          setInventory(prev => ({ ...prev, labNumber: "" }))
        }
      }
    } else {
      setLabs([])
    }
  }, [inventory.building, inventory.floor, buildings])

  const handleInventoryChange = (field, value) => {
    setInventory((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddComponentSet = (setName) => {
    const componentSet = componentSets[setName]
    setBulkComponents(componentSet.map((comp) => ({ ...comp, tag: "", serialNumber: "", remark: "" })))
    setShowBulkAdd(true)
  }

  const handleBulkComponentChange = (index, field, value) => {
    setBulkComponents((prev) => prev.map((comp, i) => (i === index ? { ...comp, [field]: value } : comp)))
  }

  const handleAddBulkComponents = () => {
    const validComponents = bulkComponents.filter((comp) => comp.tag && comp.componentType)
    if (validComponents.length === 0) {
      alert("Please fill in at least one component with tag and type")
      return
    }

    setInventory((prev) => ({
      ...prev,
      components: [...prev.components, ...validComponents],
    }))

    setBulkComponents([])
    setShowBulkAdd(false)
    showSuccess(`${validComponents.length} components added to system!`)
  }

  const handleAddSystem = (e) => {
    e.preventDefault()
    if (!inventory.tag || !inventory.systemName || !inventory.building || !inventory.floor || !inventory.labNumber) {
      alert("Please fill in all required fields including building, floor, and lab")
      return
    }
    setAllSystems((prev) => [...prev, inventory])
    setInventory(initialInventory)
    setShowAddSystemForm(false)
    showSuccess("System added to inventory!")
  }

  const removeComponent = (index) => {
    setInventory((prev) => ({
      ...prev,
      components: prev.components.filter((_, i) => i !== index),
    }))
  }

  // Customizable component sets functions
  const addNewComponentToSet = () => {
    setNewSetComponents(prev => [...prev, { componentType: "", modelNumber: "", manufacturer: "" }])
  }

  const removeComponentFromSet = (index) => {
    setNewSetComponents(prev => prev.filter((_, i) => i !== index))
  }

  const handleComponentInSetChange = (index, field, value) => {
    setNewSetComponents(prev => prev.map((comp, i) => i === index ? { ...comp, [field]: value } : comp))
  }

  const saveCustomSet = () => {
    if (!newSetName.trim()) {
      alert("Please enter a set name")
      return
    }
    if (newSetComponents.length === 0) {
      alert("Please add at least one component")
      return
    }
    
    const validComponents = newSetComponents.filter(comp => comp.componentType.trim())
    if (validComponents.length === 0) {
      alert("Please specify component types")
      return
    }

    setComponentSets(prev => ({
      ...prev,
      [newSetName]: validComponents
    }))
    
    setNewSetName("")
    setNewSetComponents([{ componentType: "", modelNumber: "", manufacturer: "" }])
    setShowCustomizeSets(false)
    showSuccess(`Component set "${newSetName}" saved successfully!`)
  }

  const removeCustomSet = (setName) => {
    const newSets = { ...componentSets }
    delete newSets[setName]
    setComponentSets(newSets)
    showSuccess(`Component set "${setName}" removed!`)
  }

  // Edit existing set functions
  const addComponentToExistingSet = () => {
    setEditSetComponents(prev => [...prev, { componentType: "", modelNumber: "", manufacturer: "" }])
  }

  const removeComponentFromExistingSet = (index) => {
    setEditSetComponents(prev => prev.filter((_, i) => i !== index))
  }

  const handleComponentInExistingSetChange = (index, field, value) => {
    setEditSetComponents(prev => prev.map((comp, i) => i === index ? { ...comp, [field]: value } : comp))
  }

  // Handle "Other" component type selection
  const handleComponentTypeChange = (index, value, isEditing = false) => {
    if (value === "Other") {
      setShowOtherInput(prev => ({ ...prev, [index]: true }))
      setOtherComponentName("")
    } else {
      setShowOtherInput(prev => ({ ...prev, [index]: false }))
      if (isEditing) {
        handleComponentInExistingSetChange(index, "componentType", value)
      } else {
        handleComponentInSetChange(index, "componentType", value)
      }
    }
  }

  // Save custom component name
  const saveOtherComponentName = (index, isEditing = false) => {
    if (!otherComponentName.trim()) {
      alert("Please enter a component name")
      return
    }
    
    if (isEditing) {
      handleComponentInExistingSetChange(index, "componentType", otherComponentName)
    } else {
      handleComponentInSetChange(index, "componentType", otherComponentName)
    }
    
    setShowOtherInput(prev => ({ ...prev, [index]: false }))
    setOtherComponentName("")
  }

  // Check if component type is custom (not in default types)
  const isCustomComponentType = (componentType) => {
    return componentType && !defaultComponentTypes.includes(componentType)
  }

  // Inline editing functions
  const startInlineEdit = (setName) => {
    setEditingSet(setName)
    setEditSetName(setName)
    setEditSetComponents([...componentSets[setName]])
  }

  const saveInlineEdit = () => {
    if (!editSetName.trim()) {
      alert("Please enter a set name")
      return
    }
    if (editSetComponents.length === 0) {
      alert("Please add at least one component")
      return
    }
    
    const validComponents = editSetComponents.filter(comp => comp.componentType.trim())
    if (validComponents.length === 0) {
      alert("Please specify component types")
      return
    }

    const newSets = { ...componentSets }
    if (editingSet !== editSetName) {
      delete newSets[editingSet]
    }
    newSets[editSetName] = validComponents
    setComponentSets(newSets)
    
    setEditingSet(null)
    setEditSetName("")
    setEditSetComponents([])
    showSuccess(`Component set "${editSetName}" updated successfully!`)
  }

  const cancelInlineEdit = () => {
    setEditingSet(null)
    setEditSetName("")
    setEditSetComponents([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      
      <div className="relative z-10 max-w-7xl mx-auto py-12 px-4">

        {/* Success Message */}
        {successMsg && (
          <div className="mb-8 mx-auto max-w-md">
            <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white p-4 rounded-xl shadow-lg flex items-center gap-3 animate-bounce">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <AlertCircle className="h-5 w-5" />
              </div>
              <span className="font-medium">{successMsg}</span>
            </div>
          </div>
        )}

        {/* Main Content: Inventory List or Add System Form */}
        {!showAddSystemForm ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-100 via-indigo-100 to-blue-200 text-indigo-900 p-8 flex items-center justify-between shadow-sm">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <Building2 className="h-6 w-6" />
                Inventory Systems ({allSystems.length})
              </h2>
              <button
                onClick={() => setShowAddSystemForm(true)}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium shadow"
              >
                <Plus className="h-5 w-5 inline-block mr-1" /> Add New System
              </button>
            </div>
            <div className="p-6">
              {allSystems.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <div className="w-24 h-24 bg-gray-100 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                    <Building2 className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No systems added yet</h3>
                  <p className="text-gray-500">Add your first system above to get started!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allSystems.map((system, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-white to-gray-50 border-l-4 border-l-indigo-500 rounded-xl shadow hover:shadow-lg transition-all duration-300 group p-4 flex flex-col gap-2"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-xs font-semibold rounded-lg">
                          {system.systemType}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 truncate">{system.systemName}</h3>
                        <div className="px-2 py-1 border-2 border-indigo-200 text-indigo-700 text-xs font-medium rounded bg-indigo-50">
                          {system.tag}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-1">
                        {system.ownerName && (
                          <span className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded"><User className="h-4 w-4" />{system.ownerName}</span>
                        )}
                        {system.ownerEmail && (
                          <span className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded"><Mail className="h-4 w-4" />{system.ownerEmail}</span>
                        )}
                        {system.floor && system.labNumber && (
                          <span className="flex items-center gap-1 bg-purple-50 px-2 py-1 rounded"><MapPin className="h-4 w-4" />Floor {system.floor} - {system.labNumber}</span>
                        )}
                        {system.ipAddress && (
                          <span className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded"><Hash className="h-4 w-4" />{system.ipAddress}</span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 mb-1">
                        {system.usbStatus && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">USB: {system.usbStatus}</span>
                        )}
                        {system.hasAntivirus && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Antivirus: {system.hasAntivirus}</span>
                        )}
                        {system.desktopPolicy && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">Policy: {system.desktopPolicy}</span>
                        )}
                      </div>
                      {system.remark && (
                        <div className="p-2 bg-gray-50 rounded border-l-4 border-l-gray-300 text-xs italic text-gray-700">"{system.remark}"</div>
                      )}
                      {system.components.length > 0 && (
                        <div className="mt-2">
                          <span className="font-semibold text-indigo-900 text-xs">Components ({system.components.length}):</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {system.components.map((comp, compIndex) => {
                              const IconComponent = componentIcons[comp.componentType] || componentIcons.Default
                              return (
                                <span key={compIndex} className="flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-800 rounded text-xs border border-indigo-200">
                                  <IconComponent className="h-3 w-3" />
                                  {comp.componentType} <span className="text-gray-400">({comp.tag})</span>
                                </span>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          // Add System Form - Only Two Rows
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-100 via-indigo-100 to-blue-200 text-indigo-900 p-8 flex items-center justify-between shadow-sm">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <div className="w-10 h-10 bg-blue bg-opacity-20 rounded-xl flex items-center justify-center">
                  <Building2 className="h-6 w-6" />
                </div>
                Add New System
              </h2>
              <button
                onClick={() => setShowAddSystemForm(false)}
                className="px-4 py-2 bg-gradient-to-r from-red-400 to-red-600 text-white rounded-lg hover:from-red-500 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 font-medium shadow"
              >
                Cancel
              </button>
            </div>
            <div className="p-8">
              <form onSubmit={handleAddSystem} className="space-y-6">
                {/* Single Column Form - All Fields */}
                <div className="space-y-4 max-w-2xl">
                  {/* Building */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-gray-500" />
                      Building *
                    </label>
                    <select
                      value={inventory.building}
                      onChange={(e) => handleInventoryChange("building", e.target.value)}
                      required
                      className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                    >
                      <option value="">Select Building</option>
                      {buildings.map((building) => (
                        <option key={building._id} value={building._id}>
                          {building.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Floor */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Hash className="h-4 w-4 text-gray-500" />
                      Floor *
                    </label>
                    <select
                      value={inventory.floor}
                      onChange={(e) => handleInventoryChange("floor", e.target.value)}
                      required
                      disabled={!inventory.building}
                      className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">Select Floor</option>
                      {floors.map((floor) => (
                        <option key={floor} value={floor}>
                          Floor {floor}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Lab */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Hash className="h-4 w-4 text-gray-500" />
                      Lab *
                    </label>
                    <select
                      value={inventory.labNumber}
                      onChange={(e) => handleInventoryChange("labNumber", e.target.value)}
                      required
                      disabled={!inventory.floor}
                      className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">Select Lab</option>
                      {labs.map((lab) => (
                        <option key={lab} value={lab}>
                          {lab}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* System Tag */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">System Tag *</label>
                    <input
                      type="text"
                      value={inventory.tag}
                      onChange={(e) => handleInventoryChange("tag", e.target.value)}
                      placeholder="SYS-001"
                      required
                      className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                    />
                  </div>

                  {/* System Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">System Name *</label>
                    <input
                      type="text"
                      value={inventory.systemName}
                      onChange={(e) => handleInventoryChange("systemName", e.target.value)}
                      placeholder="Lab PC 1"
                      required
                      className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                    />
                  </div>

                  {/* System Type */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">System Type</label>
                    <select
                      value={inventory.systemType}
                      onChange={(e) => handleInventoryChange("systemType", e.target.value)}
                      className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                    >
                      {systemTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Department */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Department</label>
                    <input
                      type="text"
                      value={inventory.department}
                      onChange={(e) => handleInventoryChange("department", e.target.value)}
                      placeholder="IT Department"
                      className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                    />
                  </div>

                  {/* Owner Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      Owner Name
                    </label>
                    <input
                      type="text"
                      value={inventory.ownerName}
                      onChange={(e) => handleInventoryChange("ownerName", e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                    />
                  </div>

                  {/* Owner Email */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      Owner Email
                    </label>
                    <input
                      type="email"
                      value={inventory.ownerEmail}
                      onChange={(e) => handleInventoryChange("ownerEmail", e.target.value)}
                      placeholder="john.doe@company.com"
                      className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                    />
                  </div>

                  {/* IP Address */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">IP Address</label>
                    <input
                      type="text"
                      value={inventory.ipAddress}
                      onChange={(e) => handleInventoryChange("ipAddress", e.target.value)}
                      placeholder="192.168.1.100"
                      className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                    />
                  </div>

                  {/* MAC Address */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">MAC Address</label>
                    <input
                      type="text"
                      value={inventory.macAddress}
                      onChange={(e) => handleInventoryChange("macAddress", e.target.value)}
                      placeholder="00:1B:44:11:3A:B7"
                      className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                    />
                  </div>

                  {/* USB Status */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Usb className="h-4 w-4 text-gray-500" />
                      USB Status
                    </label>
                    <select
                      value={inventory.usbStatus}
                      onChange={(e) => handleInventoryChange("usbStatus", e.target.value)}
                      className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                    >
                      <option value="">Select USB Status</option>
                      {usbOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Antivirus */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Shield className="h-4 w-4 text-gray-500" />
                      Antivirus Installed
                    </label>
                    <select
                      value={inventory.hasAntivirus}
                      onChange={(e) => handleInventoryChange("hasAntivirus", e.target.value)}
                      className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                    >
                      <option value="">Select Antivirus Status</option>
                      {yesNoOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Desktop Policy */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Desktop Policy</label>
                    <select
                      value={inventory.desktopPolicy}
                      onChange={(e) => handleInventoryChange("desktopPolicy", e.target.value)}
                      className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                    >
                      <option value="">Select Policy Status</option>
                      {yesNoOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Remarks */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Remarks</label>
                    <textarea
                      value={inventory.remark}
                      onChange={(e) => handleInventoryChange("remark", e.target.value)}
                      placeholder="Additional notes or comments about this system..."
                      rows="3"
                      className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 resize-none"
                    />
                  </div>
                </div>

                {/* Components Section */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <div className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <Package className="h-4 w-4 text-indigo-600" />
                      </div>
                      System Components
                    </h3>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowCustomizeSets(true)}
                        className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200 flex items-center gap-2 shadow-lg"
                      >
                        <Settings className="h-4 w-4" />
                        Customize Sets
                      </button>
                      <select
                        onChange={(e) => e.target.value && handleAddComponentSet(e.target.value)}
                        className="px-4 py-2 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                        defaultValue=""
                      >
                        <option value="">Quick Add Components</option>
                        <option value="Desktop Setup">Desktop Setup</option>
                        <option value="Laptop Setup">Laptop Setup</option>
                      </select>
                    </div>
                  </div>

                  {/* Bulk Component Addition */}
                  {showBulkAdd && (
                    <div className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg">
                      <div className="p-6 border-b border-green-200">
                        <h3 className="text-xl font-bold flex items-center gap-3 text-green-800">
                          <div className="w-8 h-8 bg-green-200 rounded-xl flex items-center justify-center">
                            <Copy className="h-5 w-5 text-green-600" />
                          </div>
                          Add Multiple Components
                        </h3>
                        <p className="text-sm text-green-700 mt-2">
                          All components will inherit the system's owner, location, and policy settings. You can add new components or modify existing ones.
                        </p>
                      </div>
                      <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-700">Components</h4>
                          <button
                            type="button"
                            onClick={() => setBulkComponents(prev => [...prev, { componentType: "", tag: "", modelNumber: "", manufacturer: "" }])}
                            className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm flex items-center gap-1"
                          >
                            <Plus className="h-4 w-4" />
                            Add New Component
                          </button>
                        </div>
                        
                        <div className="space-y-4">
                          {bulkComponents.map((comp, index) => (
                            <div
                              key={index}
                              className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 bg-white rounded-xl border border-green-200 shadow-sm hover:shadow-md transition-all duration-200"
                            >
                              <div className={`space-y-1 ${showOtherInput[`bulk-${index}`] ? 'md:col-span-2' : ''}`}>
                                <label className="block text-xs font-semibold text-gray-700">Component Type</label>
                                {showOtherInput[`bulk-${index}`] ? (
                                  <div className="flex gap-2">
                                    <input
                                      type="text"
                                      value={otherComponentName}
                                      onChange={(e) => setOtherComponentName(e.target.value)}
                                      placeholder="Enter component name"
                                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                    <button
                                      onClick={() => {
                                        if (otherComponentName.trim()) {
                                          handleBulkComponentChange(index, "componentType", otherComponentName)
                                          setShowOtherInput(prev => ({ ...prev, [`bulk-${index}`]: false }))
                                          setOtherComponentName("")
                                        }
                                      }}
                                      className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm font-medium whitespace-nowrap"
                                    >
                                      Save
                                    </button>
                                  </div>
                                ) : (
                                  <select
                                    value={comp.componentType}
                                    onChange={(e) => {
                                      if (e.target.value === "Other") {
                                        setShowOtherInput(prev => ({ ...prev, [`bulk-${index}`]: true }))
                                        setOtherComponentName("")
                                      } else {
                                        handleBulkComponentChange(index, "componentType", e.target.value)
                                      }
                                    }}
                                    className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                  >
                                    <option value="">Select Type</option>
                                    {defaultComponentTypes.map((type) => (
                                      <option key={type} value={type}>
                                        {type}
                                      </option>
                                    ))}
                                    {isCustomComponentType(comp.componentType) && (
                                      <option value={comp.componentType}>
                                        {comp.componentType}
                                      </option>
                                    )}
                                    <option value="Other">Other</option>
                                  </select>
                                )}
                              </div>
                              <div className="space-y-1">
                                <label className="block text-xs font-semibold text-gray-700">Tag Number *</label>
                                <input
                                  type="text"
                                  value={comp.tag}
                                  onChange={(e) => handleBulkComponentChange(index, "tag", e.target.value)}
                                  placeholder="e.g., CPU-001"
                                  required
                                  className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="block text-xs font-semibold text-gray-700">Model</label>
                                <input
                                  type="text"
                                  value={comp.modelNumber}
                                  onChange={(e) => handleBulkComponentChange(index, "modelNumber", e.target.value)}
                                  placeholder="Model"
                                  className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="block text-xs font-semibold text-gray-700">Manufacturer</label>
                                <input
                                  type="text"
                                  value={comp.manufacturer}
                                  onChange={(e) => handleBulkComponentChange(index, "manufacturer", e.target.value)}
                                  placeholder="Brand"
                                  className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                />
                              </div>
                              <div className="flex items-end">
                                {bulkComponents.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => setBulkComponents(prev => prev.filter((_, i) => i !== index))}
                                    className="px-2 py-2 text-red-500 hover:text-red-700"
                                    title="Remove Component"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={handleAddBulkComponents}
                            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 font-medium shadow-lg"
                          >
                            Add All Components
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowBulkAdd(false)}
                            className="px-6 py-3 border-2 border-gray-300 rounded-xl bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200 font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Components List */}
                  {inventory.components.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                        <Package className="h-5 w-5 text-indigo-600" />
                        Added Components ({inventory.components.length})
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {inventory.components.map((comp, index) => {
                          const IconComponent = componentIcons[comp.componentType] || componentIcons.Default
                          return (
                            <div
                              key={index}
                              className="bg-white border-l-4 border-l-indigo-500 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 group"
                            >
                              <div className="p-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                                      <IconComponent className="h-5 w-5 text-indigo-600" />
                                    </div>
                                    <div>
                                      <p className="font-semibold text-gray-800">{comp.componentType}</p>
                                      <p className="text-sm text-gray-500">Tag: {comp.tag}</p>
                                      {comp.modelNumber && (
                                        <p className="text-xs text-gray-400">
                                          {comp.manufacturer} {comp.modelNumber}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeComponent(index)}
                                    className="w-8 h-8 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 hover:text-red-700 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white font-bold text-lg rounded-2xl hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
                >
                  🚀 Add System to Inventory
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Customize Component Sets Modal */}
        {showCustomizeSets && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <Settings className="h-6 w-6 text-indigo-600" />
                    Customize Component Sets
                  </h2>
                  <button
                    onClick={() => setShowCustomizeSets(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-8">
                {/* Existing Sets with Inline Editing */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Existing Component Sets</h3>
                  <div className="space-y-4">
                    {Object.entries(componentSets).map(([setName, components]) => (
                      <div key={setName} className="border border-gray-200 rounded-xl p-4">
                        {editingSet === setName ? (
                          // Inline Edit Mode
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <input
                                type="text"
                                value={editSetName}
                                onChange={(e) => setEditSetName(e.target.value)}
                                className="text-lg font-semibold text-gray-800 bg-transparent border-b-2 border-blue-500 focus:outline-none px-2 py-1"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={saveInlineEdit}
                                  className="text-green-500 hover:text-green-700"
                                  title="Save Changes"
                                >
                                  <Save size={16} />
                                </button>
                                <button
                                  onClick={cancelInlineEdit}
                                  className="text-gray-500 hover:text-gray-700"
                                  title="Cancel"
                                >
                                  <X size={16} />
                                </button>
                                <button
                                  onClick={() => removeCustomSet(setName)}
                                  className="text-red-500 hover:text-red-700"
                                  title="Delete Set"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <label className="block text-sm font-semibold text-gray-700">Components</label>
                                <button
                                  type="button"
                                  onClick={addComponentToExistingSet}
                                  className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 text-sm"
                                >
                                  <Plus className="h-4 w-4 inline mr-1" />
                                  Add Component
                                </button>
                              </div>
                              
                              <div className="space-y-3">
                                {editSetComponents.map((comp, index) => (
                                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div>
                                      <label className="block text-xs font-semibold text-gray-700 mb-1">Component Type</label>
                                      {showOtherInput[index] ? (
                                        <div className="flex gap-2">
                                          <input
                                            type="text"
                                            value={otherComponentName}
                                            onChange={(e) => setOtherComponentName(e.target.value)}
                                            placeholder="Enter component name"
                                            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                          />
                                          <button
                                            onClick={() => saveOtherComponentName(index, true)}
                                            className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm font-medium whitespace-nowrap"
                                          >
                                            Save
                                          </button>
                                        </div>
                                      ) : (
                                        <select
                                          value={comp.componentType}
                                          onChange={(e) => handleComponentTypeChange(index, e.target.value, true)}
                                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        >
                                          <option value="">Select Type</option>
                                          {defaultComponentTypes.map((type) => (
                                            <option key={type} value={type}>
                                              {type}
                                            </option>
                                          ))}
                                          {isCustomComponentType(comp.componentType) && (
                                            <option value={comp.componentType}>
                                              {comp.componentType}
                                            </option>
                                          )}
                                          <option value="Other">Other</option>
                                        </select>
                                      )}
                                    </div>
                                    <div>
                                      <label className="block text-xs font-semibold text-gray-700 mb-1">Model</label>
                                      <input
                                        type="text"
                                        value={comp.modelNumber}
                                        onChange={(e) => handleComponentInExistingSetChange(index, "modelNumber", e.target.value)}
                                        placeholder="Model"
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                      />
                                    </div>
                                    <div className="flex items-end gap-2">
                                      <div className="flex-1">
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">Manufacturer</label>
                                        <input
                                          type="text"
                                          value={comp.manufacturer}
                                          onChange={(e) => handleComponentInExistingSetChange(index, "manufacturer", e.target.value)}
                                          placeholder="Brand"
                                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                      </div>
                                      {editSetComponents.length > 1 && (
                                        <button
                                          type="button"
                                          onClick={() => removeComponentFromExistingSet(index)}
                                          className="px-2 py-2 text-red-500 hover:text-red-700"
                                        >
                                          <Trash2 size={16} />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : (
                          // View Mode
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-semibold text-gray-800">{setName}</h4>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => startInlineEdit(setName)}
                                  className="text-blue-500 hover:text-blue-700"
                                  title="Edit Set"
                                >
                                  <Settings size={16} />
                                </button>
                                <button
                                  onClick={() => removeCustomSet(setName)}
                                  className="text-red-500 hover:text-red-700"
                                  title="Delete Set"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                            <div className="space-y-2">
                              {components.map((comp, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                                  <Package className="h-4 w-4" />
                                  <span>{comp.componentType}</span>
                                  {comp.modelNumber && <span className="text-gray-400">({comp.modelNumber})</span>}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>



                {/* Create New Set */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Create New Component Set</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Set Name</label>
                      <input
                        type="text"
                        value={newSetName}
                        onChange={(e) => setNewSetName(e.target.value)}
                        placeholder="e.g., Gaming Setup"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-semibold text-gray-700">Components</label>
                        <button
                          type="button"
                          onClick={addNewComponentToSet}
                          className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 text-sm"
                        >
                          <Plus className="h-4 w-4 inline mr-1" />
                          Add Component
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        {newSetComponents.map((comp, index) => (
                          <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-gray-50 rounded-lg">
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">Component Type</label>
                              {showOtherInput[index] ? (
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={otherComponentName}
                                    onChange={(e) => setOtherComponentName(e.target.value)}
                                    placeholder="Enter component name"
                                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                  />
                                  <button
                                    onClick={() => saveOtherComponentName(index, false)}
                                    className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm font-medium whitespace-nowrap"
                                  >
                                    Save
                                  </button>
                                </div>
                              ) : (
                                <select
                                  value={comp.componentType}
                                  onChange={(e) => handleComponentTypeChange(index, e.target.value, false)}
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                  <option value="">Select Type</option>
                                  {defaultComponentTypes.map((type) => (
                                    <option key={type} value={type}>
                                      {type}
                                    </option>
                                  ))}
                                  {isCustomComponentType(comp.componentType) && (
                                    <option value={comp.componentType}>
                                      {comp.componentType}
                                    </option>
                                  )}
                                  <option value="Other">Other</option>
                                </select>
                              )}
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">Model</label>
                              <input
                                type="text"
                                value={comp.modelNumber}
                                onChange={(e) => handleComponentInSetChange(index, "modelNumber", e.target.value)}
                                placeholder="Model"
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>
                            <div className="flex items-end gap-2">
                              <div className="flex-1">
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Manufacturer</label>
                                <input
                                  type="text"
                                  value={comp.manufacturer}
                                  onChange={(e) => handleComponentInSetChange(index, "manufacturer", e.target.value)}
                                  placeholder="Brand"
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                              </div>
                              {newSetComponents.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeComponentFromSet(index)}
                                  className="px-2 py-2 text-red-500 hover:text-red-700"
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={saveCustomSet}
                        className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 font-medium"
                      >
                        Save Component Set
                      </button>
                      <button
                        onClick={() => setShowCustomizeSets(false)}
                        className="px-6 py-3 border-2 border-gray-300 rounded-xl bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200 font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default InventoryManagement
