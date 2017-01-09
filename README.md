#Setting up Aonic
  * use your ip address in proxyURL @ionic.config.js
    * to check your ip address type "ipconfig" @cmd
    * http://192.168.1.1:8000/ *sample*
  * In package.json you may want to change the ionic: serve and provide the ip address you used in ionic.config.json and put port 8000
    * so you don't need to provide your address and port every time you serve.
    * *sample* "ionic:serve": "ionic-app-scripts serve --address 192.168.1.1 --port  8000"


#Installation
  * npm install
  * ionic serve


#Packages used
  * Firebase


-No need to install firebase manually it'll be installed using "npm install"

#Updates
  * User Crud
  * User - Photo Upload
  * User Update with Photo
  * Post with userdata
  * Created a seprate view and form component
  * Limiting list with pagination and scroll event

Firebase host: https://aonicfirebase.firebaseapp.com/

