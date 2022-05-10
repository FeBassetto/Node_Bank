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
            'Consultar saldo',
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

        })
        .catch(err => console.log(err))

}


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