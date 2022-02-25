# Withered Away (Back End)

The frontend could be found [here](https://github.com/IshikaIme/withered-away-front).

## Get started locally

Clone the repository or just download the zip and unzip it one of your preferable folders. In the project directory, you should run:

### `npm install`

This should install all the dependencies from 'package.json'.

### `npm run dev`

This would run the server in the development mode with the help of 'nodemon' where any changes in the files will restart the server.

### `node server.js`

This would run the server where any changes in the files won't restart the server.

## Assets

The Entity Relationship Diagram (ERD), Schema Diagram and all the SQL files could be found inside the assets folder.

## Setup Database

This project was built using Oracle 19c. You should get that from [here](https://www.oracle.com/database/technologies/oracle-database-software-downloads.html). A complete installation of Oracle could be found in the assets folder.  

Now that Oracle is installed, you can create a user and grant him necessary privilages. If you want to keep things simple and follow the developer's guideline, open a program called 'SQL Plus', already intalled in your system with Oracle.

```
Enter user-name: sys as sysdba
Enter password: 123

Connected to:
Oracle Database 19c Enterprise Edition Release 19.0.0.0.0 - Production
Version 19.3.0.0.0

SQL> create user c##witheredaway identified by witheredaway;

User created.

SQL> grant dba to c##witheredaway;

Grant succeeded.
```

Open the newly created user in [Navicat](https://www.navicat.com/en/), [DataGrip](https://www.jetbrains.com/datagrip/download) or any other program you like or just use the terminal. You can either execute the `c##witheredaway.sql` or execute all the four of `create-table.sql`, `functions.sql`, `procedures.sql` & `triggers.sql`. The developer prefers it to do the later one. In the later case, you need to import data from the data export folder.

## Setting up .env

You would need a `.env` file in the base directory of this project. It should contain 4 things -

```
PORT=
DB_USER=
DB_PASS=
DB_CONNECTIONSTRING=
ACCESS_TOKEN_SECRET=
```

The PORT should be anything prefer. If you decide to stick with the default code in the frontend then use `PORT=8080`.  
DB_USER and DB_PASS should come from the user you just created inside oracle. To stick with the developer's choice, use these `DB_USER=c##witheredaway` and `DB_PASS=witheredaway`.  
The connection string would now look something like `DB_CONNECTIONSTRING=localhost:1521/orcl`.  

To generate an Access Token run this on the terminal

```
node
> require('crypto').randomBytes(64).toString('hex')
```

This would return a hex string of length 64 which you can use as the Access Token. For example-  
`0ad4a54899a691e87a5d687a6208208d1c2398ec45534d467d88a61fcc3fdd2656cfcbd22766c148340214705c7d087bdd707000f7dad6f785d8f20fac2896d3`  

Now your `.env` should look like -  

```
PORT=8080
DB_USER=c##witheredaway
DB_PASS=witheredaway
DB_CONNECTIONSTRING=localhost:1521/orcl
ACCESS_TOKEN_SECRET=0ad4a54899a691e87a5d687a6208208d1c2398ec45534d467d88a61fcc3fdd2656cfcbd22766c148340214705c7d087bdd707000f7dad6f785d8f20fac2896d3
```

## APIs

Get a full documentation [here](https://documenter.getpostman.com/view/12189344/UVkpQGUF).