import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  ToggleButtonGroup,
  ToggleButton,
  Divider,
  Alert,
  Snackbar,
  useTheme,
  InputAdornment,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  SelectChangeEvent,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  ShoppingCart as ShoppingCartIcon,
  Sell as SellIcon,
  Notes as NotesIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import {
  mockAssets,
  mockPortfolio,
  updateAssetPrices,
} from '../../services/mockData';
import { Asset, Transaction } from '../../types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const Trading: React.FC = () => {
  const { user } = useAuth();
  const theme = useTheme();

  const [assets, setAssets] = useState(mockAssets);
  const [portfolio, setPortfolio] = useState(mockPortfolio);
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [chartData, setChartData] = useState<
    { timestamp: Date; price: number }[]
  >([]);

  // Get user balance with fallback
  const userBalance = user?.balance || 0;

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedAssets = updateAssetPrices();
      setAssets(updatedAssets);

      if (selectedAsset) {
        const updatedAsset = updatedAssets.find(
          (a) => a.id === selectedAsset.id
        );
        if (updatedAsset) {
          setSelectedAsset(updatedAsset);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedAsset]);

  // Generate chart data when asset is selected
  useEffect(() => {
    if (selectedAsset) {
      // Generate mock chart data
      const data = [];
      const now = new Date();
      const basePrice = selectedAsset.currentPrice * 0.9;
      const volatility =
        selectedAsset.type === 'crypto'
          ? 0.05
          : selectedAsset.type === 'stock'
          ? 0.02
          : 0.01;

      for (let i = 30; i >= 0; i--) {
        const date = new Date();
        date.setDate(now.getDate() - i);

        const randomFactor = 1 + (Math.random() - 0.5) * volatility;
        const trendFactor = 1 + ((30 - i) / 30) * 0.1;

        const price =
          i === 0
            ? selectedAsset.currentPrice
            : basePrice * randomFactor * trendFactor;

        data.push({
          timestamp: date,
          price: Number(price.toFixed(2)),
        });
      }

      setChartData(data);
    }
  }, [selectedAsset]);

  const handleTradeTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newTradeType: 'buy' | 'sell' | null
  ) => {
    if (newTradeType !== null) {
      setTradeType(newTradeType);
      setError('');
    }
  };

  const handleAssetChange = (event: SelectChangeEvent<string>) => {
    const assetId = event.target.value;
    const asset = assets.find((a) => a.id === assetId) || null;
    setSelectedAsset(asset);
    setError('');
    setQuantity('');
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // Only allow numbers and decimals
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setQuantity(value);
      setError('');
    }
  };

  const handleNotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotes(event.target.value);
  };

  const validateTrade = (): boolean => {
    if (!selectedAsset) {
      setError('Please select an asset');
      return false;
    }

    if (!quantity || parseFloat(quantity) <= 0) {
      setError('Please enter a valid quantity');
      return false;
    }

    const quantityNum = parseFloat(quantity);

    if (tradeType === 'buy') {
      const totalCost = quantityNum * selectedAsset.currentPrice;
      if (totalCost > userBalance) {
        setError('Insufficient funds for this purchase');
        return false;
      }
    } else if (tradeType === 'sell') {
      const portfolioItem = portfolio.find(
        (item) => item.assetId === selectedAsset.id
      );
      if (!portfolioItem) {
        setError('You do not own this asset');
        return false;
      }

      if (quantityNum > portfolioItem.quantity) {
        setError(
          `You only have ${portfolioItem.quantity} ${selectedAsset.symbol} to sell`
        );
        return false;
      }
    }

    return true;
  };

  const executeTrade = () => {
    if (!validateTrade() || !selectedAsset) return;

    const quantityNum = parseFloat(quantity);
    const totalValue = quantityNum * selectedAsset.currentPrice;

    // Create a new transaction
    const newTransaction: Transaction = {
      id: Math.random().toString(36).substring(2, 9),
      userId: user?.id || '1',
      assetId: selectedAsset.id,
      type: tradeType,
      symbol: selectedAsset.symbol,
      quantity: quantityNum,
      price: selectedAsset.currentPrice,
      total: totalValue,
      timestamp: new Date(),
      notes: notes || undefined,
    };

    // Update portfolio
    if (tradeType === 'buy') {
      // Deduct from balance
      if (user) {
        user.balance -= totalValue;
      }

      // Add to portfolio or update existing
      const existingItem = portfolio.find(
        (item) => item.assetId === selectedAsset.id
      );
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantityNum;
        const newAverageBuyPrice =
          (existingItem.quantity * existingItem.averageBuyPrice + totalValue) /
          newQuantity;

        const updatedPortfolio = portfolio.map((item) =>
          item.assetId === selectedAsset.id
            ? {
                ...item,
                quantity: newQuantity,
                averageBuyPrice: newAverageBuyPrice,
                totalValue: newQuantity * selectedAsset.currentPrice,
                profitLoss:
                  newQuantity * selectedAsset.currentPrice -
                  newQuantity * newAverageBuyPrice,
                profitLossPercentage:
                  ((selectedAsset.currentPrice - newAverageBuyPrice) /
                    newAverageBuyPrice) *
                  100,
              }
            : item
        );

        setPortfolio(updatedPortfolio);
      } else {
        // Add new item to portfolio
        const newItem = {
          assetId: selectedAsset.id,
          symbol: selectedAsset.symbol,
          name: selectedAsset.name,
          type: selectedAsset.type,
          quantity: quantityNum,
          averageBuyPrice: selectedAsset.currentPrice,
          currentPrice: selectedAsset.currentPrice,
          totalValue: totalValue,
          profitLoss: 0,
          profitLossPercentage: 0,
        };

        setPortfolio([...portfolio, newItem]);
      }

      setSuccess(
        `Successfully purchased ${quantityNum} ${
          selectedAsset.symbol
        } for $${totalValue.toLocaleString()}`
      );
    } else {
      // Sell logic
      // Add to balance
      if (user) {
        user.balance += totalValue;
      }

      // Update portfolio
      const existingItem = portfolio.find(
        (item) => item.assetId === selectedAsset.id
      );
      if (existingItem) {
        if (existingItem.quantity === quantityNum) {
          // Remove item from portfolio
          setPortfolio(
            portfolio.filter((item) => item.assetId !== selectedAsset.id)
          );
        } else {
          // Update quantity
          const updatedPortfolio = portfolio.map((item) =>
            item.assetId === selectedAsset.id
              ? {
                  ...item,
                  quantity: item.quantity - quantityNum,
                  totalValue:
                    (item.quantity - quantityNum) * selectedAsset.currentPrice,
                  profitLoss:
                    (item.quantity - quantityNum) * selectedAsset.currentPrice -
                    (item.quantity - quantityNum) * item.averageBuyPrice,
                  profitLossPercentage:
                    ((selectedAsset.currentPrice - item.averageBuyPrice) /
                      item.averageBuyPrice) *
                    100,
                }
              : item
          );

          setPortfolio(updatedPortfolio);
        }
      }

      setSuccess(
        `Successfully sold ${quantityNum} ${
          selectedAsset.symbol
        } for $${totalValue.toLocaleString()}`
      );
    }

    // Reset form
    setQuantity('');
    setNotes('');
  };

  const calculateTotal = (): number => {
    if (!selectedAsset || !quantity || isNaN(parseFloat(quantity))) {
      return 0;
    }

    return parseFloat(quantity) * selectedAsset.currentPrice;
  };

  const handleCloseSnackbar = () => {
    setSuccess('');
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Trading
      </Typography>

      <Grid container spacing={3}>
        {/* Trading Form */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardHeader
              title={tradeType === 'buy' ? 'Buy Assets' : 'Sell Assets'}
              avatar={
                <Avatar
                  sx={{
                    bgcolor:
                      tradeType === 'buy'
                        ? theme.palette.success.main
                        : theme.palette.error.main,
                  }}>
                  {tradeType === 'buy' ? <ShoppingCartIcon /> : <SellIcon />}
                </Avatar>
              }
            />
            <CardContent>
              <Box sx={{ mb: 3 }}>
                <ToggleButtonGroup
                  value={tradeType}
                  exclusive
                  onChange={handleTradeTypeChange}
                  aria-label="trade type"
                  fullWidth>
                  <ToggleButton value="buy" aria-label="buy">
                    Buy
                  </ToggleButton>
                  <ToggleButton value="sell" aria-label="sell">
                    Sell
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="asset-select-label">Select Asset</InputLabel>
                <Select
                  labelId="asset-select-label"
                  id="asset-select"
                  value={selectedAsset?.id || ''}
                  label="Select Asset"
                  onChange={handleAssetChange}>
                  {assets.map((asset) => (
                    <MenuItem key={asset.id} value={asset.id}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: '100%',
                        }}>
                        <Typography>
                          {asset.symbol} - {asset.name}
                        </Typography>
                        <Chip
                          size="small"
                          label={`$${asset.currentPrice.toLocaleString()}`}
                          color={asset.priceChange >= 0 ? 'success' : 'error'}
                        />
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Quantity"
                value={quantity}
                onChange={handleQuantityChange}
                margin="normal"
                type="text"
                InputProps={{
                  endAdornment: selectedAsset ? (
                    <InputAdornment position="end">
                      {selectedAsset.symbol}
                    </InputAdornment>
                  ) : null,
                }}
              />

              <TextField
                fullWidth
                label="Notes (Optional)"
                value={notes}
                onChange={handleNotesChange}
                margin="normal"
                multiline
                rows={2}
                placeholder="Add notes about this trade"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <NotesIcon />
                    </InputAdornment>
                  ),
                }}
              />

              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Price per Unit
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      ${selectedAsset?.currentPrice.toLocaleString() || '0.00'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Total {tradeType === 'buy' ? 'Cost' : 'Value'}
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      ${calculateTotal().toLocaleString()}
                    </Typography>
                  </Grid>
                  {tradeType === 'buy' && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        Available Balance
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        ${userBalance.toLocaleString()}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Box>

              <Button
                fullWidth
                variant="contained"
                color={tradeType === 'buy' ? 'success' : 'error'}
                size="large"
                sx={{ mt: 3 }}
                onClick={executeTrade}
                disabled={
                  !selectedAsset || !quantity || parseFloat(quantity) <= 0
                }>
                {tradeType === 'buy' ? 'Buy Now' : 'Sell Now'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Asset Details */}
        <Grid item xs={12} md={6}>
          {selectedAsset ? (
            <Card elevation={2}>
              <CardHeader
                title={`${selectedAsset.name} (${selectedAsset.symbol})`}
                subheader={`${
                  selectedAsset.type.charAt(0).toUpperCase() +
                  selectedAsset.type.slice(1)
                }`}
                action={
                  <Chip
                    icon={
                      selectedAsset.priceChange >= 0 ? (
                        <TrendingUpIcon />
                      ) : (
                        <TrendingDownIcon />
                      )
                    }
                    label={`${
                      selectedAsset.priceChange >= 0 ? '+' : ''
                    }${selectedAsset.priceChangePercentage.toFixed(2)}%`}
                    color={selectedAsset.priceChange >= 0 ? 'success' : 'error'}
                  />
                }
              />
              <CardContent>
                <Typography variant="h4" sx={{ mb: 2 }}>
                  ${selectedAsset.currentPrice.toLocaleString()}
                </Typography>

                <Box sx={{ height: 250, mb: 3 }}>
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
                      <XAxis
                        dataKey="timestamp"
                        tickFormatter={(timestamp) =>
                          new Date(timestamp).toLocaleDateString()
                        }
                        scale="time"
                        type="number"
                        domain={['dataMin', 'dataMax']}
                      />
                      <YAxis domain={['auto', 'auto']} />
                      <Tooltip
                        formatter={(value) => [`$${value}`, 'Price']}
                        labelFormatter={(timestamp) =>
                          new Date(timestamp).toLocaleDateString()
                        }
                      />
                      <Line
                        type="monotone"
                        dataKey="price"
                        stroke={
                          selectedAsset.priceChange >= 0
                            ? theme.palette.success.main
                            : theme.palette.error.main
                        }
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Portfolio holdings for this asset */}
                {portfolio.find(
                  (item) => item.assetId === selectedAsset.id
                ) && (
                  <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      Your Holdings
                    </Typography>

                    {portfolio
                      .filter((item) => item.assetId === selectedAsset.id)
                      .map((item) => (
                        <Grid container spacing={2} key={item.assetId}>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              Quantity
                            </Typography>
                            <Typography variant="body1">
                              {item.quantity} {item.symbol}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              Total Value
                            </Typography>
                            <Typography variant="body1">
                              ${item.totalValue.toLocaleString()}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              Average Buy Price
                            </Typography>
                            <Typography variant="body1">
                              ${item.averageBuyPrice.toLocaleString()}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              Profit/Loss
                            </Typography>
                            <Typography
                              variant="body1"
                              color={
                                item.profitLoss >= 0
                                  ? 'success.main'
                                  : 'error.main'
                              }>
                              ${item.profitLoss.toLocaleString()} (
                              {item.profitLossPercentage.toFixed(2)}%)
                            </Typography>
                          </Grid>
                        </Grid>
                      ))}
                  </Paper>
                )}

                <Typography variant="subtitle1" gutterBottom>
                  Asset Information
                </Typography>

                <List disablePadding>
                  <ListItem disablePadding sx={{ py: 1 }}>
                    <ListItemText
                      primary="Asset Type"
                      secondary={
                        selectedAsset.type.charAt(0).toUpperCase() +
                        selectedAsset.type.slice(1)
                      }
                    />
                  </ListItem>
                  <Divider component="li" />
                  <ListItem disablePadding sx={{ py: 1 }}>
                    <ListItemText
                      primary="Current Price"
                      secondary={`$${selectedAsset.currentPrice.toLocaleString()}`}
                    />
                  </ListItem>
                  <Divider component="li" />
                  <ListItem disablePadding sx={{ py: 1 }}>
                    <ListItemText
                      primary="Price Change (24h)"
                      secondary={
                        <Typography
                          variant="body2"
                          color={
                            selectedAsset.priceChange >= 0
                              ? 'success.main'
                              : 'error.main'
                          }>
                          ${selectedAsset.priceChange.toLocaleString()} (
                          {selectedAsset.priceChangePercentage.toFixed(2)}%)
                        </Typography>
                      }
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          ) : (
            <Card elevation={2}>
              <CardContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  py: 8,
                }}>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                  Select an asset to view details
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center">
                  Choose an asset from the dropdown menu to see its price chart,
                  your holdings, and other information.
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Trading;
