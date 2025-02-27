import { FormControl, Grid, InputLabel, MenuItem, Select,Button } from '@mui/material'
import React, {useState} from 'react'
import CustomizedDialogs from '../../../shared/CustomDialogs';
import PosDialogs from '../../childComponent/PosDialogs';

function Pos() {
	const [selectBankName, setBankName] = React.useState('');
	const [showUsingMethod, setPayUsingMethod] = useState(false);

  const handleChange = (event) => {
    setBankName(event.target.value);
  };
	return (
		<div className='card-details'>
			<div className='card-detail-form'>
				<h3>POS</h3>
				<p className='mt-2 mb-6'>
					You have chosen to pay through the POS machine in our offline store. To continue with your transaction, please click the button
				</p>
				<div>
					<Grid container spacing={2}>
						<Grid item md={12} xs={12}>
							<FormControl fullWidth className='form-control'>
								<InputLabel id="demo-simple-select-label">Select device</InputLabel>
								<Select
									labelId="demo-simple-select-label"
									id="demo-simple-select"
									value={selectBankName}
									label="Bank Name"
									onChange={handleChange}
								>
									<MenuItem value={1}>Handheld POS </MenuItem>
									<MenuItem value={2}>Handheld POS 1</MenuItem>
									<MenuItem value={3}>Handheld POS 2</MenuItem>
									<MenuItem value={4}>Handheld POS 3</MenuItem>
								</Select>
							</FormControl>
						</Grid>
						<Grid item md={12} xs={12}>
							<Button onClick={() => setPayUsingMethod(true)} variant="outlined" size="large" className='pay-now-btn'>
								Pay using POS
							</Button>
						</Grid>
					</Grid>
				</div>
			</div>
			{showUsingMethod ? <CustomizedDialogs style={{padding:"0"}} open={showUsingMethod} handleClose={() => setPayUsingMethod(false)}>
				<PosDialogs
				//   handleClose={() => setPayUsingMethod(false)}
				/>
			</CustomizedDialogs> : null}
		</div>
	)
}

export default Pos
