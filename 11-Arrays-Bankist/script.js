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
let sorted = false;

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const spinner = document.querySelector('.lds-ellipsis');
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

const sleep = ms => new Promise(r => setTimeout(r, ms * 100));

const generateUnames = function (accs) {
  for (let acc of accs) {
    acc.username = acc.owner
      .trim()
      .split(' ')
      .reduce((res, elem) => (res += elem[0].toLowerCase()), '');
  }
};
generateUnames(accounts);

const printBalance = function (acc) {
  acc.balance = acc.movements.reduce((res, elem) => (res += elem), 0);
  labelBalance.textContent = `₹${acc.balance}`;
};

const printSummary = function (acc) {
  const inc = acc.movements
    .filter(elem => elem > 0)
    .reduce((res, elem) => (res += elem), 0);
  labelSumIn.textContent = `₹${inc}`;

  const out = acc.movements
    .filter(elem => elem < 0)
    .reduce((res, elem) => (res += elem), 0);
  labelSumOut.textContent = `₹${Math.abs(out)}`;

  const int = acc.movements
    .map(elem => (elem * acc.interestRate) / 100)
    .filter(elem => elem >= 1)
    .reduce((res, elem) => (res += elem));
  labelSumInterest.textContent = `₹${int}`;
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach(function (elem, index) {
    let transactionType = elem > 0 ? 'deposit' : 'withdrawal';
    let htmlTemplate = `
      <div class="movements__row">
        <div class="movements__type movements__type--${transactionType}">${
      index + 1
    } ${transactionType}</div>
        <div class="movements__date">3 days ago</div>
        <div class="movements__value">${elem}</div>
      </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', htmlTemplate);
  });
};

const updateUI = async function () {
  // Transition hide app -> spin
  containerApp.style.opacity = 0;
  spinner.classList.remove('hidden');
  spinner.style.opacity = 100;
  await sleep(8);

  // Update Display
  displayMovements(currentAccount, sorted);
  printBalance(currentAccount);
  printSummary(currentAccount);

  // Transition hide spin -> app
  await sleep(8);
  spinner.classList.add('hidden');
  containerApp.style.opacity = 100;
};

// Event Handlers

let currentAccount;

btnLogin.addEventListener('click', async function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Welcome Text
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    updateUI();
  } else {
    containerApp.style.opacity = 0;
    console.log('Invalid Credentials');
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amt = Number(inputTransferAmount.value);
  const rcvr = accounts.find(acc => acc.username === inputTransferTo.value);
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amt > 0 &&
    rcvr &&
    currentAccount.balance >= amt &&
    rcvr?.username !== currentAccount.username
  ) {
    rcvr.movements.push(amt);
    currentAccount.movements.push(0 - amt);
    updateUI();
  } else {
    console.log(
      `Invalid Transfer - ${currentAccount?.owner} -> ${amt} -> ${rcvr?.owner}`
    );
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  let amt = Number(inputLoanAmount.value);
  inputLoanAmount.value = '';
  if (amt > 0 && currentAccount.movements.some(elem => elem >= amt * 0.1)) {
    currentAccount.movements.push(amt);
    updateUI();
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputClosePin.value = inputCloseUsername.value = '';
});

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  sorted = !sorted;
  displayMovements(currentAccount, sorted);
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
