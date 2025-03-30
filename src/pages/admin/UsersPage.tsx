import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Check, Copy, Edit, Lock, MoreHorizontal, Plus, Search, Shield, Trash2, User, UserPlus, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AppUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "officer";
  status: "active" | "inactive" | "suspended";
  lastLogin: string;
  createdAt: string;
}

// Dummy data
const DEMO_USERS: AppUser[] = [
  {
    id: "u1",
    name: "Admin User",
    email: "admin@rtms.gov",
    role: "admin",
    status: "active",
    lastLogin: "2023-10-15T08:30:00Z",
    createdAt: "2023-01-01T00:00:00Z"
  },
  {
    id: "u2",
    name: "John Smith",
    email: "user@example.com",
    role: "user",
    status: "active",
    lastLogin: "2023-10-14T14:45:00Z",
    createdAt: "2023-03-15T00:00:00Z"
  },
  {
    id: "u3",
    name: "Rahul Kumar",
    email: "rahul.k@example.com",
    role: "user",
    status: "active",
    lastLogin: "2023-10-10T11:20:00Z",
    createdAt: "2023-04-22T00:00:00Z"
  },
  {
    id: "u4",
    name: "Priya Sharma",
    email: "priya.s@example.com",
    role: "user",
    status: "inactive",
    lastLogin: "2023-09-05T09:15:00Z",
    createdAt: "2023-05-18T00:00:00Z"
  },
  {
    id: "u5",
    name: "Officer Singh",
    email: "officer.singh@rtms.gov",
    role: "officer",
    status: "active",
    lastLogin: "2023-10-15T10:00:00Z",
    createdAt: "2023-02-10T00:00:00Z"
  },
  {
    id: "u6",
    name: "Amit Patel",
    email: "amit.p@example.com",
    role: "user",
    status: "suspended",
    lastLogin: "2023-08-20T16:30:00Z",
    createdAt: "2023-06-05T00:00:00Z"
  }
];

const AdminUsersPage = () => {
  const [users, setUsers] = useState<AppUser[]>(DEMO_USERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);
  
  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "user" | "officer">("user");
  const [isActive, setIsActive] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      searchTerm === "" || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "" || user.status === statusFilter;
    const matchesRole = roleFilter === "" || user.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });
  
  // Open add dialog and reset form
  const openAddDialog = () => {
    setName("");
    setEmail("");
    setRole("user");
    setIsActive(true);
    setPassword("");
    setConfirmPassword("");
    setIsAddDialogOpen(true);
  };
  
  // Open edit dialog and populate form
  const openEditDialog = (user: AppUser) => {
    setSelectedUser(user);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setIsActive(user.status === "active");
    setIsEditDialogOpen(true);
  };
  
  // Open delete confirmation dialog
  const openDeleteDialog = (user: AppUser) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };
  
  // Open password reset dialog
  const openPasswordDialog = (user: AppUser) => {
    setSelectedUser(user);
    setPassword("");
    setConfirmPassword("");
    setIsPasswordDialogOpen(true);
  };
  
  // Handle add user submission
  const handleAddUser = () => {
    if (!name || !email || !password) {
      toast({
        title: "Missing Fields",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "The passwords you entered do not match",
        variant: "destructive",
      });
      return;
    }
    
    // Check if email already exists
    if (users.some(user => user.email === email)) {
      toast({
        title: "Email Already Exists",
        description: "A user with this email already exists in the system",
        variant: "destructive",
      });
      return;
    }
    
    const newUser: AppUser = {
      id: `u${users.length + 1}`,
      name,
      email,
      role,
      status: isActive ? "active" : "inactive", // Ensure this is of type "active" | "inactive" | "suspended"
      lastLogin: "",
      createdAt: new Date().toISOString()
    };
    
    setUsers([...users, newUser]);
    setIsAddDialogOpen(false);
    
    toast({
      title: "User Added",
      description: "The user has been added successfully",
    });
  };
  
  // Handle edit user submission
  const handleEditUser = () => {
    if (!selectedUser) return;
    
    if (!name || !email) {
      toast({
        title: "Missing Fields",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // Check if email already exists (for other users)
    if (users.some(user => user.email === email && user.id !== selectedUser.id)) {
      toast({
        title: "Email Already Exists",
        description: "Another user with this email already exists in the system",
        variant: "destructive",
      });
      return;
    }
    
    const updatedUsers = users.map(user => {
      if (user.id === selectedUser.id) {
        return {
          ...user,
          name,
          email,
          role,
          status: isActive ? "active" : "inactive"
        };
      }
      return user;
    });
    
    setUsers(updatedUsers);
    setIsEditDialogOpen(false);
    
    toast({
      title: "User Updated",
      description: "The user has been updated successfully",
    });
  };
  
  // Handle delete user confirmation
  const handleDeleteUser = () => {
    if (!selectedUser) return;
    
    const updatedUsers = users.filter(user => user.id !== selectedUser.id);
    setUsers(updatedUsers);
    setIsDeleteDialogOpen(false);
    
    toast({
      title: "User Deleted",
      description: "The user has been deleted successfully",
    });
  };
  
  // Handle password reset
  const handlePasswordReset = () => {
    if (!selectedUser) return;
    
    if (!password) {
      toast({
        title: "Missing Field",
        description: "Please enter a new password",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "The passwords you entered do not match",
        variant: "destructive",
      });
      return;
    }
    
    setIsPasswordDialogOpen(false);
    
    toast({
      title: "Password Reset",
      description: `Password has been reset for ${selectedUser.name}`,
    });
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "Never";
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };
  
  // Format time for display
  const formatTime = (dateString: string) => {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return "bg-blue-100 text-blue-800";
      case 'officer':
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return "bg-green-100 text-green-800";
      case 'inactive':
        return "bg-gray-100 text-gray-800";
      case 'suspended':
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
            <p className="text-muted-foreground">
              Manage users, their roles, and permissions in the system
            </p>
          </div>
          <Button onClick={openAddDialog}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add New User
          </Button>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>System Users</CardTitle>
            <CardDescription>
              Total users: {users.length} | Active: {users.filter(user => user.status === "active").length} | 
              Admins: {users.filter(user => user.role === "admin").length} | 
              Officers: {users.filter(user => user.role === "officer").length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex gap-2 flex-1">
                <Input
                  placeholder="Search by name or email..."
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
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="officer">Officer</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getRoleBadgeColor(user.role)}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusBadgeColor(user.status)}>
                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.lastLogin ? (
                            <div>
                              <div>{formatDate(user.lastLogin)}</div>
                              <div className="text-xs text-gray-500">{formatTime(user.lastLogin)}</div>
                            </div>
                          ) : (
                            <span className="text-gray-500">Never</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => openEditDialog(user)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openPasswordDialog(user)}>
                                <Lock className="mr-2 h-4 w-4" />
                                Reset Password
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => openDeleteDialog(user)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center h-24">
                        No users found matching your search criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        
        {/* Add User Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user account with specified role and permissions
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-5 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter user's full name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">User Role</Label>
                  <Select
                    value={role}
                    onValueChange={(value) => setRole(value as "admin" | "user" | "officer")}
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Regular User</SelectItem>
                      <SelectItem value="officer">Traffic Officer</SelectItem>
                      <SelectItem value="admin">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Account Status</Label>
                  <div className="flex items-center justify-between h-10 px-4 border rounded-md">
                    <span className="text-sm">Active</span>
                    <Switch
                      id="status"
                      checked={isActive}
                      onCheckedChange={setIsActive}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddUser}>
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update user account details and permissions
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-5 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email Address</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-role">User Role</Label>
                  <Select
                    value={role}
                    onValueChange={(value) => setRole(value as "admin" | "user" | "officer")}
                  >
                    <SelectTrigger id="edit-role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Regular User</SelectItem>
                      <SelectItem value="officer">Traffic Officer</SelectItem>
                      <SelectItem value="admin">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Account Status</Label>
                  <div className="flex items-center justify-between h-10 px-4 border rounded-md">
                    <span className="text-sm">Active</span>
                    <Switch
                      id="edit-status"
                      checked={isActive}
                      onCheckedChange={setIsActive}
                    />
                  </div>
                </div>
              </div>
              
              {selectedUser && (
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                  <div>
                    <span>Created: </span>
                    <span>{formatDate(selectedUser.createdAt)}</span>
                  </div>
                  <div>
                    <span>Last Login: </span>
                    <span>{selectedUser.lastLogin ? formatDate(selectedUser.lastLogin) : "Never"}</span>
                  </div>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditUser}>
                <Check className="mr-2 h-4 w-4" />
                Update User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Delete User Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this user? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            
            {selectedUser && (
              <div className="py-4">
                <p className="mb-2"><strong>Name:</strong> {selectedUser.name}</p>
                <p className="mb-2"><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Role:</strong> {selectedUser.role}</p>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteUser}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Reset Password Dialog */}
        <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Reset Password</DialogTitle>
              <DialogDescription>
                Set a new password for {selectedUser?.name}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-5 py-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-new-password">Confirm New Password</Label>
                <Input
                  id="confirm-new-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handlePasswordReset}>
                <Lock className="mr-2 h-4 w-4" />
                Reset Password
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminUsersPage;
