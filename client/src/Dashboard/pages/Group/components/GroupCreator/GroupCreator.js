import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Button, TextField } from "@material-ui/core";
import PageHeader from "../../../../components/PageHeader";
import { connect } from "react-redux";

import styles from "./GroupCreator.style.js";

class GroupCreator extends React.Component {
    constructor(props) {
        super(props);
        this.state = { name: "", premium: "" };
    }

    handleFieldChange = evt => {
        this.setState({
            [evt.target.id]: evt.target.value,
        });
    };

    isSubmittable = () =>
        this.state.name && !isNaN(this.state.premium) && this.state.premium > 0;

    handleSubmit = evt => {
        if (!this.isSubmittable) return;
        console.log(this.state);
    };

    render() {
        let { groupName, premium } = this.state;
        return (
            <React.Fragment>
                <PageHeader title="Create a Group" />
                <div className={this.props.classes.form}>
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
}

export default withStyles(styles, { withTheme: true })(GroupCreator);
