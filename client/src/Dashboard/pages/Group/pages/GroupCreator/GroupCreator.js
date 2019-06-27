import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Button, TextField, Typography } from "@material-ui/core";
import { Redirect } from "react-router-dom";
import PageHeader from "../../../../components/PageHeader";
import { connect } from "react-redux";

import styles from "./GroupCreator.style.js";
import * as actions from "../../../../../actions";

class GroupCreator extends React.Component {
    constructor(props) {
        super(props);
        this.state = { name: "", premium: "", files: [] };
    }

    handleFieldChange = evt => {
        this.setState({
            [evt.target.id]: evt.target.value,
        });
    };

    handleUpload = evt => {
        this.setState({ files: evt.target.files });
    };

    isSubmittable = () =>
        this.state.name &&
        !isNaN(this.state.premium) &&
        this.state.premium > 0 &&
        this.state.files.length > 0;

    handleSubmit = evt => {
        if (!this.isSubmittable) return;
        this.props.createGroup(this.state);
    };

    render() {
        let { groupName, premium } = this.state;

        if (!this.props.group.mustBeCreated) {
            return <Redirect to="/admin/groups" />;
        }

        return (
            <div>
                <PageHeader title="Create a Group" />
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
            </div>
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
