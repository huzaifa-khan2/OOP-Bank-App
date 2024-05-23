import { faker, Faker } from "@faker-js/faker";
import inquirer from "inquirer";
import chalk from "chalk";
//class customer
class Customer {
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  mobNumber: number;
  accNumber: number;

  constructor(
    fName: string,
    lName: string,
    age: number,
    gender: string,
    mob: number,
    acc: number
  ) {
    this.firstName = fName;
    this.lastName = lName;
    this.age = age;
    this.gender = gender;
    this.mobNumber = mob;
    this.accNumber = acc;
  }
}
//interface Bankaccount
interface BankAccount {
  accNumber: number;
  balance: number;
}

//class bank
class Bank {
  customer: Customer[] = [];
  account: BankAccount[] = [];

  addCustomer(obj: Customer) {
    this.customer.push(obj);
  }

  addAccountNumber(obj: BankAccount) {
    this.account.push(obj);
  }
  transaction(accObj: BankAccount) {
    let NewAccounts = this.account.filter(
      (acc) => acc.accNumber !== accObj.accNumber
    );
    this.account = [...NewAccounts, accObj];
  }
}
console.log("=".repeat(135));
console.log(chalk.greenBright.italic("\t\t\t\t\t\t Welcome To Bank Management System With OOP"));
console.log("=".repeat(135));

let mybank = new Bank();

for (let i: number = 1; i <= 3; i++) {
  let fName = faker.person.firstName("male");
  let lName = faker.person.lastName();
  let num = parseInt(faker.string.numeric(10));


  const cus = new Customer(fName, lName, 25 * i, "male", num, 1000 + i);
  mybank.addCustomer(cus);
  mybank.addAccountNumber({
    accNumber: cus.accNumber,
    balance: 1000 * i,
  });
 
}


async function bankService(bank: Bank) {
   do {

    let service = await inquirer.prompt([
        {
          name: "select",
          type: "list",
          message: "Which Service Do You Want To Use?",
          choices: ["View Balance", "Cash Withdraw", "Cash Deposit" , "Exit"],
        },
      ]);
      if (service.select == "View Balance") {
        let res = await inquirer.prompt([
          {
            name: "num",
            type: "input",
            message: "Enter your account number",
          },
        ]);
        let account = mybank.account.find((acc) => acc.accNumber == res.num);
        if (!account) {
          console.log(chalk.red.bold("Invalid Account Number"));
        } else {
          let name = mybank.customer.find(
            (item) => item.accNumber == account?.accNumber
          );
          console.log(`Dear ${chalk.green.italic(
            name?.firstName
          )} ${chalk.green.italic(name?.lastName)} Your Account Balance is ${chalk.bold.blueBright("$", account.balance)}
        `);
        }
      }
      if (service.select == "Cash Withdraw") {
        let res = await inquirer.prompt([
          {
            name: "num",
            type: "input",
            message: "Enter your account number",
          },
        ]);
        let account = mybank.account.find((acc) => acc.accNumber == res.num);
        if (!account) {
          console.log(chalk.red.bold("Invalid Account Number"));
        } else {
          let ans = await inquirer.prompt([
            {
              type: "number",
              message: "Enter the amount to withdraw",
              name: "amount",
            },
          ]);
          if (ans.amount > account.balance) {
            console.log(chalk.red.bold("Insufficient Balance"));
          }
          let newbalance = account.balance - ans.amount;
          // transaction method call
          bank.transaction({
            accNumber: account.accNumber,
            balance: newbalance,
          });
        }
      }
      if (service.select == "Cash Deposit") {
        let res = await inquirer.prompt([
          {
            name: "num",
            type: "input",
            message: "Enter your account number",
          },
        ]);
        let account = mybank.account.find((acc) => acc.accNumber == res.num);
        if (!account) {
          console.log(chalk.red.bold("Invalid Account Number"));
        } else {
          let ans = await inquirer.prompt([
            {
              type: "number",
              message: "Enter the amount to Deposit",
              name: "amount",
            },
          ]);
          let newbalance = account.balance + ans.amount;
          // transaction method call
          bank.transaction({
            accNumber: account.accNumber,
            balance: newbalance,
          });
         
        }
      }
    if(service.select == "Exit"){
        console.log(chalk.red.bold("Exiting The Program...."));
        return
        
    }
   } while (true);
 
}
bankService(mybank);