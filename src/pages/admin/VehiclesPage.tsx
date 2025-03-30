
import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { useData, Vehicle } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2, 
  FileText, 
  Filter 
} from "lucide-react";

const VehiclesPage = () => {
  const { vehicles, addVehicle, updateVehicle, deleteVehicle } = useData();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  
  // New vehicle state
  const [newVehicle, setNewVehicle] = useState<Omit<Vehicle, "id">>({
    registrationNumber: "",
    ownerName: "",
    vehicleType: "",
    model: "",
    yearOfMfg: "",
    chassisNumber: "",
    engineNumber: "",
    fuelType: "",
    status: "Active",
  });

  // Filter and search vehicles
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = 
      vehicle.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatusFilter = statusFilter === "all" || vehicle.status === statusFilter;
    
    return matchesSearch && matchesStatusFilter;
  });

  // Handle adding a new vehicle
  const handleAddVehicle = async () => {
    try {
      await addVehicle(newVehicle);
      setOpenAddDialog(false);
      setNewVehicle({
        registrationNumber: "",
        ownerName: "",
        vehicleType: "",
        model: "",
        yearOfMfg: "",
        chassisNumber: "",
        engineNumber: "",
        fuelType: "",
        status: "Active",
      });
    } catch (error) {
      console.error("Failed to add vehicle:", error);
      toast({
        title: "Error",
        description: "Failed to add vehicle. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle editing a vehicle
  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setNewVehicle({
      registrationNumber: vehicle.registrationNumber,
      ownerName: vehicle.ownerName,
      vehicleType: vehicle.vehicleType,
      model: vehicle.model,
      yearOfMfg: vehicle.yearOfMfg,
      chassisNumber: vehicle.chassisNumber,
      engineNumber: vehicle.engineNumber,
      fuelType: vehicle.fuelType,
      status: vehicle.status,
    });
    setOpenAddDialog(true);
  };

  // Handle updating a vehicle
  const handleUpdateVehicle = async () => {
    if (!editingVehicle) return;
    
    try {
      await updateVehicle(editingVehicle.id, newVehicle);
      setOpenAddDialog(false);
      setEditingVehicle(null);
      setNewVehicle({
        registrationNumber: "",
        ownerName: "",
        vehicleType: "",
        model: "",
        yearOfMfg: "",
        chassisNumber: "",
        engineNumber: "",
        fuelType: "",
        status: "Active",
      });
    } catch (error) {
      console.error("Failed to update vehicle:", error);
      toast({
        title: "Error",
        description: "Failed to update vehicle. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle deleting a vehicle
  const handleDeleteVehicle = async (vehicleId: string) => {
    if (confirm("Are you sure you want to delete this vehicle?")) {
      try {
        await deleteVehicle(vehicleId);
      } catch (error) {
        console.error("Failed to delete vehicle:", error);
        toast({
          title: "Error",
          description: "Failed to delete vehicle. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  // Handle input change for new vehicle form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewVehicle(prev => ({ ...prev, [name]: value }));
  };

  // Handle select change for new vehicle form
  const handleSelectChange = (name: string, value: string) => {
    setNewVehicle(prev => ({ ...prev, [name]: value }));
  };

  // Reset form when dialog is closed
  const handleDialogClose = () => {
    setOpenAddDialog(false);
    setEditingVehicle(null);
    setNewVehicle({
      registrationNumber: "",
      ownerName: "",
      vehicleType: "",
      model: "",
      yearOfMfg: "",
      chassisNumber: "",
      engineNumber: "",
      fuelType: "",
      status: "Active",
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs";
      case "Towed":
        return "bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs";
      case "Suspended":
        return "bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs";
      default:
        return "bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold mb-1">Vehicles</h2>
            <p className="text-gray-500">Manage all registered vehicles in the system</p>
          </div>
          <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-rtms-blue hover:bg-rtms-darkblue">
                <Plus className="mr-2 h-4 w-4" />
                Add Vehicle
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}</DialogTitle>
                <DialogDescription>
                  {editingVehicle 
                    ? "Update the vehicle details below." 
                    : "Fill in the vehicle details to add a new vehicle to the system."}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="registrationNumber">Registration Number</Label>
                  <Input
                    id="registrationNumber"
                    name="registrationNumber"
                    value={newVehicle.registrationNumber}
                    onChange={handleInputChange}
                    placeholder="e.g., DL05CE3456"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ownerName">Owner Name</Label>
                  <Input
                    id="ownerName"
                    name="ownerName"
                    value={newVehicle.ownerName}
                    onChange={handleInputChange}
                    placeholder="e.g., Rahul Sharma"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicleType">Vehicle Type</Label>
                  <Select
                    value={newVehicle.vehicleType}
                    onValueChange={(value) => handleSelectChange("vehicleType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Car">Car</SelectItem>
                      <SelectItem value="Motorcycle">Motorcycle</SelectItem>
                      <SelectItem value="Truck">Truck</SelectItem>
                      <SelectItem value="Bus">Bus</SelectItem>
                      <SelectItem value="Van">Van</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    name="model"
                    value={newVehicle.model}
                    onChange={handleInputChange}
                    placeholder="e.g., Maruti Swift"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yearOfMfg">Year of Manufacture</Label>
                  <Input
                    id="yearOfMfg"
                    name="yearOfMfg"
                    value={newVehicle.yearOfMfg}
                    onChange={handleInputChange}
                    placeholder="e.g., 2018"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fuelType">Fuel Type</Label>
                  <Select
                    value={newVehicle.fuelType}
                    onValueChange={(value) => handleSelectChange("fuelType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Petrol">Petrol</SelectItem>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="CNG">CNG</SelectItem>
                      <SelectItem value="Electric">Electric</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="chassisNumber">Chassis Number</Label>
                  <Input
                    id="chassisNumber"
                    name="chassisNumber"
                    value={newVehicle.chassisNumber}
                    onChange={handleInputChange}
                    placeholder="e.g., MABC123456XY78901"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="engineNumber">Engine Number</Label>
                  <Input
                    id="engineNumber"
                    name="engineNumber"
                    value={newVehicle.engineNumber}
                    onChange={handleInputChange}
                    placeholder="e.g., EN123456789"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={newVehicle.status}
                    onValueChange={(value: "Active" | "Towed" | "Suspended") => handleSelectChange("status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Towed">Towed</SelectItem>
                      <SelectItem value="Suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={handleDialogClose}>
                  Cancel
                </Button>
                <Button onClick={editingVehicle ? handleUpdateVehicle : handleAddVehicle}>
                  {editingVehicle ? "Update Vehicle" : "Add Vehicle"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex-1 w-full md:max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    placeholder="Search by registration, owner, or model..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Towed">Towed</SelectItem>
                    <SelectItem value="Suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Registration No.</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Vehicle Type</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVehicles.length > 0 ? (
                    filteredVehicles.map((vehicle) => (
                      <TableRow key={vehicle.id}>
                        <TableCell className="font-medium">{vehicle.registrationNumber}</TableCell>
                        <TableCell>{vehicle.ownerName}</TableCell>
                        <TableCell>{vehicle.vehicleType}</TableCell>
                        <TableCell>{vehicle.model}</TableCell>
                        <TableCell>
                          <span className={getStatusBadgeClass(vehicle.status)}>
                            {vehicle.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditVehicle(vehicle)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteVehicle(vehicle.id)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                        No vehicles found matching your search criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="text-xs text-gray-500 mt-4">
              Showing {filteredVehicles.length} of {vehicles.length} vehicles
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default VehiclesPage;
