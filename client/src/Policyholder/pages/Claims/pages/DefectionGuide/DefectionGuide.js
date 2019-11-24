import React from "react";
import PageHeader from "../../../../components/PageHeader/PageHeader";
import { Typography } from "@material-ui/core";

const headerButtons = [
  {
    text: "GO BACK",
    type: "red",
    url: "/holder/claims/defect"
  }
];
const DefectionGuide = props => {
  return (
    <div>
      <PageHeader title="Defection Guide" buttons={headerButtons} />
      <h2>Defection: Its Meaning and Consequences</h2>
      <br></br>
      <p>
        Defection: Its Meaning and Consequences Defection occurs when a group
        member or members leave a TandaPay group without paying claims that have
        been whitelisted by their group’s secretary. Group members may stop
        participating in their group at any time, but unless the group has taken
        unethical actions or acted in opposition with their charter, members
        should advise their group that they’re leaving at least 6 days before
        the end of a monthly cycle. This will allow for premiums to be correctly
        priced for the next cycle based on the remaining number of
        policyholders. Once their current period ends, they will use their
        premium to pay any outstanding valid claims. Members who leave following
        this procedure are not considered defectors.
      </p>
      <br></br>
      <p>
        There are valid reasons for defecting, as alluded to above. If the
        secretary whitelists an invalid claim, that is, a claim that does not
        meet the requirements of the group’s charter then defection is
        appropriate. Defection signifies that defectors do not recognize the
        claim as being valid. In these cases, however, it is assumed that the
        majority of the subgroup will defect together in response to this
        unethical behavior. If a member defects on their own, they will be
        considered a scumbag defector. This is any defector who defects against
        a valid claim for any personal reason. Such behavior violates the
        agreement they made with their TandaPay group to pay out all valid
        claims.{" "}
      </p>
      <br></br>
      <p>
        All defectors will be ejected from their TandaPay group and are no
        longer able to participate. The consequences of an individual defecting
        are mostly social, and the defector’s reputation may suffer, depending
        on the reach of the group. On the other hand, if an entire subgroup
        defects together, the TandaPay group’s reputation will be injured, as
        this will be evidence of wrongdoing or unethical actions. There will be
        a permanent record on the blockchain of any defections which occur by
        either individuals or subgroups in response to a whitelisted claim. If
        1/3 or more of a group defects, the group will become unstable and/or
        terminate. Defection is one important way that TandaPay is designed to
        protect against fraud within groups.
      </p>
      <br></br>
    </div>
  );
};

export default DefectionGuide;
