

# Airound

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.7.

# Air-pollution-Web-Client
## How to run
1. Download the project

		> git clone https://github.com/kimhe5623/Air-pollution-Web-Client.git

## 

2. Install packages

		> npm install

## 

3. Modify "node_modules/@types/googlemaps/index.d.ts" for working googlemaps well
	
	For modifying the file, open it using vim
	
		> vim node_modules/@types/googlemaps/index.d.ts

	And add below contents at the first line of the codes
	
		declare  module  'googlemaps';

## 

4. Run it using the angular-cli (when developing on local)

		> npm start
    
		(or)
    
		> ng serve --proxy-config proxy.conf.json



## How to deploy

If you modify some codes and want to apply them on server, follow the below steps.

1. Build your project on the './dist' folder by using the below angular/cli command

		> ng build --prod

##

2. Run the 'server.js' file

		> node server.js

##

3. If you want to run it for demon, It is recommended to use a 'forever' package.

		> [sudo] npm install forever -g
		> forever start server.js
