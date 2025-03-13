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
      <Typography variant="h5" sx={{ mb: 2 }}>
        Welcome back, {user?.name || 'User'}
      </Typography>

      <Grid container spacing={2}>
        {/* Account Summary */}
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardHeader
              title="Account Summary"
              avatar={
                <Avatar sx={{ bgcolor: 'rgba(100, 181, 246, 0.2)' }}>
                  <AccountBalanceIcon sx={{ color: '#90caf9' }} />
                </Avatar>
              }
              sx={{ py: 1 }}
            />
            <CardContent sx={{ py: 1 }}>
              <Box sx={{ mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Available Balance
                </Typography>
                <Typography variant="h5">
                  ${userBalance.toLocaleString()}
                </Typography>
              </Box>

              <Box sx={{ mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Portfolio Value
                </Typography>
                <Typography variant="h5">
                  ${portfolioValue.toLocaleString()}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Assets
                </Typography>
                <Typography variant="h5">
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
                <Avatar sx={{ bgcolor: 'rgba(100, 181, 246, 0.2)' }}>
                  <ShowChartIcon sx={{ color: '#90caf9' }} />
                </Avatar>
              }
              sx={{ py: 1 }}
            />
            <CardContent sx={{ py: 1 }}>
              <Box sx={{ height: 180 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{
                      top: 5,
                      right: 20,
                      left: 10,
                      bottom: 5,
                    }}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255, 255, 255, 0.1)"
                    />
                    <XAxis dataKey="name" stroke="rgba(255, 255, 255, 0.7)" />
                    <YAxis stroke="rgba(255, 255, 255, 0.7)" />
                    <Tooltip
                      formatter={(value) => [`$${value}`, 'Value']}
                      contentStyle={{
                        backgroundColor: '#2c2c2c',
                        border: 'none',
                      }}
                      labelStyle={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#90caf9"
                      strokeWidth={2}
                      dot={{
                        stroke: '#90caf9',
                        strokeWidth: 2,
                        r: 4,
                        fill: '#1e1e1e',
                      }}
                      activeDot={{
                        r: 6,
                        stroke: '#90caf9',
                        strokeWidth: 2,
                        fill: '#90caf9',
                      }}
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
                <Avatar sx={{ bgcolor: 'rgba(100, 181, 246, 0.2)' }}>
                  <TrendingUpIcon sx={{ color: '#90caf9' }} />
                </Avatar>
              }
              action={
                <IconButton aria-label="settings" size="small">
                  <MoreVertIcon />
                </IconButton>
              }
              sx={{ py: 1 }}
            />
            <CardContent sx={{ maxHeight: 300, overflow: 'auto', py: 0 }}>
              <List disablePadding dense>
                {assets.slice(0, 7).map((asset) => (
                  <React.Fragment key={asset.id}>
                    <ListItem
                      secondaryAction={
                        <Chip
                          icon={
                            asset.priceChange >= 0 ? (
                              <TrendingUpIcon fontSize="small" />
                            ) : (
                              <TrendingDownIcon fontSize="small" />
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
                <Avatar sx={{ bgcolor: 'rgba(100, 181, 246, 0.2)' }}>
                  <PaidIcon sx={{ color: '#90caf9' }} />
                </Avatar>
              }
              action={
                <IconButton aria-label="settings" size="small">
                  <MoreVertIcon />
                </IconButton>
              }
              sx={{ py: 1 }}
            />
            <CardContent sx={{ maxHeight: 300, overflow: 'auto', py: 0 }}>
              <List disablePadding dense>
                {transactions.slice(0, 7).map((transaction) => (
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
                              color="text.secondary"
                              display="block">
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
