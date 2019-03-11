const mysql = require('mysql')
const inquirer = require('inquirer')
let obj;
let arr;
let arr2;
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
// connection.query(`drop table departments`)
const createTable = () => {
    connection.query(`create table if not exists departments (
        id int auto_increment,
        department_name varchar(50),
        over_head_costs int(50),
        product_sales int(50),
        primary key (id)
    )`)
    // connection.query(`delete from departments where department_name = 'clothing'`, (err, data) => {
    //     if (err) throw err
    //     console.log(data)
    // })
    inquirer
    .prompt([
        {
            name: 'menu',
            type: 'list',
            // works but does not line up
            message: 'Select menu option',
            choices: ['View Product Sales by Department', 'Create new Department']
        }
    ]).then( res => {
        if (res.menu === 'Create new Department') {
            inquirer
            .prompt([
                {
                    name: 'dname',
                    type: 'input',
                    message: 'What is the name of the department?'
                },
                {
                    name: 'budget',
                    type: 'input',
                    message: 'what is the over head cost?'
                }
            ]).then (res => {
                connection.query(`insert into departments (department_name, over_head_costs, product_sales)
                value ('${res.dname}', '${res.budget}', 0)`)
            })
        } else if (res.menu === 'View Product Sales by Department') {
            connection.query(`select * from departments`, (err, data) => {
                if (err) throw err
                arr2 = Object.keys(data[0]).join(" ")
                let header = ['department_id', 'department_name', 'over_head_consts', 'product_sales', 'total_profit']
                console.log(header.join(" "))
                for (let i = 0; i < data.length; i ++) {
                    arr = Object.values(data[i])
                    arr.push(arr[3]-arr[2])
                    newArr.push(arr.join(" "))
                    console.log(newArr.join(" "))
                    }
            })
        }
    })
}
