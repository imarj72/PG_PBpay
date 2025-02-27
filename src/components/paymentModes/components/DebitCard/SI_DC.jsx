import React, {useState} from 'react'
import { Button, Checkbox, FormControlLabel, FormGroup, Grid, Link, TextField,FormControl,InputLabel,Select,MenuItem } from '@mui/material'
import CardTabs from '../ChildComponents/CardTabs';
import BankDetails from '../ChildComponents/BankDetails';
import EmiTable from '../CommonDetails/EmiTable';
import BankinfoTab from '../ChildComponents/BankinfoTab';
import ImageComponents from '../../../../Shared/ImageComponents';
import CustomizedDialogs from '../../../../Shared/CustomDialogs';
import VisaMasterInfo from '../ChildComponents/VisaMasterInfo';


function DebitCard() {
  const [selectBankName, setBankName] = React.useState('');
  const [showVisaNetwork, setVisaNetwork] = useState(false);

  const handleChange = (event) => {
    setBankName(event.target.value);
  };
  return (
    <>
    <div className='card-details'>
        <div className='bank-error-msg'>
           <p>
             <ImageComponents name={"bankBg"}/> <strong>State bank of India</strong> is currently facing some technical issues.
           </p>
        </div>
        <h5>
                Enter your Debit card details
            </h5>
        <div className='card-detail-form'>
            
            <Grid container spacing={3}>
                <Grid item md={12} xs={12}  className='debit-card'>
                    <TextField
                        id="outlined-required"
                        label="Debit Card number"
                        defaultValue="XXXX-XXXX-XXXX-XXXX"
                        fullWidth
                        style={{borderRadius:'8px'}}
                    />
                </Grid>
                <Grid item md={12} xs={12}>
                    <TextField
                        id="outlined-required"
                        label="Enter your name"
                        fullWidth
                        helperText="As mentioned on your credit card"
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <TextField
                        id="outlined-required"
                        label="Expiry Month & Year"
                        defaultValue="MM-YY"
                        fullWidth
                    />
                </Grid>
                <Grid item md={6} xs={12}  className='cvv-box'>
                    <TextField
                        id="outlined-required"
                        label="CVV"
                        defaultValue="***"
                        fullWidth
                    />
                </Grid>
                <Grid item md={12} xs={12} className='autopay-check'>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox defaultChecked />} label="Copy Set up Autopay on your Credit card if applicable" />
                    </FormGroup>
                    <Button variant="outlined" size="large" className='pay-now-btn'>
                        Pay now
                    </Button>
                </Grid>
                <Grid item md={12} xs={12}>
                    <strong>Click an option to view the list of Credit cards allowed for Autopay facility</strong>
                    <p>
                      <Link  onClick={() => setVisaNetwork(true)}>Visa network </Link> <Link onClick={() => setVisaNetwork(true)} >Mastercard network</Link>
                    </p>
                </Grid>
            </Grid>
        </div>
    </div>
    <div className='card-details debit-box'>
      <div className='card-detail-form'>
        <h5>
          Select details to setup Autopay
        </h5>
        <p className=' py-1 text-xs text-gray-400 mb-4'>
          Where would you like to set up your autopay?
        </p>
        <div className='debit-card-tabs'>
          <CardTabs/>
        </div>
        <Grid container spacing={3}>
          <Grid item md={12} xs={12} >
            <FormControl fullWidth className='form-control'>
              <InputLabel id="demo-simple-select-label">Select Bank</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectBankName}
                label="Bank Name"
                onChange={handleChange}
              >
                <MenuItem value={1}>HDFC BANK</MenuItem>
                <MenuItem value={2}>ICICI</MenuItem>
                <MenuItem value={3}>SBI</MenuItem>
                <MenuItem value={4}>Kotak Mahindra</MenuItem>
                <MenuItem value={5}>Bank of Baroda</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item md={12} xs={12}>
            <Button variant="outlined" size="large" className='pay-now-btn'>
                Pay now
            </Button>
            {/* <EmiTable/> */}
          </Grid>
          
        </Grid>
      </div>
      {showVisaNetwork ? <CustomizedDialogs className="dialog-inner-box" open={showVisaNetwork} handleClose={() => setVisaNetwork(false)}>
        <VisaMasterInfo handleClose={() => setVisaNetwork(false)}/>
      </CustomizedDialogs> : null}
    </div>
    </>
  )
}

export default DebitCard
