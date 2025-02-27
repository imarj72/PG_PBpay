import { faInr } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useEffect } from 'react';

function EmiTable({ amountToBePaid = 5000, bankId = 48, mode = 'EMI', displayOrderNo = 12345, onBankCodeSelect = () => {}, selectEmiCode }) {
  const [emiDetails, setEmiDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    // Simulating fetching EMI details (mock data)
    const fetchEmiDetails = () => {
      setLoading(true);
      setTimeout(() => {
        const mockData = {
          1: {
            tenure: '3 months',
            interest: 10,
            monthly_inst: 1700,
            bank_inst: 500,
            total_inst: 5100,
            bank_emi_code: 'EMI_3M'
          },
          2: {
            tenure: '6 months',
            interest: 12,
            monthly_inst: 900,
            bank_inst: 600,
            total_inst: 5400,
            bank_emi_code: 'EMI_6M'
          },
          3: {
            tenure: '12 months',
            interest: 15,
            monthly_inst: 600,
            bank_inst: 700,
            total_inst: 7200,
            bank_emi_code: 'EMI_12M'
          },
          4:{
            tenure: '18 months',
            interest: 15,
            monthly_inst: 600,
            bank_inst: 700,
            total_inst: 7200,
            bank_emi_code: 'EMI_12M'
          },
        };
        
        setEmiDetails(mockData);
        
        // Set the selected plan based on selectEmiCode or default to the first plan
        const firstPlanKey = Object.keys(mockData)[0]; 
        if (selectEmiCode) {
          const selectedPlanKey = Object.keys(mockData).find(key => mockData[key].bank_emi_code === selectEmiCode);
          if (selectedPlanKey) {
            setSelectedPlan(selectedPlanKey);
            onBankCodeSelect(mockData[selectedPlanKey].bank_emi_code);
          }
        } else {
          setSelectedPlan(firstPlanKey);
          onBankCodeSelect(mockData[firstPlanKey].bank_emi_code);
        }

        setLoading(false);
      }, 1000); 
    };

    fetchEmiDetails();
  }, [amountToBePaid, bankId, mode, displayOrderNo, selectEmiCode, onBankCodeSelect]);

  const renderEmiDetails = () => {
    const emiArray = Object.entries(emiDetails);
    return emiArray.map(([key, plan]) => (
      <div key={key}>
        <ul className='emi-table-head'>
          <li>
            <input
              type="radio"
              name="emiPlan"
              value={key}
              checked={selectedPlan === key}
              onChange={() => {
                setSelectedPlan(key);
                onBankCodeSelect(plan.bank_emi_code);
              }}
            />
          </li>
          <li> <strong>{plan.tenure}</strong></li>
          <li>
            <strong>{plan.interest}%</strong>
          </li>
          <li>
            <strong>
              <FontAwesomeIcon icon={faInr} /> {plan.monthly_inst.toFixed(2)}
            </strong>
          </li>
          <li>
            <strong>
              <FontAwesomeIcon icon={faInr} />
              {plan.bank_inst.toFixed(2)}
            </strong>
          </li>
          <li>
            <strong>
              <FontAwesomeIcon icon={faInr} />
              {plan.total_inst.toFixed(2)}
            </strong>
          </li>
        </ul>
      </div>
    ));
  };

  return (
    <div className='emi-table-view'>
      {/* {loading ? (
        <div>Loading...</div> // Simulate a loading state
      ) : ( */}
        <>
          <div className='emi-table-heading'>
            <h3>EMI Details</h3>
            <ul className='emi-table-head'>
              <li><span>Select</span></li>
              <li><span>Tenure</span></li>
              <li><span>Interest Rate</span></li>
              <li><span>Monthly EMI</span></li>
              <li><span>Interest Paid</span></li>
              <li><span>Amount Payable</span></li>
            </ul>
          </div>
          {renderEmiDetails()}
        </>
      {/* )} */}
    </div>
  );
}

export default EmiTable;
