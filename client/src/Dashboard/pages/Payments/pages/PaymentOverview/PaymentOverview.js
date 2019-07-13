import React from "react";
import { connect } from "react-redux";
import { PageHeader, Table as PaymentTable } from "../../../../components";
import { headRows } from "./data";
import paymentData from "../../../../../data/payments.json";
const PaymentOverview = props => {
    const { user } = props;
    const title = user ? user.name : "";
    const payments = getPaymentHistory();
    return (
        <React.Fragment>
            <PageHeader title={`Welcome, ${title}`} />
            <h1>Payment Overview</h1>
            <PaymentTable
                data={payments}
                headRows={headRows}
                title="Payment History"
                type="payments"
            />
        </React.Fragment>
    );
};

const getPaymentHistory = () => {
    //axios call
    const payments = paymentData.payments;
    return payments;
};
function mapStateToProps({ user }) {
    return { user };
}
export default connect(
    mapStateToProps,
    null
)(PaymentOverview);
