# Table of Contents

[Airound](#airound)

1. [Reference Model](#reference-model)
2. [System Architecture](#system-architecture)
3. [Airound Web Application](#airound-web-application)
    - [User Management](#user-management)
    - [Sensor Management](#sensor-management)
    - [Administrator Only](#admin-only)
    - [Data Monitoring](#data-monitoring)

4. [Angular version info](#version-info)
5. [How to run](#how-to-run)
6. [How to deploy](#how-to-deploy)


<a name="airound"/>

# Airound #

<img src="https://user-images.githubusercontent.com/32252093/101591186-46c32480-3a2f-11eb-8c9c-f8170c9da66a.png" width="400px" />

This system measures CO, O3, NO2, SO2, PM2.5, PM10, etc., which are used in air pollution indicators, and displays the AQI index to the user. Users can obtain global atmospheric indicators by sharing the measured data.

<a name="reference-model"/>

## 1. Reference Model

![image](https://user-images.githubusercontent.com/32252093/101592711-12049c80-3a32-11eb-9f14-eea8d4b0c475.png)


<a name="system-architecture"/>

## 2. System Architecture

![image](https://user-images.githubusercontent.com/32252093/101599790-b3452000-3a3d-11eb-9b67-a3fd3ca0dc4d.png)


<a name="airound-web-application"/>

## 3. Airound Web Application

<a name="user-management"/>

### 3.1. User Management 


![image](https://user-images.githubusercontent.com/32252093/101594170-91936b00-3a34-11eb-9b36-bda54fd80b85.png)

- Sign up
- User verification code entry
- Sign in
- Forgot password - reset password
- Password change
- Deregistration

<a name="sensor-management"/>

### 3.2. Sensor Management

![image](https://user-images.githubusercontent.com/32252093/101596835-239d7280-3a39-11eb-99fa-b32731113d9d.png)

- Sensor registration
- Sensor list view
- Sensor association
- Sensor dissociation

<a name="admin-only"/>

### 3.3. Administrator Only

![image](https://user-images.githubusercontent.com/32252093/101596886-39129c80-3a39-11eb-84e0-bef279e15414.png)

- User list view
- Administrator sensor list view
- Administrator sensor registration
- Administrator sensor dissociation

<a name="data-monitoring"/>

### 3.4. Data Monitoring

![image](https://user-images.githubusercontent.com/32252093/101598477-93146180-3a3b-11eb-89a8-aa4b5d632934.png)

- Main page
- Dashboard
- Real time air quality view
- Real time heart rate view
- Historical air quality view
- Historical heart rate view
- Sensor historical record view


<a name="version-info"/>

## 4. Angular version info
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.7. / 
node version: 8.16.0


<a name="how-to-run"/>

## 5. How to run
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


<a name="how-to-deploy"/>

## 6. How to deploy

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
