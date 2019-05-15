



# Airound

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.7. / 
node version: 8.16.0

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

2. Make the SSL keys using openssl for HTTPS

		Install openssl
		> wget https://www.openssl.org/source/openssl-1.0.2k.tar.gz
		> tar -xzf openssl-1.0.2k
		> cd openssl-1.0.2k
		> ./Configure
		> make
		> sudo make install
		
		Make key files
		> cd ..
		> openssl genrsa -des3 -out server.pass.key 2048
		(Enter pass phrase for server.pass.key)
		> openssl rsa -in server.pass.key -out server.key
		> rm server.pass.key

		Make csr file
		> openssl req -new -key server.key -out server.csr

		Make crt file
		> openssl x509 -req -sha256 -days 365 -in server.csr -signkey server.key -out server.crt

		Move keys into the './keys' directory
		> mkdir keys
		> mv server.csr server.key server.crt ./keys

##
  
4. Run the 'server.js' file

		> node server.js

##

3. If you want to run it for demon, It is recommended to use a 'forever' package.

		> [sudo] npm install forever -g
		> forever start server.js
