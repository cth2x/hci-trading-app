import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  ShowChart as ShowChartIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
} from '@mui/icons-material';
import {
  mockReportData,
  mockTransactions,
  mockPortfolio,
} from '../../services/mockData';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from 'recharts';

const Reports: React.FC = () => {
  const theme = useTheme();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>(
    'month'
  );

  const handleTimeRangeChange = (
    event: React.MouseEvent<HTMLElement>,
    newTimeRange: 'week' | 'month' | 'year' | null
  ) => {
    if (newTimeRange !== null) {
      setTimeRange(newTimeRange);
    }
  };

  // Format performance history data for chart
  const performanceData = mockReportData.performanceHistory.map((item) => ({
    date: new Date(item.date).toLocaleDateString(),
    value: item.portfolioValue,
  }));

  // Format asset distribution data for pie chart
  const distributionData = mockReportData.assetDistribution.map((item) => ({
    name: item.type.charAt(0).toUpperCase() + item.type.slice(1),
    value: item.percentage,
  }));

  // Format transaction data for bar chart
  const transactionsByDay: Record<string, { buys: number; sells: number }> = {};

  mockTransactions.forEach((transaction) => {
    const date = new Date(transaction.timestamp).toLocaleDateString();
    if (!transactionsByDay[date]) {
      transactionsByDay[date] = { buys: 0, sells: 0 };
    }

    if (transaction.type === 'buy') {
      transactionsByDay[date].buys += transaction.total;
    } else {
      transactionsByDay[date].sells += transaction.total;
    }
  });

  const transactionData = Object.entries(transactionsByDay).map(
    ([date, data]) => ({
      date,
      buys: data.buys,
      sells: data.sells,
    })
  );

  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Reports & Insights
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <ToggleButtonGroup
          value={timeRange}
          exclusive
          onChange={handleTimeRangeChange}
          aria-label="time range"
          size="small">
          <ToggleButton value="week" aria-label="week">
            Week
          </ToggleButton>
          <ToggleButton value="month" aria-label="month">
            Month
          </ToggleButton>
          <ToggleButton value="year" aria-label="year">
            Year
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Grid container spacing={3}>
        {/* Performance Summary */}
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardHeader
              title="Performance Summary"
              avatar={
                <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                  <AssessmentIcon />
                </Avatar>
              }
            />
            <CardContent>
              <List disablePadding>
                <ListItem>
                  <ListItemText
                    primary="Total Trades"
                    secondary={mockReportData.totalTrades}
                  />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemText
                    primary="Buy Transactions"
                    secondary={mockReportData.totalBuys}
                  />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemText
                    primary="Sell Transactions"
                    secondary={mockReportData.totalSells}
                  />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemText
                    primary="Total Profit/Loss"
                    secondary={
                      <Typography
                        variant="body2"
                        color={
                          mockReportData.profitLoss >= 0
                            ? 'success.main'
                            : 'error.main'
                        }
                        sx={{ display: 'flex', alignItems: 'center' }}>
                        {mockReportData.profitLoss >= 0 ? (
                          <TrendingUpIcon fontSize="small" sx={{ mr: 0.5 }} />
                        ) : (
                          <TrendingDownIcon fontSize="small" sx={{ mr: 0.5 }} />
                        )}
                        ${mockReportData.profitLoss.toLocaleString()} (
                        {mockReportData.profitLossPercentage.toFixed(2)}%)
                      </Typography>
                    }
                  />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemText
                    primary="Most Traded Asset"
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2">
                          {mockReportData.mostTradedAsset.name} (
                          {mockReportData.mostTradedAsset.symbol})
                        </Typography>
                        <Chip
                          label={`${mockReportData.mostTradedAsset.trades} trades`}
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      </Box>
                    }
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Portfolio Performance Chart */}
        <Grid item xs={12} md={8}>
          <Card elevation={2}>
            <CardHeader
              title="Portfolio Performance"
              avatar={
                <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                  <ShowChartIcon />
                </Avatar>
              }
            />
            <CardContent>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={performanceData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, 'Value']} />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={theme.palette.primary.main}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Asset Distribution */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardHeader
              title="Asset Distribution"
              avatar={
                <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                  <PieChartIcon />
                </Avatar>
              }
            />
            <CardContent>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }>
                      {distributionData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${value}%`, 'Percentage']}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Transaction Activity */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardHeader
              title="Transaction Activity"
              avatar={
                <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                  <BarChartIcon />
                </Avatar>
              }
            />
            <CardContent>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={transactionData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                    <Legend />
                    <Bar
                      dataKey="buys"
                      name="Buy Transactions"
                      fill={theme.palette.success.main}
                    />
                    <Bar
                      dataKey="sells"
                      name="Sell Transactions"
                      fill={theme.palette.error.main}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Transactions */}
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardHeader
              title="Recent Transactions"
              avatar={
                <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                  <AssessmentIcon />
                </Avatar>
              }
            />
            <CardContent>
              <TableContainer component={Paper} variant="outlined">
                <Table sx={{ minWidth: 650 }} aria-label="transaction table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Asset</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Total</TableCell>
                      <TableCell>Notes</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          {new Date(transaction.timestamp).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={transaction.type.toUpperCase()}
                            color={
                              transaction.type === 'buy' ? 'success' : 'error'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{transaction.symbol}</TableCell>
                        <TableCell align="right">
                          {transaction.quantity}
                        </TableCell>
                        <TableCell align="right">
                          ${transaction.price.toLocaleString()}
                        </TableCell>
                        <TableCell align="right">
                          ${transaction.total.toLocaleString()}
                        </TableCell>
                        <TableCell>{transaction.notes || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;
