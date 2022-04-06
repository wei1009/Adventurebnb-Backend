# Adventurebnb


##  [Try live app here!](https://adventurebnb.surge.sh/)   

## Database Schema  

![hoempage](/images/schema.png "schema")

## Built With  

The coding languages, frameworks, and libraries that I used to build this project:  

Frontend

* JavaScript
* React
* HTML
* CSS
* Axios  

Backend

* Node.js
* Express.js
* PostgreSQL
* JSON Schema
* bcrypt

## How to Run the Project

To get a local copy up and running follow these steps:  

### Clone Repos

Download the [HotelSearchService-Frontend](https://github.com/wei1009/HotelSearchService-Frontend) ZIP or enter the following in the desired directory in your terminal:  

 	https://github.com/wei1009/HotelSearchService-Frontend.git  

Download the [HotelSearchService-Backend](https://github.com/wei1009/HotelSearchService-Backend) ZIP or enter the following in the desired directory in your terminal: 


 	https://github.com/wei1009/HotelSearchService-Backend.git  

### Library Installations 

Install the libraries in each frontend and backend repo  

	npm install

### API KEY setting  

Create .env file:  

Set up API _ KEY and API _ SECRET from [Hotel Content API](https://api.test.hotelbeds.com/hotel-content-api/1.0/hotels)  
Set up GOOGLE_API_KEY from [Google Map API](https://www.google.com/maps/embed/v1/place) 



### Postgres Installation  

Install [Postgres](https://www.postgresql.org/).  

Create a database "hotel" in your terminal in the backend directory.

	createdb hotel  

Run the following command in your terminal in the backend directory to create the database tables and seed data to database. (Please wait a few seconds. )  

	psql -d hotel -f hotel-schema.sql -f hotel-seed.sql  

### Start the server   

Frontend:  

	npm start  
Backend:  

	node server.js


### Test the backend directory

	jest
