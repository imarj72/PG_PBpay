import React from 'react';
import { Box, Grid, Paper, Typography, Button, Tabs, Tab, Select, MenuItem, Accordion, AccordionSummary, AccordionDetails, Divider, List, ListItem, ListItemIcon, ListItemText, Avatar } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import UpiIcon from '@mui/icons-material/AccountBalanceWallet';
import InstallmentIcon from '@mui/icons-material/Payment';

function PaymentPage() {
  return (
    <Box sx={{ flexGrow: 1, p: 3, backgroundColor: '#f5f9ff', minHeight: '100vh' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 0, borderRadius: 3 }}>
            <List>
              {[
                { text: 'Credit Card', icon: <CreditCardIcon /> },
                { text: 'Debit Card', icon: <CreditCardIcon /> },
                { text: 'Wallet', icon: <AccountBalanceWalletIcon /> },
                { text: 'Netbanking', icon: <AccountBalanceIcon /> },
                { text: 'UPI', icon: <UpiIcon /> },
                { text: 'Easy EMI', icon: <InstallmentIcon /> },
                { text: 'EMI', icon: <InstallmentIcon /> }
              ].map((item, index) => (
                <ListItem button key={index} sx={{ borderBottom: '1px solid #e0e0e0' }}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Tabs value={0} sx={{ mb: 2 }} variant="fullWidth">
              <Tab label="Credit card" />
              <Tab label="Debit card" />
              <Tab label="Cardless EMI" />
            </Tabs>

            <Grid container spacing={2}>
              {['HDFC', 'ICICI', 'SBI', 'Kotak Mahindra', 'ICICI Bank', 'Bank of Baroda'].map((bank) => (
                <Grid item xs={6} key={bank}>
                  <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, border: '1px solid #ddd', borderRadius: 3 }}>
                    <Avatar>{bank[0]}</Avatar>
                    <Typography>{bank}</Typography>
                  </Paper>
                </Grid>
              ))}
              <Grid item xs={12}>
                <Select fullWidth defaultValue="">
                  <MenuItem value="">Select another bank</MenuItem>
                </Select>
              </Grid>
            </Grid>

            <Button variant="contained" fullWidth sx={{ mt: 3, backgroundColor: '#0056f2', borderRadius: 2, py: 1.5 }}>
              Continue
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, borderRadius: 3 }}>
            <Typography variant="body2" sx={{ color: 'gray', mb: 1 }}>You're paying</Typography>
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
              ₹24,950
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <span>Premium amount</span>
              <span>₹20,459</span>
            </Typography>
            <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <span>GST</span>
              <span>₹4,491</span>
            </Typography>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Plan detail</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>Details about the plan...</Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Proposer detail</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>Details about the proposer...</Typography>
              </AccordionDetails>
            </Accordion>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default PaymentPage;
