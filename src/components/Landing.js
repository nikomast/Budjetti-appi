import React from 'react';
import "../css/Landing.css";

const Landing = () => {
  return (
<div className="landing-container">
  <h1>"Personal Finance Manager"</h1>
  <p>This app was created for personal use as a vacation project. I was tired of doing budget analyses on the back of an envelope—mostly because it was always so hard to find a pen.</p>
  <p>This app provides an easy way to check your budget and keep track of your incomes, expenses, and loan statuses.</p>
  <p>Navigate to the Loans page to manage your loans. It offers tools to help you visualize your loans over time and provides information about the true cost of a loan relative to the payment plan you choose.</p>
  <p>The Budget page serves as "the envelope," but as long as you remember your email and password, you’ll never lose it.</p>
</div>

  );
};

export default Landing;
