import React from "react";

const PaymentProcess = props => {
  return (
    <div>
      <h2>Payment Process </h2>
      <br></br>
      <p>
        An overview of the payment process and how the various costs are broken
        down Your TandaPay premium payment is composed of a few different
        components which are described below:
      </p>
      <br></br>

      <ol style={{ paddingLeft: "20px" }}>
        <li>
          <b>Premium:</b> 100% of all premiums are used to either pay claims or
          rebates. No premiums are ever paid to developers or the group’s
          secretary. If no claims are opened in a given month then the entire
          premium is returned to you as a refund. You can then use the value of
          this refund to pay for future months of coverage.
        </li>
        <li>
          <b>Overpayment:</b> Along with your premium you pay a small refundable
          deposit called an overpayment. This is roughly 15 to 30% of the value
          of a single premium. you will always get your overpayment back every
          month so long as no one in your subgroup selfishly defects against a
          valid claim. You can then use this overpayment again for future
          months.
        </li>
        <li>
          <b>Loan Payment:</b> In some cases a secretary may need to obtain a
          loan so that they can purchase DAI to assist their group with
          conversions from USD to DAI and DAI to USD. This loan is repaid within
          the first few months a TandaPay group is in operation.
        </li>
        <li>
          <b>App License:</b> Currently the app license is free.
        </li>
        <li>
          <b>Secretary support:</b> Currently the app does not permit the group
          to make a monthly contribution to the secretary via the app.
        </li>
      </ol>

      <br></br>
      <p>
        If a group of 50 people wanted to attempt to pay 2 $500 claims per month
        it would need to collect a total of $1000 in premiums or $20 per person.
      </p>
      <br></br>

      <p>
        If there were no claims for the first six months this is how the
        projections would look like. In this example the rebate represents the
        sum of:
      </p>
      <br></br>
      <ul style={{ paddingLeft: "20px" }}>
        <li>The value of a premium refund</li>
        <li>The return of the refundable overpayment deposit</li>
      </ul>

      <br></br>
      <table class="table">
        <thead>
          <tr>
            <th>MONTH</th>
            <th>1</th>
            <th>2</th>
            <th>3</th>
            <th>4</th>
            <th>5</th>
            <th>6</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Rebate</td>
            <td>$0.00</td>
            <td>$0.00</td>
            <td>$25.00</td>
            <td>$25.00</td>
            <td>$25.00</td>
            <td>$25.00</td>
          </tr>

          <tr>
            <td>Premium</td>
            <td>$20.00</td>
            <td>$20.00</td>
            <td>$20.00</td>
            <td>$20.00</td>
            <td>$20.00</td>
            <td>$20.00</td>
          </tr>

          <tr>
            <td>Overpayment</td>
            <td>$5.00</td>
            <td>$5.00</td>
            <td>$5.00</td>
            <td>$5.00</td>
            <td>$5.00</td>
            <td>$5.00</td>
          </tr>

          <tr>
            <td>Loan Payment</td>
            <td>$8.50</td>
            <td>$8.50</td>
            <td>$8.50</td>
            <td>$8.50</td>
            <td>$0.00</td>
            <td>$0.00</td>
          </tr>

          <tr>
            <td>Total</td>
            <td>$33.50</td>
            <td>$33.50</td>
            <td>$8.50</td>
            <td>$8.50</td>
            <td>$0.00</td>
            <td>$0.00</td>
          </tr>
        </tbody>
      </table>
      <br></br>
      <p>
        As you can see after a few short months the premium goes to zero. This
        makes sense because the group doesn’t have any claims during this period
        and 100% of the groups premiums must be used to pay either claims or
        refunds.
      </p>
      <br></br>
      <p>
        If there were only one claim per month for the first six months this is
        how the projections would look like:
      </p>
      <br></br>

      <table class="table">
        <thead>
          <tr>
            <th>MONTH</th>
            <th>1</th>
            <th>2</th>
            <th>3</th>
            <th>4</th>
            <th>5</th>
            <th>6</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Rebate</td>
            <td>$0.00</td>
            <td>$0.00</td>
            <td>$15.00</td>
            <td>$15.00</td>
            <td>$15.00</td>
            <td>$15.00</td>
          </tr>

          <tr>
            <td>Premium</td>
            <td>$20.00</td>
            <td>$20.00</td>
            <td>$20.00</td>
            <td>$20.00</td>
            <td>$20.00</td>
            <td>$20.00</td>
          </tr>

          <tr>
            <td>Overpayment</td>
            <td>$5.00</td>
            <td>$5.00</td>
            <td>$5.00</td>
            <td>$5.00</td>
            <td>$5.00</td>
            <td>$5.00</td>
          </tr>

          <tr>
            <td>Loan Payment</td>
            <td>$8.50</td>
            <td>$8.50</td>
            <td>$8.50</td>
            <td>$8.50</td>
            <td>$0.00</td>
            <td>$0.00</td>
          </tr>

          <tr>
            <td>Total</td>
            <td>$33.50</td>
            <td>$33.50</td>
            <td>$18.50</td>
            <td>$18.50</td>
            <td>$10.00</td>
            <td>$10.00</td>
          </tr>
        </tbody>
      </table>

      <br></br>
      <p>
        In the example above 50% of a members premium is returned to them and
        50% is used to pay a members claim. The important thing to recognize is
        that given enough time the cost of using TandaPay goes down once people
        start to receive and use their rebates to reduce their monthly premium
        payments.
      </p>
      <br></br>
    </div>
  );
};

export default PaymentProcess;
