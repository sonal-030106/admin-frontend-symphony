import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentButton } from "@/components/PaymentButton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { getFines, createFine, updateFine as updateFineApi, deleteFine as deleteFineApi, getVehicles } from "@/services/api";

interface Vehicle {
  _id: string;
  registrationNumber: string;
  ownerName: string;
}

interface Fine {
  _id: string;
  vehicleId: string;
  violationType: string;
  amount: number;
  status: 'pending' | 'paid' | 'disputed';
  dueDate: string;
  description: string;
  location: string;
  vehicle?: Vehicle;
}

const FinesPage = () => {
  const [fines, setFines] = useState<Fine[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    vehicleId: '',
    violationType: '',
    amount: '',
    dueDate: '',
    description: '',
    location: '',
  });

  useEffect(() => {
    fetchFines();
    fetchVehicles();
  }, []);

  const fetchFines = async () => {
    try {
      const data = await getFines();
      setFines(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch fines",
        variant: "destructive",
      });
    }
  };

  const fetchVehicles = async () => {
    try {
      const data = await getVehicles();
      setVehicles(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch vehicles",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createFine({
        ...formData,
        amount: parseFloat(formData.amount),
      });
      toast({
        title: "Success",
        description: "Fine added successfully",
      });
      setIsAddDialogOpen(false);
      fetchFines();
      setFormData({
        vehicleId: '',
        violationType: '',
        amount: '',
        dueDate: '',
        description: '',
        location: '',
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add fine",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteFineApi(id);
      toast({
        title: "Success",
        description: "Fine deleted successfully",
      });
      fetchFines();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete fine",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Fines Management</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Fine
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Fine</DialogTitle>
                <DialogDescription>
                  Enter the fine details below
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="vehicleId">Vehicle</Label>
                    <Select 
                      onValueChange={(value) => 
                        setFormData(prev => ({ ...prev, vehicleId: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select vehicle" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicles.map((vehicle) => (
                          <SelectItem key={vehicle._id} value={vehicle._id}>
                            {vehicle.registrationNumber} - {vehicle.ownerName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="violationType">Violation Type</Label>
                    <Select 
                      onValueChange={(value) => 
                        setFormData(prev => ({ ...prev, violationType: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select violation type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="speeding">Speeding</SelectItem>
                        <SelectItem value="parking">Parking</SelectItem>
                        <SelectItem value="signal">Signal Violation</SelectItem>
                        <SelectItem value="documents">Missing Documents</SelectItem>
                        <SelectItem value="others">Others</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      name="amount"
                      type="number"
                      value={formData.amount}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      name="dueDate"
                      type="date"
                      value={formData.dueDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Save Fine</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Fine List</CardTitle>
            <CardDescription>Manage all fines</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Violation Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fines.map((fine) => (
                  <TableRow key={fine._id}>
                    <TableCell>{fine.vehicle?.registrationNumber}</TableCell>
                    <TableCell>{fine.violationType}</TableCell>
                    <TableCell>₹{fine.amount}</TableCell>
                    <TableCell>{new Date(fine.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell>{fine.location}</TableCell>
                    <TableCell>
                      <span className={
                        fine.status === 'paid' ? 'text-green-600' :
                        fine.status === 'disputed' ? 'text-orange-600' :
                        'text-red-600'
                      }>
                        {fine.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(fine._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        {fine.status === 'pending' && (
                          <PaymentButton
                            fineId={fine._id}
                            amount={fine.amount}
                            onSuccess={() => {
                              toast({
                                title: 'Payment Successful',
                                description: 'Fine has been paid successfully.',
                              });
                              fetchFines();
                            }}
                            onError={(error) => {
                              toast({
                                title: 'Payment Failed',
                                description: error.message || 'An error occurred during payment.',
                                variant: 'destructive',
                              });
                            }}
                          />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default FinesPage;
