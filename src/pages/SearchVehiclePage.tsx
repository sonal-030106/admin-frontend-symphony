
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData, Vehicle } from "@/contexts/DataContext";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Search, AlertCircle, FileText } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const SearchVehiclePage = () => {
  const navigate = useNavigate();
  const { vehicles, fines, loading } = useData();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Vehicle[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      setError("Please enter a registration number or chassis number");
      return;
    }
    
    setError("");
    setIsSearching(true);
    setSearched(true);

    // Simulate API call delay
    setTimeout(() => {
      const results = vehicles.filter(
        vehicle => 
          vehicle.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vehicle.chassisNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      setSearchResults(results);
      setIsSearching(false);
    }, 1000);
  };

  const getUnpaidFinesCount = (vehicleId: string) => {
    return fines.filter(fine => fine.vehicleId === vehicleId && fine.status === "Unpaid").length;
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
    <MainLayout>
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Search Vehicle</h1>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Vehicle Search</CardTitle>
              <CardDescription>
                Enter the vehicle registration number (e.g., DL05CE3456) or chassis number to search
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Input
                    type="text"
                    placeholder="Enter registration number or chassis number"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={isSearching}>
                    {isSearching ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Search
                      </>
                    )}
                  </Button>
                </div>
                
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </form>
            </CardContent>
          </Card>
          
          {searched && !isSearching && (
            <div>
              {searchResults.length > 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Search Results</CardTitle>
                    <CardDescription>
                      Showing {searchResults.length} vehicle{searchResults.length !== 1 ? 's' : ''}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Registration No.</TableHead>
                          <TableHead>Owner</TableHead>
                          <TableHead>Vehicle Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Unpaid Fines</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {searchResults.map((vehicle) => (
                          <TableRow key={vehicle.id}>
                            <TableCell className="font-medium">{vehicle.registrationNumber}</TableCell>
                            <TableCell>{vehicle.ownerName}</TableCell>
                            <TableCell>{vehicle.vehicleType}</TableCell>
                            <TableCell>
                              <span className={getStatusBadgeClass(vehicle.status)}>
                                {vehicle.status}
                              </span>
                            </TableCell>
                            <TableCell>{getUnpaidFinesCount(vehicle.id)}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/vehicle/${vehicle.id}`)}
                              >
                                <FileText className="mr-2 h-4 w-4" />
                                View Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ) : (
                <Alert className="bg-amber-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No vehicles found matching "{searchTerm}". Please check the registration number or chassis number and try again.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default SearchVehiclePage;
