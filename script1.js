'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Barney Stinson',
  movements: [2000, 4500, -4000, 30000, -6500, -1300, 700, 13000],
  movementsDates: [
    '2022-12-01T13:15:33.035Z',
    '2022-12-25T09:48:16.867Z',
    '2022-12-27T06:04:23.907Z',
    '2022-12-29T14:18:46.235Z',
    '2022-01-05T16:33:06.386Z',
    '2023-01-27T17:01:17.194Z',
    '2023-01-29T23:36:17.929Z',
    '2023-01-30T10:51:36.790Z',
  ],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Rachel Green',
  movements: [50000, 34000, -1500, -7900, -32100, -10000, 85000, -300],
  movementsDates: [
    '2022-11-01T13:15:33.035Z',
    '2022-11-25T09:48:16.867Z',
    '2022-11-27T06:04:23.907Z',
    '2022-11-29T14:18:46.235Z',
    '2022-12-05T16:33:06.386Z',
    '2023-01-27T17:01:17.194Z',
    '2023-01-29T23:36:17.929Z',
    '2023-01-30T10:51:36.790Z',
  ],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Robin Scherbatsky',
  movements: [2000, -2000, 3400, -3000, -200, 500, 4000, -4600],
  movementsDates: [
    '2022-11-01T13:15:33.035Z',
    '2022-11-25T09:48:16.867Z',
    '2022-11-27T06:04:23.907Z',
    '2022-11-29T14:18:46.235Z',
    '2022-12-05T16:33:06.386Z',
    '2023-01-27T17:01:17.194Z',
    '2023-01-29T23:36:17.929Z',
    '2023-01-30T10:51:36.790Z',
  ],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Joey Tribbiani',
  movements: [4300, 10000, 7000, 500, 900],
  movementsDates: [
    '2022-11-18T21:31:17.178Z',
    '2022-12-23T07:42:02.383Z',
    '2023-01-27T17:01:17.194Z',
    '2023-01-29T23:36:17.929Z',
    '2023-01-30T10:51:36.790Z',
  ],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const errorMsg = document.querySelector('.error-msg')
const error = document.querySelector('.error');
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





const transactionDate = function(transDate){
    const todaysDate = new Date();
    // console.log(todaysDate);
    // console.log(transDate);
    // console.log(todaysDate-transDate);
    const calcDate = (date1, date2) => {
        return Math.round((date2 - date1)/(1000*60*60*24))};
    
    let days = calcDate(transDate, todaysDate);
    // console.log(calcDate);

    // console.log(days);
    if(days === 0) return `today`;
    if(days === 1) return `yesterday`;
    if(days < 7) return ` ${days} day ago`;
    if(days >= 7 && days <= 13) return `a week ago`
    // const date = `${transDate.getDate()}`.padStart(2, 0);
    // const month = `${transDate.getMonth() + 1}`.padStart(2, 0);
    // const year = transDate.getFullYear();
    const info = new Intl.DateTimeFormat(navigator.language).format(transDate);
    return info;
}

const currencyFormat = function(rupee){
    const options1 = {
        style: 'currency',
        currency: 'INR',
    }
    return new Intl.NumberFormat(navigator.language, options1).format(rupee);
}





const startingLogOutTimer = function(){
    let min = 2;
    let sec = 0;
    let y;
    const time = function(){
    y = `${sec}`.padStart(2, 0);
    labelTimer.textContent = `${min}:${y}`;
    if(sec > 0){
        sec--;
        
    }
    else if(min === 0 && sec === 0){
        clearInterval(timer);
        containerApp.style.opacity = 0;
        labelWelcome.textContent = `Log in to get started`;
    }
    else{
        min--;
        sec = 59;
        // y = `${sec}`.padStart(2, 0);
    }
    // labelTimer.textContent = `${min}:${y}`;
    }
    time();
    const timer = setInterval(time,1000);
    return timer;

}

const displayMovements = function(acc, sort = false){
    containerMovements.innerHTML = '';
    const movs = acc.movements.slice().sort((a,b) => a-b);
    // console.log(movs);
    const xyz = sort ? movs : acc.movements;
    xyz.forEach(function(mov, i){
        const transDate = new Date(acc.movementsDates[i]);


        const type = mov > 0 ? 'deposit' : 'withdrawal';
        const html = `
            <div class="movements__row">
                <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
                <div class="movements__date">${transactionDate(transDate)}</div>
                <div class="movements__value">${currencyFormat(mov)}</div>
            </div>
        `
        containerMovements.insertAdjacentHTML('afterbegin', html);
    })
}

// displayMovements(account1.movements);

const createUserName = function(accounts){
    accounts.forEach(function(acc){
        acc.username = acc.owner.toLowerCase().split(' ').map(user => user.slice(0,2)).join('');
    })
}

createUserName(accounts);
console.log(accounts);

// const arr = accounts.map(function(acc){
//     console.log(acc.owner)
// })

const calctotalBalance = function(mov){
        const totalBalance = mov.reduce(function(acu, cur){
            // console.log(acu);
            return acu + cur;
        }, 0);

        labelBalance.textContent = `${currencyFormat(totalBalance)}`;
        
}


const calcDisplaySummary = function(movements, interestRate){
    const deposit = movements.filter(mov => mov > 0).reduce(function(acu, cur){
        return acu + cur;
    }, 0);
    const withdrawal = movements.filter(mov => mov< 0).map(mov => -1*mov).reduce(function(acu, cur){
        return acu + cur;
    }, 0);
    const intrests = movements.filter(mov => mov > 0).map(mov => mov*interestRate/100).filter(mov => mov >=1).reduce((acu, cur) => acu+cur, 0);
    console.log(deposit);
    console.log(withdrawal);
    console.log(intrests);
    labelSumIn.textContent = `${currencyFormat(deposit)}`;
    labelSumOut.textContent = `${currencyFormat(withdrawal)}`;
    labelSumInterest.textContent = `${currencyFormat(intrests)}`;
}

// console.log("hello");
// calcDisplaySummary(account1.movements, account1.interestRate);
// calctotalBalance(account1.movements);


let currentUser, timer;
btnLogin.addEventListener('click', function(e){
    // console.log("hi");
    e.preventDefault();
    // const errorDis = function(){
    //         error.style.opacity = 0;
    //     }
    
    currentUser = accounts.find(acc => acc.username === inputLoginUsername.value);
    // console.log(currentUser);

    if(currentUser?.pin === Number(inputLoginPin.value)){
        // alert(`Logged In Sucessfully`);
        const firstName = currentUser.owner.split(' ');
        labelWelcome.textContent = `Welcome back, ${firstName[0]}`;
        containerApp.style.opacity = 100;
        
        //Display data after login
        displayMovements(currentUser);
        calcDisplaySummary(currentUser.movements, currentUser.interestRate);
        calctotalBalance(currentUser.movements);
        if(timer) clearInterval(timer);
        timer = startingLogOutTimer();
        
        // error.style.opacity = 0;
    }
    else{
        errorMsg.textContent = `Wrong Credentials`;
        error.style.opacity = 1;
        setTimeout(function(){
            // console.log(`hi`);
            error.style.opacity = 0;
        }, 2000)
        // setTimeout(errorDis(), 1000);
        
    }
    const options = {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',

    }
    const now = new Date();
    labelDate.textContent= new Intl.DateTimeFormat(navigator.language, options).format(now);


    // const date = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hours = now.getHours();
    // const minutes = `${now.getMinutes()}`.padStart(2,0);
    // labelDate.textContent = `${date}/${month}/${year} ${hours}:${minutes} `;


    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    // console.log(e);

})


//transferMoney

btnTransfer.addEventListener('click', function(e){
    e.preventDefault();
    const transferedTo = accounts.find(acc => acc.username === inputTransferTo.value);
    const amount = Number(inputTransferAmount.value);
    inputTransferTo.value = inputTransferAmount.value = '';
    inputTransferAmount.blur();
    if(amount > 0 && amount <= currentUser.movements.reduce((acc,cur) => acc+cur, 0) && transferedTo !== undefined && transferedTo !== currentUser){
        currentUser.movements.push(-1*amount);
        transferedTo.movements.push(amount);
        const transferDate = new Date();
        // let date2 = transferDate.toISOString();
        // console.log(transferDate.toISOString)
        currentUser.movementsDates.push(transferDate.toISOString());
        transferedTo.movementsDates.push(transferDate.toISOString());
        displayMovements(currentUser);
        calcDisplaySummary(currentUser.movements, currentUser.interestRate);
        calctotalBalance(currentUser.movements);
        errorMsg.textContent = `Transaction Successful`;
        error.style.opacity = 1;
        setTimeout(function(){
            // console.log(`hi`);
            error.style.opacity = 0;
        }, 2000)

        clearInterval(timer);
        timer = startingLogOutTimer();
        // displayMovements(transferedTo.movements);
        // calcDisplaySummary(transferedTo.movements, transferedTo.interestRate);
        // calctotalBalance(transferedTo.movements);
    }
    else{
        if(transferedTo === undefined){
            errorMsg.textContent = `Invalid User`;
            error.style.opacity = 1;
            setTimeout(function(){
                // console.log(`hi`);
                error.style.opacity = 0;
            }, 2000)
        }
        else if(transferedTo === currentUser){
            errorMsg.textContent = `Invalid! you are trying to tranfer money to your account only`;
            error.style.opacity = 1;
            setTimeout(function(){
                // console.log(`hi`);
                error.style.opacity = 0;
            }, 2000)
        }
        else{
            errorMsg.textContent = `Please Enter Valid Amount`;
            error.style.opacity = 1;
            setTimeout(function(){
                // console.log(`hi`);
                error.style.opacity = 0;
            }, 2000)
        }
        
    }
})

//Loan

btnLoan.addEventListener('click', function(e){
    e.preventDefault();
    const amount = Number(inputLoanAmount.value);
    inputLoanAmount.value = '';
    inputLoanAmount.blur();
    console.log(currentUser.movements.some(mov => mov >= amount*(0.1)));
    if(amount > 0 && currentUser.movements.some(mov => mov >= amount*(0.1))){
        setTimeout(function(){
            currentUser.movements.push(amount);
            const transferDate = new Date();
            currentUser.movementsDates.push(transferDate.toISOString());
            displayMovements(currentUser);
            calcDisplaySummary(currentUser.movements, currentUser.interestRate);
            calctotalBalance(currentUser.movements);
            errorMsg.textContent = `Loan Granted`;
            error.style.opacity = 1;
            setTimeout(function(){
                // console.log(`hi`);
                error.style.opacity = 0;
            }, 2000)
    }, 2000)

        clearInterval(timer);
        timer = startingLogOutTimer();
    }
    else{
        errorMsg.textContent = `Please Enter Valid Amount`;
        error.style.opacity = 1;
        setTimeout(function(){
            // console.log(`hi`);
            error.style.opacity = 0;
        }, 2000)
    }

})

//Delete Account

btnClose.addEventListener('click', function(e){
    e.preventDefault();
    if(currentUser.username === inputCloseUsername.value && currentUser.pin === Number(inputClosePin.value)){
        const index = accounts.findIndex(acc => acc.username === currentUser.username);
        accounts.splice(index, 1);
        containerApp.style.opacity = 0;
        
        labelWelcome.textContent = `Log in to get started`;
    }
    else{
        // alert(`Wrong Credentials`);
        errorMsg.textContent = `Wrong Credentials`;
        error.style.opacity = 1;
        setTimeout(function(){
            // console.log(`hi`);
            error.style.opacity = 0;
        }, 2000)
    }
    inputClosePin.value = inputCloseUsername.value = '';
    inputClosePin.blur();
})

//sort
let sorted = false;
btnSort.addEventListener('click', function(e){
    e.preventDefault();
    displayMovements(currentUser, !sorted);
    sorted = !sorted;
})









/////////////////////////////////////////////////
/////////////////////////////////////////////////


/////////////////////////////////////////////////





///////////////////////////////////////



