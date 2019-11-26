import React from "react";
import PageHeader from "../../../../components/PageHeader/PageHeader";
import HowSubgroupWorks from "../../../../../components/HowSubgroupWorks/HowSubgroupWorks";

const headerButtons = [
  {
    text: "GO BACK",
    type: "red",
    url: "/admin/groups"
  }
];
const SecretaryGuide = props => {
  return (
    <div>
      <PageHeader title="How Subgroup Works" buttons={headerButtons} />
      <HowSubgroupWorks />
    </div>
  );
};

export default SecretaryGuide;
