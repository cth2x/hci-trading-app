import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  useTheme,
  Paper,
} from '@mui/material';
import {
  Help as HelpIcon,
  ExpandMore as ExpandMoreIcon,
  Dashboard as DashboardIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalance as AccountBalanceIcon,
  Article as ArticleIcon,
  Assessment as AssessmentIcon,
  Info as InfoIcon,
  School as SchoolIcon,
  ContactSupport as ContactSupportIcon,
} from '@mui/icons-material';

const Help: React.FC = () => {
  const theme = useTheme();

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Help & Support
      </Typography>

      <Grid container spacing={3}>
        {/* Getting Started */}
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardHeader
              title="Getting Started"
              avatar={
                <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                  <SchoolIcon />
                </Avatar>
              }
            />
            <CardContent>
              <Typography variant="body1" paragraph>
                Welcome to TradeSim, a virtual trading platform for educational
                purposes. This application allows you to practice trading
                stocks, cryptocurrencies, and commodities in a risk-free
                environment.
              </Typography>

              <Typography variant="body1" paragraph>
                Here's how to get started:
              </Typography>

              <List>
                <ListItem>
                  <ListItemIcon>
                    <DashboardIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Dashboard"
                    secondary="View your account summary, portfolio performance, and recent transactions."
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <TrendingUpIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Trading"
                    secondary="Buy and sell assets. Select an asset, enter the quantity, and execute your trade."
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AccountBalanceIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Portfolio"
                    secondary="Track your holdings, filter by asset type, and analyze your performance."
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <ArticleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="News"
                    secondary="Stay informed with the latest market news and updates."
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AssessmentIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Reports"
                    secondary="View detailed reports and insights about your trading activity."
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Frequently Asked Questions */}
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardHeader
              title="Frequently Asked Questions"
              avatar={
                <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                  <HelpIcon />
                </Avatar>
              }
            />
            <CardContent>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header">
                  <Typography variant="subtitle1">
                    How do I buy assets?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2">
                    To buy assets, navigate to the Trading page, select "Buy"
                    mode, choose an asset from the dropdown menu, enter the
                    quantity you wish to purchase, and click "Buy Now". The
                    system will validate your order and execute it if you have
                    sufficient funds.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2a-content"
                  id="panel2a-header">
                  <Typography variant="subtitle1">
                    How do I sell assets?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2">
                    To sell assets, navigate to the Trading page, select "Sell"
                    mode, choose an asset that you own from the dropdown menu,
                    enter the quantity you wish to sell, and click "Sell Now".
                    You can only sell assets that you currently own and in
                    quantities that you possess.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel3a-content"
                  id="panel3a-header">
                  <Typography variant="subtitle1">
                    How is profit/loss calculated?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2">
                    Profit or loss is calculated by comparing the current market
                    value of your holdings with the average purchase price. For
                    each asset, we calculate: (Current Price - Average Buy
                    Price) × Quantity. This gives you a real-time view of how
                    your investments are performing.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel4a-content"
                  id="panel4a-header">
                  <Typography variant="subtitle1">
                    Can I add more virtual funds to my account?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2">
                    This is a simulation platform for educational purposes only.
                    Each new account starts with $10,000 in virtual currency. If
                    you run out of funds, you can create a new account or
                    contact support for a one-time reset of your account
                    balance.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel5a-content"
                  id="panel5a-header">
                  <Typography variant="subtitle1">
                    Are the market prices real?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2">
                    The market prices in this simulation are based on real
                    market data but may be delayed or slightly modified for
                    educational purposes. The application is designed to provide
                    a realistic trading experience without the risk of real
                    financial loss.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </CardContent>
          </Card>
        </Grid>

        {/* Trading Tips */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardHeader
              title="Trading Tips"
              avatar={
                <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                  <InfoIcon />
                </Avatar>
              }
            />
            <CardContent>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Diversify Your Portfolio"
                    secondary="Spread your investments across different asset types to reduce risk."
                  />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemText
                    primary="Research Before Trading"
                    secondary="Use the News section to stay informed about market trends and company updates."
                  />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemText
                    primary="Monitor Performance"
                    secondary="Regularly check the Reports section to analyze your trading strategy's effectiveness."
                  />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemText
                    primary="Start Small"
                    secondary="Begin with smaller investments until you become comfortable with the platform."
                  />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemText
                    primary="Use Notes"
                    secondary="Add notes to your transactions to record your reasoning for future reference."
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Contact Support */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardHeader
              title="Contact Support"
              avatar={
                <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                  <ContactSupportIcon />
                </Avatar>
              }
            />
            <CardContent>
              <Typography variant="body1" paragraph>
                If you need additional help or have questions about the
                platform, our support team is here to assist you.
              </Typography>

              <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Support Hours
                </Typography>
                <Typography variant="body2">
                  Monday - Friday: 9:00 AM - 5:00 PM
                </Typography>
                <Typography variant="body2">
                  Saturday - Sunday: Closed
                </Typography>
              </Paper>

              <Typography variant="subtitle1" gutterBottom>
                Contact Methods
              </Typography>

              <List>
                <ListItem>
                  <ListItemIcon>
                    <ContactSupportIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Email Support"
                    secondary="support@tradesim.example.com"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <ContactSupportIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Phone Support"
                    secondary="(555) 123-4567"
                  />
                </ListItem>
              </List>

              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
                startIcon={<ContactSupportIcon />}>
                Submit Support Ticket
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Help;
