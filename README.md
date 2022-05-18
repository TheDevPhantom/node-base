# **Node-Base**

This is a base [Express](https://expressjs.com/) server application fitted with authorization using [JSON Web Tokens](https://jwt.io/) and [Sequelize](https://sequelize.org/) (works with SQL Server, MySQL, PostgreSQL, SQLite etc.) as the database ORM.

> Open `package.json` for the full list of dependencies

It was created by me (Adriaan Botha) as a quick start base for my projects as I found myself retyping this starting point every time.  
If you have any questions feel free to contact me via email or through my social links:

<adriaan@solis-studios.com>  
[Linked in]()  
[Dribbble]()

---

## **Installation**

#### Clone this repo

```
git clone https://github.com/TheDevPhantom/node-base.git
```

#### Install dependencies

```
npm install
```

or

```
yarn
```

---

## **Usage**

### Create config

Create a file called `\config\development.env` and insert the following environment variables:

- **PORT** _(eg. 5000)_
- **DB_HOST** _(eg. 192.168.0.102)_
- **DB_SCHEMA** _(eg. testdb)_
- **DB_USERNAME** _(eg. root)_
- **DB_PASSWORD** _(eg. admin123 or delete this field)_
- **JWT_SECRET** _(eg. my-32-character-ultra-secure-and-ultra-long-secret)_
- **JWT_EXPIRE** _(eg. 7d/3h/365d)_

### Update Database settings

In order for the app to work you need to install **one** of the following dialects for your database of choice:

```
npm install --save pg pg-hstore # Postgres
npm install --save mysql2
npm install --save mariadb
npm install --save sqlite3
npm install --save tedious # Microsoft SQL Server
```

and update the `dialect` option under `\config\db.js`. If you get lost, [click here](https://sequelize.org/docs/v6/getting-started/).

### And finally run the app

```
npm start
```

or

```
yarn start
```
