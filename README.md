
# Airound

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.7.

# Air-pollution-Web-Client
## How to run
1. Download the project

		> git clone https://github.com/kimhe5623/Air-pollution-Web-Client.git

# 

2. Install packages

		> npm install

# 

3. Modify "node_modules/@types/googlemaps/index.d.ts" for working googlemaps well
	
	For modifying the file, open it using vim
	
		> vim node_modules/@types/googlemaps/index.d.ts

	And add below contents at the first line of the codes
	
		declare  module  'googlemaps';

# 

4. Run it using the angular-cli

		> npm start
		(or)
		> ng serve --proxy-config proxy.conf.json
