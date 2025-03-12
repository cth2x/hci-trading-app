import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tabs,
  Tab,
  useTheme,
  Divider,
  Button,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as AccountBalanceIcon,
  FilterList as FilterListIcon,
  PieChart as PieChartIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import {
  mockPortfolio,
  updateAssetPrices,
  mockAssets,
} from '../../services/mockData';
import { PortfolioItem, Asset } from '../../types';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { useNavigate } from 'react-router-dom';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`portfolio-tabpanel-${index}`}
      aria-labelledby={`portfolio-tab-${index}`}
      {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const Portfolio: React.FC = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();

  const [portfolio, setPortfolio] = useState(mockPortfolio);
  const [assets, setAssets] = useState(mockAssets);
  const [tabValue, setTabValue] = useState(0);

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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Filter portfolio by asset type
  const filteredPortfolio =
    tabValue === 0
      ? portfolio
      : tabValue === 1
      ? portfolio.filter((item) => item.type === 'stock')
      : tabValue === 2
      ? portfolio.filter((item) => item.type === 'crypto')
      : portfolio.filter((item) => item.type === 'commodity');

  // Prepare data for pie chart
  const pieChartData = [
    {
      name: 'Stocks',
      value: portfolio
        .filter((item) => item.type === 'stock')
        .reduce((sum, item) => sum + item.totalValue, 0),
    },
    {
      name: 'Crypto',
      value: portfolio
        .filter((item) => item.type === 'crypto')
        .reduce((sum, item) => sum + item.totalValue, 0),
    },
    {
      name: 'Commodities',
      value: portfolio
        .filter((item) => item.type === 'commodity')
        .reduce((sum, item) => sum + item.totalValue, 0),
    },
  ].filter((item) => item.value > 0);

  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Portfolio
      </Typography>

      <Grid container spacing={3}>
        {/* Portfolio Summary */}
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardHeader
              title="Portfolio Summary"
              avatar={
                <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                  <AccountBalanceIcon />
                </Avatar>
              }
            />
            <CardContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Value
                </Typography>
                <Typography variant="h4">
                  ${portfolioValue.toLocaleString()}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Profit/Loss
                </Typography>
                <Typography
                  variant="h5"
                  color={totalProfitLoss >= 0 ? 'success.main' : 'error.main'}
                  sx={{ display: 'flex', alignItems: 'center' }}>
                  {totalProfitLoss >= 0 ? (
                    <TrendingUpIcon />
                  ) : (
                    <TrendingDownIcon />
                  )}
                  ${Math.abs(totalProfitLoss).toLocaleString()}
                  <Typography
                    component="span"
                    variant="body1"
                    color={totalProfitLoss >= 0 ? 'success.main' : 'error.main'}
                    sx={{ ml: 1 }}>
                    ({totalProfitLoss >= 0 ? '+' : ''}
                    {profitLossPercentage.toFixed(2)}%)
                  </Typography>
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Asset Allocation
                </Typography>
                <Box sx={{ height: 200, mt: 2 }}>
                  {pieChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }>
                          {pieChartData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => [
                            `$${value.toLocaleString()}`,
                            'Value',
                          ]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                      }}>
                      <Typography variant="body2" color="text.secondary">
                        No assets in portfolio
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>

              <Button
                variant="contained"
                fullWidth
                onClick={() => navigate('/trading')}>
                Trade Assets
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Portfolio Holdings */}
        <Grid item xs={12} md={8}>
          <Card elevation={2}>
            <CardHeader
              title="Your Holdings"
              avatar={
                <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                  <PieChartIcon />
                </Avatar>
              }
              action={
                <IconButton aria-label="filter">
                  <FilterListIcon />
                </IconButton>
              }
            />
            <CardContent>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="portfolio tabs"
                variant="fullWidth">
                <Tab label="All Assets" />
                <Tab label="Stocks" />
                <Tab label="Crypto" />
                <Tab label="Commodities" />
              </Tabs>

              <TabPanel value={tabValue} index={0}>
                <PortfolioTable portfolio={filteredPortfolio} />
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <PortfolioTable portfolio={filteredPortfolio} />
              </TabPanel>
              <TabPanel value={tabValue} index={2}>
                <PortfolioTable portfolio={filteredPortfolio} />
              </TabPanel>
              <TabPanel value={tabValue} index={3}>
                <PortfolioTable portfolio={filteredPortfolio} />
              </TabPanel>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

interface PortfolioTableProps {
  portfolio: PortfolioItem[];
}

const PortfolioTable: React.FC<PortfolioTableProps> = ({ portfolio }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleRowClick = (assetId: string) => {
    navigate(`/trading?asset=${assetId}`);
  };

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table sx={{ minWidth: 650 }} aria-label="portfolio table">
        <TableHead>
          <TableRow>
            <TableCell>Asset</TableCell>
            <TableCell align="right">Quantity</TableCell>
            <TableCell align="right">Avg. Buy Price</TableCell>
            <TableCell align="right">Current Price</TableCell>
            <TableCell align="right">Total Value</TableCell>
            <TableCell align="right">Profit/Loss</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {portfolio.length > 0 ? (
            portfolio.map((item) => (
              <TableRow
                key={item.assetId}
                hover
                onClick={() => handleRowClick(item.assetId)}
                sx={{ cursor: 'pointer' }}>
                <TableCell component="th" scope="row">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {item.symbol}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.name}
                      </Typography>
                    </Box>
                    <Chip
                      label={
                        item.type.charAt(0).toUpperCase() + item.type.slice(1)
                      }
                      size="small"
                      sx={{ ml: 1 }}
                      color={
                        item.type === 'stock'
                          ? 'primary'
                          : item.type === 'crypto'
                          ? 'secondary'
                          : 'success'
                      }
                    />
                  </Box>
                </TableCell>
                <TableCell align="right">{item.quantity}</TableCell>
                <TableCell align="right">
                  ${item.averageBuyPrice.toLocaleString()}
                </TableCell>
                <TableCell align="right">
                  ${item.currentPrice.toLocaleString()}
                </TableCell>
                <TableCell align="right">
                  ${item.totalValue.toLocaleString()}
                </TableCell>
                <TableCell align="right">
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                    }}>
                    {item.profitLoss >= 0 ? (
                      <TrendingUpIcon color="success" />
                    ) : (
                      <TrendingDownIcon color="error" />
                    )}
                    <Typography
                      variant="body2"
                      color={
                        item.profitLoss >= 0 ? 'success.main' : 'error.main'
                      }
                      sx={{ ml: 0.5 }}>
                      ${Math.abs(item.profitLoss).toLocaleString()} (
                      {item.profitLossPercentage >= 0 ? '+' : ''}
                      {item.profitLossPercentage.toFixed(2)}%)
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <Box sx={{ py: 3 }}>
                  <Typography variant="body1" color="text.secondary">
                    No assets found in this category
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={() => navigate('/trading')}>
                    Start Trading
                  </Button>
                </Box>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Portfolio;
