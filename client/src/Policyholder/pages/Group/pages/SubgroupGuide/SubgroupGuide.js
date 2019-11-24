import React from "react";
import PageHeader from "../../../../components/PageHeader/PageHeader";
import { Typography } from "@material-ui/core";

const headerButtons = [
  {
    text: "GO BACK",
    type: "red",
    url: "/holder/claims/new"
  }
];
const ClaimsGuide = props => {
  return (
    <div>
      <PageHeader title="Claims Guide" buttons={headerButtons} />
      <h2>A guide on how to submit Claims</h2>
      <br></br>
      <p>
        When submitting claims it is very important that you follow the
        instructions provided in the charter exactly as they are given. This
        usually requires you to submit some documentation along with your claim.
        If you are unclear what documents are required please contact your
        secretary to make sure you provide the information required. The charter
        should clearly tell all policyholders what evidence, paperwork, or proof
        is needed to submit a valid claim.
      </p>
      <br></br>
      <p>
        If the required evidence contains personal information because it is one
        of the following:
      </p>
      <br></br>
      <ol style={{ paddingLeft: "20px" }}>
        <li>A claim record from a primary insurer</li>
        <li>A police report</li>
        <li>A formal document from your employer</li>
      </ol>

      <br></br>
      <p>
        It is recommended that you make a copy of this paperwork and that you
        then take a black permanent marker and you redact the following
        sensitive information from the copy:
      </p>
      <br></br>
      <ol style={{ paddingLeft: "20px" }}>
        <li>
          Your SSN, DOB, Drivers License, Vehicle VIN, phone number and other
          numbers that personally identify you.
        </li>
        <li>Any passwords or login credentials.</li>
        <li>
          In most cases your name and address remain unredacted unless you are
          instructed by the charter to do so.
        </li>
        <li>
          Details about the incident that are private and that the charter
          permits you to redact.
        </li>
      </ol>
      <br></br>
      <p>
        You are required to take a clear photo or a scan of the document and to
        upload it to google drive so that your TandaPay group may view the
        redacted document. You are also required to show the secretary the
        unredacted document so that they may verify and attest to the existence
        of the original unredacted document.
      </p>
      <br></br>
      <p>
        This will ensure your ability to protect your private information while
        providing your group with enough factual information to determine the
        validity of your claim.
      </p>
    </div>
  );
};

export default ClaimsGuide;
