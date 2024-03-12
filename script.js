'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
const eurToUsd = 1.1;
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

//generating html elements
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach((mov, i, arr) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${mov}</div>
        </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
// displayMovements(account1.movements);

//calculate total balance
// var balance = 0;
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = `${acc.balance}₹`;
};
// calcDisplayBalance(account1.movements);

//calculating the total credit and debit money and displaying it to the screen
const calcDisplaySummary = function (acc) {
  //calaculating total credited money

  const incomes = acc.movements
    .filter(mov => mov > 0)
    .map(mov => mov * eurToUsd)
    .reduce((acc, mov) => mov + acc, 0);
  //console.log(incomes);
  //Display the total deopsits
  labelSumIn.textContent = `${Math.trunc(incomes)}₹`;

  //Debited money
  const out = acc.movements
    .filter(mov => mov < 0)
    .map(mov => mov * eurToUsd)
    .reduce((acc, mov) => acc + mov);
  labelSumOut.textContent = `${Math.abs(Math.trunc(out))}₹`;

  //calculate the interests
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${Math.trunc(interest)}₹`;
};
// calcDisplaySummary(account1.movements); //calling the function to display all the debbit and credits

//creating usernames for the users
const createUserNames = function (accs) {
  accs.forEach((acc, i) => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => {
        return name[0];
      })
      .join('');
  });
};
createUserNames(accounts);
const updateUI = function (acc) {
  //2-Display movements
  displayMovements(currentAccount.movements);

  //3-display balance
  calcDisplayBalance(currentAccount);
  //4-display summary
  calcDisplaySummary(currentAccount);
};
console.log(accounts);

//************************************************************************************ */
// Login functionality below
let currentAccount;
btnLogin.addEventListener('click', e => {
  e.preventDefault(); //prevent from refreshing automatically on submit

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  ); //Finds the owner
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //authenticate owner pin
    console.log('login');
    //If login successfull then:
    //1- Display UI and message
    labelWelcome.textContent = `Welcome back,${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    //clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //updates the UI
    updateUI(currentAccount);
  }
  // const pin = inputLoginPin.value;
  // console.log('clicked');
  // console.log(username, pin);
});

//Transfering the money from one account to another account

btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  console.log(amount, receiverAcc);

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    console.log('transefered');
    //Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    //updates the UI
    updateUI(currentAccount);
  }
});

//Close the user account from the bank
btnClose.addEventListener('click', e => {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    //delete account
    accounts.splice(index, 1);

    //Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

// Requesting Loan amount

btnLoan.addEventListener('click', e => {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);

    //again update the UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
  //console.log(amount);
});

// sorting the amounts on click
let sorted = false; //state variable
btnSort.addEventListener('click', e => {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
//Practice Code below
// labelBalance.addEventListener('click', e => {
//   const movementsUI = Array.from(
//     document.querySelectorAll('.movements__value'),
//     el => Number(el.textContent.replace('₹', ' '))
//   );
//   console.log(movementsUI);
// });
// inputLoginPin, inputLoginUsername;
// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);
// const max = movements.reduce((acc, curr) => {
//   if (acc < curr) return (acc = curr);
//   else return (curr = acc);
// }, 0);
// console.log(max);
// //converting euro to usd
// const eurToUsd = 1.1;
// const movementsUSD = movements.map((mov, i, arr) => mov * eurToUsd);
// console.log(movementsUSD);
// console.log(movements);
// //map function
// const movementsDescription = movements.map((mov, i, arr) => {
//   return `movement ${i + 1}: You ${
//     mov > 0 ? 'deposited' : 'withdrew'
//   } ${Math.abs(mov)}`;
// });
// console.log(movementsDescription);
