// external modules

const inquirer = require('inquirer')
const chalk = require('chalk')

//internal modules

const fs = require('fs')

operation()

function operation() {

    inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: 'O que você deseja fazer?',
        choices: [
            'Criar Conta',
            'Consultar Saldo',
            'Depositar',
            'Sacar',
            'Sair'
        ]
    }])
        .then(res => {

            const action = res.action

            action === 'Criar Conta' && (
                createAccount()
            )

            action === 'Depositar' && (
                deposit()
            )

            action === 'Consultar Saldo' && (
                getAccountBalance()
            )

            action === 'Sacar' && (
                withdraw()
            )

            action === 'Sair' && (
                console.log(chalk.bgBlue.black('Obrigado por usar o Accounts!')),
                process.exit()
            )

        })
        .catch(err => console.log(err))

}

//Create account

function createAccount() {

    console.log(chalk.bgGreen.black('Parabéns por escolher o nosso banco!'))
    console.log(chalk.green('Defina as opções da sua conta a seguir'))

    buildAccount()

}


function buildAccount() {

    inquirer.prompt([{
        name: 'accountName',
        message: 'Digite um nome para sua conta:'
    }])
        .then(res => {

            const accountName = res['accountName']

            if (!fs.existsSync('accounts')) {
                fs.mkdirSync('accounts')
            }

            if (fs.existsSync(`accounts/${accountName}.json`)) {
                console.log(
                    chalk.bgRed.black('Esta conta já existe, escolha outro nome!')
                )
                buildAccount()
                return
            }

            fs.writeFileSync(`accounts/${accountName}.json`, '{"balance":0}',
                err => {
                    console.log(err)
                })

            console.log(chalk.green('Parabéns sua conta foi criada!'))
            operation()
        })
        .catch(err => console.log(err))

}


// add an amount to user account

function deposit() {

    inquirer.prompt([{
        name: 'accountName',
        message: 'Qual o nome da sua conta?'
    }])
        .then(res => {

            const accountName = res['accountName']

            //verify if account exists
            if (!checkAccount(accountName)) {
                return deposit()
            }

            inquirer.prompt([{
                name: 'amount',
                message: 'Quanto você deseja depositar:'
            }])
                .then(res => {

                    const amount = res['amount']

                    //add an amount
                    addAmount(accountName, amount)
                    operation()

                })
                .catch(err => console.log(err))

        })
        .catch(err => console.log(err))

}

function checkAccount(accountName) {

    if (!fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(chalk.bgRed.black('Esta conta não existe, tente novamente!'))
        return false
    }

    return true

}

function addAmount(accountName, amount) {

    const accountData = getAccount(accountName)

    if (!amount) {
        console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde!'))
        return deposit()
    }

    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance)

    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        err => console.log(err)
    )

    console.log(chalk.green(`Foi depositado o valor de R$${amount} na sua conta`))
}

function getAccount(accountName) {

    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
        encoding: 'utf8',
        flag: 'r'
    })

    return JSON.parse(accountJSON)

}


// show account balance

function getAccountBalance() {

    inquirer.prompt([{
        name: 'accountName',
        message: 'Qual o nome da sua conta?'
    }])
        .then(res => {

            const accountName = res['accountName']

            //verify if account exist
            if (!checkAccount(accountName)) {
                return getAccountBalance()
            }

            const accountData = getAccount(accountName)


            console.log(chalk.bgBlue.black(
                `Olá, o saldo da sua conta é de R$${accountData.balance}`
            ))

            operation()

        })
        .catch(err => console.log(err))

}

function withdraw() {

    inquirer.prompt([{
        name: 'accountName',
        message: 'Qual a conta que você gostaria de sacar?'
    }])
        .then(res => {

            const accountName = res['accountName']

            //verify if account exists
            if (!checkAccount(accountName)) {
                return withdraw()
            }

            inquirer.prompt([{
                name: 'current',
                message: 'Quanto você deseja sacar?'
            }])
                .then(res => {

                    const accountData = getAccount(accountName)

                    if (accountData.balance < res.current) {

                        console.log(chalk.bgRed.black(`Saldo indisponivel`))
                        return withdraw()
                    }

                    accountData.balance = parseFloat(accountData.balance) - parseFloat(res.current)

                    fs.writeFileSync(
                        `accounts/${accountName}.json`,
                        JSON.stringify(accountData),
                        err => console.log(err)
                    )

                    return operation()

                })
                .catch(err => console.log(err))

        })
        .catch(err => console.log(err))

}