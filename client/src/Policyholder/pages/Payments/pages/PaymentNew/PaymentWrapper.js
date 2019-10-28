import { connect } from "react-redux";
import PaymentInfo from "./PaymentInfo";
import { makePayment } from "./HandlePayment";

const mapStateToProps = (state, ownProps) => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    onSignUpFormSubmit: web3 => {
      makePayment(web3);
    }
  };
};

const PaymentWrapper = connect(
  mapStateToProps,
  mapDispatchToProps
)(PaymentInfo);
export default PaymentWrapper;
