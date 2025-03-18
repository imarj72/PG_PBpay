import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faInr, faMinus } from "@fortawesome/free-solid-svg-icons";
import Dialog from "@mui/material/Dialog";
import { Button, Link } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";

export default function PlanAccordion({ apiData }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [expandedPanel, setExpandedPanel] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 820);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const order = apiData.data || {};

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedPanel(isExpanded ? panel : null);
  };

  return (
    <div>
      <div className="card-view">
        <div className="plan-details-view">
          <div className="plan-detail-header">
            <div>
              <p>Order Number</p>
            </div>
            <div>
              <p>{order?.orderId || "N/A"}</p>
            </div>
          </div>

          <div className="plan-detail-table">
            {!isMobileView && (
              <table className="w-full">
                <tr>
                  <td colSpan="2">
                    <img className="source-logo" src={order.logo} />
                  </td>
                  <td colSpan="2">
                    <div className="paying-card-head">
                      <span>Amount</span>
                      <strong className="block">
                        <i className="text-xs">
                          <FontAwesomeIcon icon={faInr} />
                        </i>{" "}
                        {(+order.amount / 100 || 0).toFixed(2)}
                      </strong>
                    </div>
                  </td>
                </tr>
              </table>
            )}
          </div>

          <table className="w-full">
            {!isMobileView && (
              <tr className="flex w-full">
                <td colSpan="2">
                  <p>Total Amount</p>
                </td>
                <td colSpan="2">
                  <strong className="block">
                    <i className="text-xs">
                      <FontAwesomeIcon icon={faInr} />
                    </i>{" "}
                    {(+order.amount / 100 || 0).toFixed(2)}
                  </strong>
                </td>
              </tr>
            )}

            {isMobileView && (
              <tr className="totalAmount-mob flex w-full">
                <td colSpan="2">
                  <p style={{ fontSize: "14px" }}>Total Amount</p>
                </td>
                <td colSpan="2">
                  <p
                    className="block"
                    style={{
                      fontSize: "14px",
                      fontWeight: "700",
                      opacity: "100%",
                    }}
                  >
                    <i className="text-xs" style={{ fontSize: "14px" }}>
                      <FontAwesomeIcon icon={faInr} />
                    </i>{" "}
                    {(+order.amount / 100 || 0).toFixed(2)}
                  </p>
                </td>
              </tr>
            )}
          </table>
        </div>
      </div>

      <Accordion
        expanded={expandedPanel === "orderDetailsPanel"}
        onChange={handleAccordionChange("orderDetailsPanel")}
        className="plan-detail-accodion"
        sx={{
          boxShadow: "0px 6px 16px 0px rgba(52, 105, 203, 0.16)",
          backgroundColor: "#fff",
          borderRadius: "12px",
          "&:before": {
            display: "none",
          },
          marginTop: "20px",
        }}
      >
        <AccordionSummary
          expandIcon={
            <FontAwesomeIcon
              icon={expandedPanel === "orderDetailsPanel" ? faMinus : faPlus}
            />
          }
          aria-controls="order-details-content"
          id="order-details-header"
        >
          <Typography
            variant="h7"
            component="h3"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <img
              src="/images/order.png"
              alt="Order Icon"
              style={{ width: 24, height: 24, marginRight: 8 }}
            />
            Order Details
          </Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            borderTop: "1px solid #e0e0e0",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <div className="plan-details-view plan-details-box">
            {order?.orderId ? (
              <table>
                <tbody>
                  <tr>
                    <td style={{ fontSize: "14px" }}>Order Id:</td>
                    <td style={{ fontSize: "14px" }}>{order.orderId}</td>
                  </tr>
                  <tr>
                    <td style={{ fontSize: "14px" }}>Merchant ID:</td>
                    <td style={{ fontSize: "14px" }}>{order.merchantId}</td>
                  </tr>
                  <tr>
                    <td style={{ fontSize: "14px" }}>Merchant Name:</td>
                    <td style={{ fontSize: "14px" }}>{order.merchantName}</td>
                  </tr>
                  <tr>
                    <td style={{ fontSize: "14px" }}>Amount:</td>
                    <td style={{ fontSize: "14px" }}>
                      {" "}
                        <i className="text-xs">
                          <FontAwesomeIcon icon={faInr} />
                        </i>{" "}
                        {(+order.amount / 100 || 0).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <p>No order details available</p>
            )}
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
