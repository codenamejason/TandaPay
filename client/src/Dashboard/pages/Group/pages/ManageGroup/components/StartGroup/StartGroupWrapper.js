import { connect } from "react-redux";
import StartGroupForm from "./StartGroupForm";
import { startGroup } from "./HandleStartGroupForm";

const mapStateToProps = (state, ownProps) => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    onStartGroup: web3 => {
      startGroup(web3);
    }
  };
};

const StartGroupWrapper = connect(
  mapStateToProps,
  mapDispatchToProps
)(StartGroupForm);
export default StartGroupWrapper;
