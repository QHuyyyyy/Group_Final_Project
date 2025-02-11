
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Legend,
  Cell
} from "recharts";
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  List, ListItem, ListItemText,
  Chip
} from "@mui/material";
import { People, Business, Receipt, AccountCircle } from "@mui/icons-material";

const AdminDashboard = () => {
  const userStats = 1534;
  const projectStats = 342; 
  const claimStats = {
    total: 298,
    pending: 124,
    approved: 84,
    rejected: 32,
    paid: 58,
  };
  const claimsData = [
    { status: "Pending", count: 124 },
    { status: "Approved", count: 84 },
    { status: "Rejected", count: 32 },
    { status: "Paid", count: 58 },
  ];
  const claimCategories = [
    { name: "Employment contracts", value: 40 },
    { name: "Customer complaints", value: 30 },
    { name: "Insurance policies", value: 20 },
    { name: "Other", value: 10 },
  ];
  const recentClaims = [
    { id: 1, name: "Overtime Payment", status: "Pending", claimer: "John Doe" },
    { id: 2, name: "Travel Reimbursement", status: "Approved", claimer: "Jane Smith" },
    { id: 3, name: "Project Bonus", status: "Rejected", claimer: "Alice Johnson" },
    { id: 4, name: "Meal Allowance", status: "Paid", claimer: "Bob Brown" },
  ];
  const recentActivities = [
    { activity: "User John approved a claim", time: "2 hours ago" },
    { activity: "Project Alpha was completed", time: "5 hours ago" },
    { activity: "User Sarah submitted a claim", time: "Yesterday" },
    { activity: "Admin assigned a user to Project Beta", time: "2 days ago" },
  ];
  const projectTrendData = [
    { month: "Jan", projects: 20 },
    { month: "Feb", projects: 30 },
    { month: "Mar", projects: 45 },
    { month: "Apr", projects: 50 },
    { month: "May", projects: 40 },
    { month: "Jun", projects: 55 },
  ];
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]; // colors for pie chart
  return (
    <Box p={3} bgcolor="#f2f9fc" minHeight="100vh">
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Admin Dashboard
      </Typography>
      {/* Stats Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent style={{ display: "flex", alignItems: "center" }}>
              <People style={{ fontSize: 40, color: "#2196f3", marginRight: 16 }} />
              <div>
                <Typography variant="h6">Total Users</Typography>
                <Typography variant="h5" fontWeight="bold">
                  {userStats}
                </Typography>
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent style={{ display: "flex", alignItems: "center" }}>
              <Business style={{ fontSize: 40, color: "#4caf50", marginRight: 16 }} />
              <div>
                <Typography variant="h6">Total Projects</Typography>
                <Typography variant="h5" fontWeight="bold">
                  {projectStats}
                </Typography>
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent style={{ display: "flex", alignItems: "center" }}>
              <Receipt style={{ fontSize: 40, color: "#ff9800", marginRight: 16 }} />
              <div>
                <Typography variant="h6">Total Claims</Typography>
                <Typography variant="h5" fontWeight="bold">
                  {claimStats.total}
                </Typography>
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent style={{ display: "flex", alignItems: "center" }}>
              <AccountCircle style={{ fontSize: 40, color: "#f44336", marginRight: 16 }} />
              <div>
                <Typography variant="h6">Pending Claims</Typography>
                <Typography variant="h5" fontWeight="bold">
                  {claimStats.pending}
                </Typography>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Project Trends Chart */}
      <Box mt={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{
              fontWeight:"bold"
            }}>
              Project Trends
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <XAxis dataKey="month" tick={{ fontSize: 14, fill: "#555" }} />
                <YAxis tick={{ fontSize: 14, fill: "#555" }} />
                <Tooltip contentStyle={{ backgroundColor: "#fff", borderRadius: 8 }} />
                <Legend verticalAlign="top" height={36} />
                <Bar dataKey="projects" fill="#4caf50" barSize={40} radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Box>

      {/* Chart Section */}
      <Box mt={4}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{
                  fontWeight:"bold"
                }}>
                  Claim Request Overview
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={claimsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{
                  fontWeight:"bold"
                }}>
                  Claims by Category
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={claimCategories}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      label
                    >
                      {claimCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      <Box
  sx={{
    display: "flex",
    justifyContent: "center", // Centers horizontally
    alignItems: "center", // Centers vertically
    
  }}
>
  <Box
    sx={{
      display: "flex",
      justifyItems: "center",
      alignItems: "center",
      gap: 5,
    }}
  >
    {/* Recent Claims Section */}
    <Box mt={4} sx={{
      width:"60rem"
    }}>
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{
            fontWeight:"bold"
          }}
          gutterBottom>
            Recent Claims
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Claim Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Claimer</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentClaims.map((claim) => (
                  <TableRow key={claim.id}>
                    <TableCell>{claim.id}</TableCell>
                    <TableCell>{claim.name}</TableCell>
                    <TableCell>
                      <Chip
                        label={claim.status}
                        sx={{
                          backgroundColor:
                            claim.status === "Pending"
                              ? "#FFEB3B"
                              : claim.status === "Approved"
                              ? "#4CAF50"
                              : claim.status === "Rejected"
                              ? "#F44336"
                              : claim.status === "Paid"
                              ? "#2196F3"
                              : "default",
                          color: claim.status === "Pending" ? "black" : "white",
                          fontWeight: "bold",
                        }}
                      />
                    </TableCell>
                    <TableCell>{claim.claimer}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>

    <Box mt={4} sx={{
      width:"28.5rem"
    }}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{
            fontWeight:"bold"
          }}>
            Recent Activities
          </Typography>
          <List>
            {recentActivities.map((activity, index) => (
              <ListItem key={index} divider>
                <ListItemText primary={activity.activity} secondary={activity.time} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  </Box>
</Box>

    </Box>
  );
};

export default AdminDashboard;
