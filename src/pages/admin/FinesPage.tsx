
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useData, Fine } from "@/contexts/DataContext";
import { useState } from "react";
import { Plus, Search, FileText, Edit, Trash2, Filter, Check, Ban } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

const AdminFinesPage = () => {
  const { fines, vehicles, addFine, updateFine, deleteFine } = useData();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [violationFilter, setViolationFilter] = useState("");
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const [selectedFine, setSelectedFine] = useState<Fine | null>(null);
  
  // Form fields
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [violationType, setViolationType] = useState("");
  const [amount, setAmount] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  
  // Filter fines based on search and filters
  const filteredFines = fines.filter(fine => {
    const matchesSearch = 
      searchTerm === "" || 
      fine.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fine.violationType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fine.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "" || fine.status === statusFilter;
    const matchesViolation = violationFilter === "" || fine.violationType === violationFilter;
    
    return matchesSearch && matchesStatus && matchesViolation;
  });
  
  // Unique violation types for filter
  const violationTypes = Array.from(new Set(fines.map(fine => fine.violationType)));
  
  // Open add dialog and reset form
  const openAddDialog = () => {
    setRegistrationNumber("");
    setViolationType("");
    setAmount("");
    setLocation("");
    setDate(new Date().toISOString().split('T')[0]);
    setDescription("");
    setIsAddDialogOpen(true);
  };
  
  // Open edit dialog and populate form
  const openEditDialog = (fine: Fine) => {
    setSelectedFine(fine);
    setRegistrationNumber(fine.registrationNumber);
    setViolationType(fine.violationType);
    setAmount(fine.amount.toString());
    setLocation(fine.location);
    setDate(fine.date.split('T')[0]);
    setDescription(fine.description || "");
    setIsEditDialogOpen(true);
  };
  
  // Open delete confirmation dialog
  const openDeleteDialog = (fine: Fine) => {
    setSelectedFine(fine);
    setIsDeleteDialogOpen(true);
  };
  
  // Handle add fine submission
  const handleAddFine = () => {
    if (!registrationNumber || !violationType || !amount || !location || !date) {
      toast({
        title: "Missing Fields",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }
    
    const vehicle = vehicles.find(v => v.registrationNumber === registrationNumber);
    
    if (!vehicle) {
      toast({
        title: "Invalid Registration",
        description: "No vehicle found with this registration number",
        variant: "destructive",
      });
      return;
    }
    
    const newFine: Omit<Fine, "id"> = {
      vehicleId: vehicle.id,
      registrationNumber,
      violationType,
      amount: parseFloat(amount),
      location,
      date: new Date(date).toISOString(),
      status: "Unpaid",
      description,
    };
    
    addFine(newFine);
    
    setIsAddDialogOpen(false);
    toast({
      title: "Fine Added",
      description: "The fine has been added successfully",
    });
  };
  
  // Handle edit fine submission
  const handleEditFine = () => {
    if (!selectedFine) return;
    
    if (!registrationNumber || !violationType || !amount || !location || !date) {
      toast({
        title: "Missing Fields",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }
    
    const vehicle = vehicles.find(v => v.registrationNumber === registrationNumber);
    
    if (!vehicle) {
      toast({
        title: "Invalid Registration",
        description: "No vehicle found with this registration number",
        variant: "destructive",
      });
      return;
    }
    
    const updatedFine: Fine = {
      ...selectedFine,
      vehicleId: vehicle.id,
      registrationNumber,
      violationType,
      amount: parseFloat(amount),
      location,
      date: new Date(date).toISOString(),
      description,
    };
    
    updateFine(updatedFine);
    
    setIsEditDialogOpen(false);
    toast({
      title: "Fine Updated",
      description: "The fine has been updated successfully",
    });
  };
  
  // Handle delete fine confirmation
  const handleDeleteFine = () => {
    if (!selectedFine) return;
    
    deleteFine(selectedFine.id);
    
    setIsDeleteDialogOpen(false);
    toast({
      title: "Fine Deleted",
      description: "The fine has been deleted successfully",
    });
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Traffic Fines Management</h1>
            <p className="text-muted-foreground">
              Manage and track all traffic violation fines in the system
            </p>
          </div>
          <Button onClick={openAddDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Fine
          </Button>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Traffic Fines</CardTitle>
            <CardDescription>
              Total fines: {fines.length} | Unpaid: {fines.filter(fine => fine.status === "Unpaid").length} | 
              Paid: {fines.filter(fine => fine.status === "Paid").length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex gap-2 flex-1">
                <Input
                  placeholder="Search by registration number, violation, location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Statuses</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Unpaid">Unpaid</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={violationFilter} onValueChange={setViolationFilter}>
                  <SelectTrigger className="w-44">
                    <SelectValue placeholder="Violation Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Violations</SelectItem>
                    {violationTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button variant="ghost" size="icon" onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("");
                  setViolationFilter("");
                }}>
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Registration No.</TableHead>
                    <TableHead>Violation Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFines.length > 0 ? (
                    filteredFines.map(fine => (
                      <TableRow key={fine.id}>
                        <TableCell className="font-medium">{fine.registrationNumber}</TableCell>
                        <TableCell>{fine.violationType}</TableCell>
                        <TableCell>{formatDate(fine.date)}</TableCell>
                        <TableCell>{fine.location}</TableCell>
                        <TableCell>₹{fine.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge
                            variant={fine.status === "Paid" ? "default" : "secondary"}
                            className={fine.status === "Paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
                          >
                            {fine.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => openEditDialog(fine)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => openDeleteDialog(fine)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center h-24">
                        No fines found matching your search criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        
        {/* Add Fine Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add New Fine</DialogTitle>
              <DialogDescription>
                Enter the details for the new traffic violation fine
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-5 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="registrationNumber">Registration Number</Label>
                  <Input
                    id="registrationNumber"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    placeholder="e.g., DL05CE3456"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="violationType">Violation Type</Label>
                  <Select value={violationType} onValueChange={setViolationType}>
                    <SelectTrigger id="violationType">
                      <SelectValue placeholder="Select violation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Speeding">Speeding</SelectItem>
                      <SelectItem value="Red Light">Red Light</SelectItem>
                      <SelectItem value="Illegal Parking">Illegal Parking</SelectItem>
                      <SelectItem value="No Helmet">No Helmet</SelectItem>
                      <SelectItem value="Drunk Driving">Drunk Driving</SelectItem>
                      <SelectItem value="Wrong Side Driving">Wrong Side Driving</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Fine Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Amount in ₹"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date">Date of Violation</Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Address/location of violation"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Additional details about the violation"
                  rows={3}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddFine}>
                <Plus className="mr-2 h-4 w-4" />
                Add Fine
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Edit Fine Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Edit Fine</DialogTitle>
              <DialogDescription>
                Update the traffic violation fine details
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-5 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-registrationNumber">Registration Number</Label>
                  <Input
                    id="edit-registrationNumber"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-violationType">Violation Type</Label>
                  <Select value={violationType} onValueChange={setViolationType}>
                    <SelectTrigger id="edit-violationType">
                      <SelectValue placeholder="Select violation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Speeding">Speeding</SelectItem>
                      <SelectItem value="Red Light">Red Light</SelectItem>
                      <SelectItem value="Illegal Parking">Illegal Parking</SelectItem>
                      <SelectItem value="No Helmet">No Helmet</SelectItem>
                      <SelectItem value="Drunk Driving">Drunk Driving</SelectItem>
                      <SelectItem value="Wrong Side Driving">Wrong Side Driving</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-amount">Fine Amount</Label>
                  <Input
                    id="edit-amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-date">Date of Violation</Label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-location">Location</Label>
                <Input
                  id="edit-location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description (Optional)</Label>
                <Textarea
                  id="edit-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditFine}>
                <Check className="mr-2 h-4 w-4" />
                Update Fine
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Delete Fine Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this fine record? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            
            {selectedFine && (
              <div className="py-4">
                <p className="mb-2"><strong>Registration Number:</strong> {selectedFine.registrationNumber}</p>
                <p className="mb-2"><strong>Violation:</strong> {selectedFine.violationType}</p>
                <p className="mb-2"><strong>Date:</strong> {formatDate(selectedFine.date)}</p>
                <p><strong>Amount:</strong> ₹{selectedFine.amount.toLocaleString()}</p>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteFine}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Fine
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminFinesPage;
