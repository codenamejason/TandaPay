import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { PageHeader } from "../../../../components/";
import {
    Button,
    TextField,
    Typography,
    FormGroup,
    FormControlLabel,
    Checkbox,
} from "@material-ui/core";
import { connect } from "react-redux";

import styles from "./GroupCreator.style.js";
import * as actions from "../../../../../actions";
import Instructions from "./components/Instructions";

class GroupCreator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            premium: "",
            files: [],
            hasReadInstructions: false,
            confirm: {
                premium_cost: false,
                coverage: false,
                claim_requirements: false,
                member_qualifications: false,
                dispute_guidelines: false,
            },
        };
    }

    handleRead = evt => {
        this.setState({ hasReadInstructions: true });
    };

    handleFieldChange = evt => {
        this.setState({
            [evt.target.id]: evt.target.value
        });
    };

    handleUpload = evt => {
        this.setState({ files: evt.target.files });
    };

    isSubmittable = () =>
        this.state.name &&
        !isNaN(this.state.premium) &&
        this.state.premium > 0 &&
        this.state.files.length > 0 &&
        this.hasConfirmedAll();

    hasConfirmedAll = () =>
        Object.values(this.state.confirm).reduce((c, a) => c && a, true);

    handleSubmit = evt => {
        if (!this.isSubmittable) return;
        this.props.createGroup(this.state);
    };

    handleConfirm = evt => {
        let { confirm } = this.state;
        confirm[evt.target.value] = !confirm[evt.target.value];
        this.setState({ confirm });
    };

    render() {
        return (
            <div>
                <PageHeader title="Create a Group" />
                {this.state.hasReadInstructions
                    ? this.renderForm()
                    : this.renderInstructions()}
            </div>
        );
    }

    renderForm() {
        let { groupName, premium } = this.state;

        return (
            <React.Fragment>
                <div className={this.props.classes.form}>
                    <Typography variant="h4">Group Properties</Typography>
                    <TextField
                        type="text"
                        id="name"
                        label="Group Name"
                        value={groupName}
                        onChange={this.handleFieldChange}
                        variant="outlined"
                        className={this.props.classes.formItem}
                    />
                    <TextField
                        type="text"
                        id="premium"
                        label="Monthly Premium"
                        value={premium}
                        onChange={this.handleFieldChange}
                        variant="outlined"
                        className={this.props.classes.formItem}
                    />
                    <Typography variant="h4">Group Charter</Typography>
                    <div
                        className={
                            this.props.classes.formItem +
                            " " +
                            this.props.classes.files
                        }
                    >
                        <input
                            id="files"
                            multiple
                            type="file"
                            onChange={this.handleUpload}
                        />
                    </div>
                    {this.state.files.length > 0
                        ? this.renderConfirmation()
                        : null}
                    <br />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={this.handleSubmit}
                        disabled={!this.isSubmittable()}
                        className={
                            this.props.classes.formItem +
                            " " +
                            this.props.classes.button
                        }
                    >
                        Create
                    </Button>
                </div>
            </React.Fragment>
        );
    }

    renderInstructions() {
        return (
            <React.Fragment>
                <Instructions />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={this.handleRead}
                >
                    I Understand
                </Button>
            </React.Fragment>
        );
    }

    renderConfirmation() {
        let { confirm } = this.state;

        return (
            <FormGroup style={{ marginTop: 15 }}>
                <div style={{ fontWeight: "bold" }}>
                    The group charter documents contain:
                </div>
                <FormControlLabel
                    label="What determines the cost of a premium"
                    control={
                        <Checkbox
                            onChange={this.handleConfirm}
                            checked={confirm.premium_cost}
                            value="premium_cost"
                        />
                    }
                />
                <FormControlLabel
                    label="What kind of coverage is provided"
                    control={
                        <Checkbox
                            onChange={this.handleConfirm}
                            checked={confirm.coverage}
                            value="coverage"
                        />
                    }
                />
                <FormControlLabel
                    label="The requirements for a valid claim"
                    control={
                        <Checkbox
                            onChange={this.handleConfirm}
                            checked={confirm.claim_requirements}
                            value="claim_requirements"
                        />
                    }
                />
                <FormControlLabel
                    label="Qualifications to join the group"
                    control={
                        <Checkbox
                            onChange={this.handleConfirm}
                            checked={confirm.member_qualifications}
                            value="member_qualifications"
                        />
                    }
                />
                <FormControlLabel
                    label="What guidelines do communities use to resolve disputes"
                    control={
                        <Checkbox
                            onChange={this.handleConfirm}
                            checked={confirm.disupte_guidelines}
                            value="dispute_guidelines"
                        />
                    }
                />
            </FormGroup>
        );
    }
}

function mapStateToProps({ group }) {
    return { group };
}

export default connect(
    mapStateToProps,
    actions
)(withStyles(styles, { withTheme: true })(GroupCreator));
