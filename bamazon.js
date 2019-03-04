const mysql = require('mysql')
const inquirer = require('inquirer')
let obj;
let arr;
let arr2;
let num;
let newArr = []
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '1234',
    database: 'bamazon'
})

connection.connect((err) => {
    if (err) throw err;
    createTable()
})

connection.query(`create database if not exists bamazon`)

const createTable = () => {
    connection.query(`create table if not exists items (
        id int auto_increment,
        product_name varchar(50),
        department_name varchar(50),
        price decimal(10, 2),
        stock_quantity int(50),
        primary key (id)
    )`)
    writeData()
}

const writeData = () => {
    connection.query(`insert into items (product_name, department_name, price, stock_quantity) value ("computer", "electronics", 499.99, 10)`)
    readData()
}

const readData = () => {
    // connection.query(`delete from items where product_name = 'computer'`, (err, data) => {
    //     if (err) throw err
    //     console.log(data)
    // })
    connection.query(`select * from items`, (err, data) => {
        if (err) throw err
        obj = data
        // need to add a for loop
        for (let i = 0; i < obj.length; i ++) {
        arr = Object.values(obj[i]).join(" ")
        newArr.push(arr)
        console.log(newArr)
        }
        arr2 = Object.keys(obj[0]).join(" ")
        console.log(arr)
        console.log(arr2)
        customer()
    })

}

const customer = () => {

inquirer
.prompt([
    {
        name: 'itemsList',
        type: 'list',
        // works but does not line up
        message: "Choose an item you'd like to buy \n" + arr2,
        choices: newArr
    }
]).then( (res) => {
    // match the id selected just grabbing the numbers at the start
    connection.query(`select * from items where id = ?`, res.itemsList.match(/^\d+/), (err, data) => {
        if (err) throw err
        num = data[0].id
        console.log(data)
        inquirer
        .prompt([
            {
                name: 'quantity',
                type: 'input',
                message: 'how many '+ data[0].product_name +'(s) would you like to buy?'
            }
        ]).then( (res) => {
            if (data[0].stock_quantity-res.quantity >= 0) {
            connection.query(`update items set stock_quantity = ? where ?`, [data[0].stock_quantity-res.quantity, data[0].stock_quantity], (err, data) => {
                if (err) throw err
                console.log(data)
            })
        } else {
            console.log('insufficient stock')
        }
        })
    })
})

}
