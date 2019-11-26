import React from "react";
import PageHeader from "../../../../components/PageHeader/PageHeader";
import SecretaryResponsibilities from "../../../../../components/SecretaryResponsibilities/SecretaryResponsibilities";

const headerButtons = [
  {
    text: "GO BACK",
    type: "red",
    url: "/admin/groups/manage"
  }
];
const SecretaryGuide = props => {
  return (
    <div>
      <PageHeader title="Secretary Responsibilities" buttons={headerButtons} />
      <SecretaryResponsibilities />
    </div>
  );
};

export default SecretaryGuide;
