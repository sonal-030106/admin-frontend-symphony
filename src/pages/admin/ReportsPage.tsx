
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useData } from "@/contexts/DataContext";
import { useState } from "react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Download, Filter, FileText, BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon, Calendar } from "lucide-react";

const violationsData = [
  { name: 'Speeding', value: 45 },
  { name: 'Illegal Parking', value: 25 },
  { name: 'Red Light', value: 15 },
  { name: 'No Helmet', value: 8 },
  { name: 'Wrong Side', value: 7 }
];

const monthlyData = [
  { name: 'Jan', fines: 65, paid: 50, amount: 125000 },
  { name: 'Feb', fines: 75, paid: 60, amount: 150000 },
  { name: 'Mar', fines: 80, paid: 65, amount: 162500 },
  { name: 'Apr', fines: 70, paid: 55, amount: 137500 },
  { name: 'May', fines: 90, paid: 70, amount: 175000 },
  { name: 'Jun', fines: 100, paid: 80, amount: 200000 },
  { name: 'Jul', fines: 110, paid: 90, amount: 225000 },
  { name: 'Aug', fines: 120, paid: 100, amount: 250000 },
  { name: 'Sep', fines: 130, paid: 110, amount: 275000 },
  { name: 'Oct', fines: 125, paid: 105, amount: 262500 },
  { name: 'Nov', fines: 115, paid: 95, amount: 237500 },
  { name: 'Dec', fines: 95, paid: 80, amount: 200000 }
];

const locationData = [
  { name: 'Connaught Place', fines: 120 },
  { name: 'India Gate', fines: 85 },
  { name: 'Saket', fines: 65 },
  { name: 'Karol Bagh', fines: 55 },
  { name: 'Noida Sector 18', fines: 45 },
  { name: 'Lajpat Nagar', fines: 35 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

// Get last 7 days data
const getLast7DaysData = () => {
  const data = [];
  const now = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    data.push({
      name: dayName,
      fines: Math.floor(Math.random() * 30) + 10,
      paid: Math.floor(Math.random() * 20) + 5,
      amount: (Math.floor(Math.random() * 30) + 10) * 2500
    });
  }
  
  return data;
};

const daily7DaysData = getLast7DaysData();

const AdminReportsPage = () => {
  const { fines, vehicles } = useData();
  const [timeRange, setTimeRange] = useState<string>("thisMonth");
  const [reportType, setReportType] = useState<string>("fines");
  
  // Calculate summary statistics
  const totalFines = fines.length;
  const totalUnpaidFines = fines.filter(fine => fine.status === "Unpaid").length;
  const totalAmount = fines.reduce((sum, fine) => sum + fine.amount, 0);
  const paidAmount = fines
    .filter(fine => fine.status === "Paid")
    .reduce((sum, fine) => sum + fine.amount, 0);
  
  const paymentComplianceRate = totalFines > 0 ? ((totalFines - totalUnpaidFines) / totalFines) * 100 : 0;
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>
            <p className="text-muted-foreground">
              View insights and generate reports on traffic violations and fine collections
            </p>
          </div>
          <div className="flex space-x-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last7Days">Last 7 Days</SelectItem>
                <SelectItem value="thisMonth">This Month</SelectItem>
                <SelectItem value="thisYear">This Year</SelectItem>
                <SelectItem value="allTime">All Time</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Fines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalFines}</div>
              <p className="text-xs text-muted-foreground">
                +{Math.floor(Math.random() * 10) + 5}% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Unpaid Fines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUnpaidFines}</div>
              <p className="text-xs text-muted-foreground">
                {totalFines > 0 ? Math.round((totalUnpaidFines / totalFines) * 100) : 0}% of total fines
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Avg. ₹{totalFines > 0 ? Math.round(totalAmount / totalFines).toLocaleString() : 0} per fine
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{paymentComplianceRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                ₹{paidAmount.toLocaleString()} collected
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Reports Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">
              <BarChart3 className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="violations">
              <PieChartIcon className="mr-2 h-4 w-4" />
              Violations
            </TabsTrigger>
            <TabsTrigger value="trends">
              <LineChartIcon className="mr-2 h-4 w-4" />
              Trends
            </TabsTrigger>
            <TabsTrigger value="locations">
              <MapPin className="mr-2 h-4 w-4" />
              Locations
            </TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Overview</CardTitle>
                <CardDescription>
                  Number of fines issued and collected per month in 2023
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={monthlyData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="fines" name="Fines Issued" fill="#0088FE" />
                      <Bar dataKey="paid" name="Fines Paid" fill="#00C49F" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Last 7 Days</CardTitle>
                  <CardDescription>
                    Daily fine statistics for the past week
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart 
                        data={daily7DaysData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="fines" name="Fines Issued" stroke="#0088FE" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="paid" name="Fines Paid" stroke="#00C49F" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                  <CardDescription>
                    Fine amount collected per month in 2023
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart 
                        data={monthlyData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`₹${value}`, "Amount"]} />
                        <Legend />
                        <Line type="monotone" dataKey="amount" name="Amount Collected (₹)" stroke="#8884d8" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Violations Tab */}
          <TabsContent value="violations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Violation Distribution</CardTitle>
                <CardDescription>
                  Breakdown of different types of violations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={violationsData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {violationsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Violations by Amount</CardTitle>
                  <CardDescription>
                    Violations that generate the most revenue
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={[
                          { name: 'Drunk Driving', amount: 350000 },
                          { name: 'Speeding', amount: 250000 },
                          { name: 'Red Light', amount: 150000 },
                          { name: 'No License', amount: 125000 },
                          { name: 'Illegal Parking', amount: 100000 }
                        ]}
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" />
                        <Tooltip formatter={(value) => [`₹${value}`, "Amount"]} />
                        <Legend />
                        <Bar dataKey="amount" name="Amount (₹)" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Violation Frequency by Time</CardTitle>
                  <CardDescription>
                    When violations occur most frequently
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart 
                        data={[
                          { time: '6 AM', count: 10 },
                          { time: '9 AM', count: 35 },
                          { time: '12 PM', count: 25 },
                          { time: '3 PM', count: 30 },
                          { time: '6 PM', count: 45 },
                          { time: '9 PM', count: 40 },
                          { time: '12 AM', count: 15 }
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="count" name="Violations" stroke="#FF8042" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Year-to-Year Comparison</CardTitle>
                <CardDescription>
                  Fine trends across multiple years
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart 
                      data={[
                        { month: 'Jan', '2021': 45, '2022': 55, '2023': 65 },
                        { month: 'Feb', '2021': 50, '2022': 60, '2023': 75 },
                        { month: 'Mar', '2021': 55, '2022': 65, '2023': 80 },
                        { month: 'Apr', '2021': 60, '2022': 70, '2023': 70 },
                        { month: 'May', '2021': 65, '2022': 75, '2023': 90 },
                        { month: 'Jun', '2021': 70, '2022': 80, '2023': 100 },
                        { month: 'Jul', '2021': 75, '2022': 85, '2023': 110 },
                        { month: 'Aug', '2021': 80, '2022': 90, '2023': 120 },
                        { month: 'Sep', '2021': 85, '2022': 95, '2023': 130 },
                        { month: 'Oct', '2021': 90, '2022': 100, '2023': 125 },
                        { month: 'Nov', '2021': 85, '2022': 95, '2023': 115 },
                        { month: 'Dec', '2021': 80, '2022': 90, '2023': 95 }
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="2021" stroke="#8884d8" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="2022" stroke="#82ca9d" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="2023" stroke="#ffc658" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Compliance Rate Trend</CardTitle>
                  <CardDescription>
                    Percentage of fines paid over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart 
                        data={[
                          { month: 'Jan', rate: 65 },
                          { month: 'Feb', rate: 68 },
                          { month: 'Mar', rate: 70 },
                          { month: 'Apr', rate: 72 },
                          { month: 'May', rate: 75 },
                          { month: 'Jun', rate: 78 },
                          { month: 'Jul', rate: 80 },
                          { month: 'Aug', rate: 82 },
                          { month: 'Sep', rate: 85 },
                          { month: 'Oct', rate: 87 },
                          { month: 'Nov', rate: 88 },
                          { month: 'Dec', rate: 90 }
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis domain={[50, 100]} />
                        <Tooltip formatter={(value) => [`${value}%`, "Compliance Rate"]} />
                        <Legend />
                        <Line type="monotone" dataKey="rate" name="Compliance Rate %" stroke="#00C49F" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Average Fine Amount</CardTitle>
                  <CardDescription>
                    Average fine amount trend by month
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={[
                          { month: 'Jan', avg: 1800 },
                          { month: 'Feb', avg: 1850 },
                          { month: 'Mar', avg: 1900 },
                          { month: 'Apr', avg: 1950 },
                          { month: 'May', avg: 2000 },
                          { month: 'Jun', avg: 2050 },
                          { month: 'Jul', avg: 2100 },
                          { month: 'Aug', avg: 2150 },
                          { month: 'Sep', avg: 2200 },
                          { month: 'Oct', avg: 2250 },
                          { month: 'Nov', avg: 2300 },
                          { month: 'Dec', avg: 2350 }
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`₹${value}`, "Average Fine"]} />
                        <Legend />
                        <Bar dataKey="avg" name="Average Fine (₹)" fill="#FF8042" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Locations Tab */}
          <TabsContent value="locations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Violation Locations</CardTitle>
                <CardDescription>
                  Areas with highest number of reported violations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={locationData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="fines" name="Number of Fines" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Violation Types by Location</CardTitle>
                  <CardDescription>
                    Most common violations for top locations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={[
                          { name: 'Connaught Place', speeding: 40, parking: 30, redLight: 50 },
                          { name: 'India Gate', speeding: 35, parking: 20, redLight: 30 },
                          { name: 'Saket', speeding: 25, parking: 25, redLight: 15 },
                          { name: 'Karol Bagh', speeding: 15, parking: 30, redLight: 10 }
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="speeding" name="Speeding" fill="#0088FE" />
                        <Bar dataKey="parking" name="Illegal Parking" fill="#00C49F" />
                        <Bar dataKey="redLight" name="Red Light" fill="#FF8042" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Fine Collection by District</CardTitle>
                  <CardDescription>
                    Total fine amount collected by district
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Central Delhi', value: 35 },
                            { name: 'South Delhi', value: 25 },
                            { name: 'North Delhi', value: 15 },
                            { name: 'East Delhi', value: 10 },
                            { name: 'West Delhi', value: 15 }
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {violationsData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Downloaded Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Generated Reports</CardTitle>
            <CardDescription>
              Previously generated reports that you can download
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-md">
                <div className="flex items-center space-x-4">
                  <FileText className="h-8 w-8 text-gray-500" />
                  <div>
                    <p className="font-medium">Monthly Violations Report - October 2023</p>
                    <p className="text-sm text-muted-foreground">Generated on 01 Nov 2023</p>
                  </div>
                </div>
                <Button size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-md">
                <div className="flex items-center space-x-4">
                  <FileText className="h-8 w-8 text-gray-500" />
                  <div>
                    <p className="font-medium">Quarterly Revenue Analysis - Q3 2023</p>
                    <p className="text-sm text-muted-foreground">Generated on 15 Oct 2023</p>
                  </div>
                </div>
                <Button size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-md">
                <div className="flex items-center space-x-4">
                  <FileText className="h-8 w-8 text-gray-500" />
                  <div>
                    <p className="font-medium">Location-based Violation Analysis - September 2023</p>
                    <p className="text-sm text-muted-foreground">Generated on 05 Oct 2023</p>
                  </div>
                </div>
                <Button size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminReportsPage;
