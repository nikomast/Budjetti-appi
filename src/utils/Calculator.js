// loanCalculator.js
export function calculateLoanRepayment(loans) {
    let information = [];

    for (let i = 0; i < loans.length; i++) {
        information.push({
            name: loans[i].name,
            balance: loans[i].currentBalance,
            interest: loans[i].interestRate,
            minimum: loans[i].payment,
            forecast: [],
            price: 0
        });
        getForecast(information[i]);
    }

    information.sort((a, b) => (
        a.forecast.length < b.forecast.length ? 1 : b.forecast.length < a.forecast.length ? -1 : 0
    ));
    
    let MonthlyExpenses = [];
    let MonthlyAmount = [];
    for (let month = 0; month < information[0].forecast.length; month++) {
        MonthlyExpenses.push(0);
        MonthlyAmount.push(0);
        for (let i = 0; i < information.length; i++) {
            if (month < information[i].forecast.length) {
                MonthlyExpenses[month] += information[i].minimum;
            }
            if (information[i].forecast.length > month) {
                MonthlyAmount[month] += information[i].forecast[month];
            }
        }
    }

    return { loans: information, MonthlyExpenses, MonthlyAmount };

    function getForecast(information) {
        let temp = information.balance;
        let forecast = [];
        let log = 0;
        while (information.balance > 0) {
            information.balance = Math.round(information.balance);
            forecast.push(information.balance);
            let monthly = 0;
            // Calculate interest
            monthly = information.balance * ((information.interest / 100) / 12);
            monthly = Math.round(monthly);
            // Add costs
            information.price += monthly;
            information.balance += monthly;
            // Make payment
            if (information.balance < information.minimum) {
                information.balance = 0;
            } else {
                information.balance -= information.minimum;
            }
            
            // Ensure loop doesn't run indefinitely
            log += 1;
            if (log > 120) {
                information.balance = 0;
            }
        }
        information.forecast = forecast;
        information.balance = temp;
    }
}

export function calculateAvalancheRepayment(loans, budget) {
    let information = loans.map(loan => ({
        name: loan.name,
        balance: loan.currentBalance,
        interest: loan.interestRate,
        minimum: loan.payment,
        forecast: [],
        price: 0
    }));

    // Sort loans by interest rate in descending order
    information.sort((a, b) => b.interest - a.interest);
    
    const monthlyBudget = budget;
    let temp = 0;
    let testi = false;

    while(!testi && temp < 40) {
        budget = monthlyBudget;
        information.forEach(loan => loan.forecast = []);
        
        testi = getAvalanche(budget);
        temp += 1;
    }

    function getAvalanche(budget) {
        let month = 0;
        let allLoansPaidOff = false;

        while (!allLoansPaidOff && month < 120) {
            allLoansPaidOff = true;
            let remainingBudget = budget;

            // First pay the minimum payments for all loans
            for (let i = 0; i < information.length; i++) {
                if (information[i].balance > 0) {
                    allLoansPaidOff = false;

                    information[i].balance = Math.round(information[i].balance);
                    information[i].forecast.push(information[i].balance);

                    let monthlyInterest = Math.round(information[i].balance * ((information[i].interest / 100) / 12));
                    information[i].price += monthlyInterest;
                    information[i].balance += monthlyInterest;

                    if (information[i].balance < information[i].minimum) {
                        remainingBudget -= information[i].balance;
                        information[i].balance = 0;
                    } else {
                        information[i].balance -= information[i].minimum;
                        remainingBudget -= information[i].minimum;
                    }
                } 
            }

            // Use remaining budget to pay off loans with the highest interest rate first
            for (let i = 0; i < information.length && remainingBudget > 0; i++) {
                if (information[i].balance > 0) {
                    let payment = Math.min(information[i].balance, remainingBudget);
                    information[i].balance -= payment;
                    remainingBudget -= payment;

                    information[i].balance = Math.round(information[i].balance);
                    information[i].forecast[month] = information[i].balance;
                }
            }

            month++;
        }

        // Check if all loans are paid off
        if (allLoansPaidOff) {
            return true;
        } else {
            return false;
        }
    }

    information.sort((a, b) => (
        a.forecast.length < b.forecast.length ? 1 : b.forecast.length < a.forecast.length ? -1 : 0
    ));

    let MonthlyAmount = [];
    for (let month = 0; month < information[0].forecast.length; month++) {
        MonthlyAmount.push(0);
        for (let i = 0; i < information.length; i++) {
            if (information[i].forecast.length > month) {
                MonthlyAmount[month] += information[i].forecast[month];
            }
        }
    }

    return information
}