import React from "react";

const HowSubgroupWorks = props => {
  return (
    <div>
      <h2>How subgroups work and why they are important</h2>
      <br></br>
      <p>
        Subgroups are groups of 4–7 TandaPay members who impact each other if
        one of them decides to selfishly defect against a valid claim. No one
        should ever form a subgroup with anyone whom they do not personally know
        and trust. Members should form an agreement with their subgroup that
        everyone will defect together if an invalid claim is approved for
        payment by the secretary. Otherwise, every member of the subgroup should
        agree to finalize their premium every month for all valid claims.
      </p>
      <br></br>
      <p>
        Along with your premium you pay a small refundable deposit called an
        overpayment. This is roughly 15 to 30% of the value of a single premium.
        you will always get your overpayment back so long as everyone in your
        subgroup decides to make the same choice that month of either:
      </p>
      <br></br>
      <ol style={{ paddingLeft: "20px" }}>
        <li>Finalizing your premium for valid claims</li>
        <li>Defecting if any of the claims are invalid</li>
      </ol>

      <br></br>
      <p>
        If one of your subgroup members selfishly defects against a valid claim
        and you decide to finalize your premium for the claimant then the
        subgroup incurs a penalty. This penalty is the loss of your overpayment.
        In this way your subgroup makes up for the selfish defection by one of
        your members. So long as all of you do the same thing none of you will
        lose your overpayment. This requires you to all agree that you will only
        use defection in the rare event that the group has approved an invalid
        or fraudulent claim.
      </p>
      <br></br>
    </div>
  );
};

export default HowSubgroupWorks;
