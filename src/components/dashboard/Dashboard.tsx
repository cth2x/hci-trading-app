import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Avatar,
  useTheme,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  MoreVert as MoreVertIcon,
  AccountBalance as AccountBalanceIcon,
  Paid as PaidIcon,
  ShowChart as ShowChartIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import {
  mockAssets,
  mockPortfolio,
  mockTransactions,
  updateAssetPrices,
} from '../../services/mockData';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const theme = useTheme();

  const [assets, setAssets] = useState(mockAssets);
  const [portfolio, setPortfolio] = useState(mockPortfolio);
  const [transactions, setTransactions] = useState(mockTransactions);

  // Calculate portfolio value
  const portfolioValue = portfolio.reduce(
    (total, item) => total + item.totalValue,
    0
  );
  const totalProfitLoss = portfolio.reduce(
    (total, item) => total + item.profitLoss,
    0
  );
  const profitLossPercentage =
    (totalProfitLoss / (portfolioValue - totalProfitLoss)) * 100;

  // Get user balance with fallback
  const userBalance = user?.balance || 0;

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedAssets = updateAssetPrices();
      setAssets(updatedAssets);

      // Update portfolio with new prices
      const updatedPortfolio = portfolio.map((item) => {
        const asset = updatedAssets.find((a) => a.id === item.assetId);
        if (!asset) return item;

        const newTotalValue = item.quantity * asset.currentPrice;
        const newProfitLoss =
          newTotalValue - item.quantity * item.averageBuyPrice;
        const newProfitLossPercentage =
          (newProfitLoss / (item.quantity * item.averageBuyPrice)) * 100;

        return {
          ...item,
          currentPrice: asset.currentPrice,
          totalValue: newTotalValue,
          profitLoss: newProfitLoss,
          profitLossPercentage: newProfitLossPercentage,
        };
      });

      setPortfolio(updatedPortfolio);
    }, 5000);

    return () => clearInterval(interval);
  }, [portfolio]);

  // Generate chart data
  const chartData = [
    { name: 'Mon', value: 10000 },
    { name: 'Tue', value: 12000 },
    { name: 'Wed', value: 11500 },
    { name: 'Thu', value: 13500 },
    { name: 'Fri', value: 14000 },
    { name: 'Sat', value: 15000 },
    { name: 'Sun', value: portfolioValue + userBalance },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Welcome back, {user?.name || 'User'}
      </Typography>

      <Grid container spacing={3}>
        {/* Account Summary */}
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardHeader
              title="Account Summary"
              avatar={
                <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                  <AccountBalanceIcon />
                </Avatar>
              }
            />
            <CardContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Available Balance
                </Typography>
                <Typography variant="h4">
                  ${userBalance.toLocaleString()}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Portfolio Value
                </Typography>
                <Typography variant="h4">
                  ${portfolioValue.toLocaleString()}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Assets
                </Typography>
                <Typography variant="h4">
                  ${(userBalance + portfolioValue).toLocaleString()}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Portfolio Performance */}
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
              <Box sx={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
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

        {/* Market Overview */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardHeader
              title="Market Overview"
              avatar={
                <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                  <TrendingUpIcon />
                </Avatar>
              }
              action={
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              }
            />
            <CardContent sx={{ maxHeight: 300, overflow: 'auto' }}>
              <List disablePadding>
                {assets.slice(0, 5).map((asset) => (
                  <React.Fragment key={asset.id}>
                    <ListItem
                      secondaryAction={
                        <Chip
                          icon={
                            asset.priceChange >= 0 ? (
                              <TrendingUpIcon />
                            ) : (
                              <TrendingDownIcon />
                            )
                          }
                          label={`${
                            asset.priceChange >= 0 ? '+' : ''
                          }${asset.priceChangePercentage.toFixed(2)}%`}
                          color={asset.priceChange >= 0 ? 'success' : 'error'}
                          size="small"
                        />
                      }>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 'medium' }}>
                              {asset.symbol}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ ml: 1, color: 'text.secondary' }}>
                              {asset.name}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Typography variant="body2">
                            ${asset.currentPrice.toLocaleString()}
                          </Typography>
                        }
                      />
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Transactions */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardHeader
              title="Recent Transactions"
              avatar={
                <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                  <PaidIcon />
                </Avatar>
              }
              action={
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              }
            />
            <CardContent sx={{ maxHeight: 300, overflow: 'auto' }}>
              <List disablePadding>
                {transactions.slice(0, 5).map((transaction) => (
                  <React.Fragment key={transaction.id}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Chip
                              label={transaction.type.toUpperCase()}
                              color={
                                transaction.type === 'buy'
                                  ? 'primary'
                                  : 'secondary'
                              }
                              size="small"
                              sx={{ mr: 1 }}
                            />
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 'medium' }}>
                              {transaction.symbol}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2">
                              {transaction.quantity} shares at $
                              {transaction.price.toLocaleString()}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary">
                              {new Date(
                                transaction.timestamp
                              ).toLocaleDateString()}{' '}
                              {new Date(
                                transaction.timestamp
                              ).toLocaleTimeString()}
                            </Typography>
                          </Box>
                        }
                      />
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 'medium' }}>
                          ${transaction.total.toLocaleString()}
                        </Typography>
                      </Box>
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
