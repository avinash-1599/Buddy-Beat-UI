# Budy Beat UI

- Create a Vite + React application
- Remove unnecessary files and create hello world app
- install tailwind css
- add daisyui
- add navbar component to App.jsx
- install reacr router dom
- Create BrowserRouter > Routes > Route='/' Body RouteChildren
- Create an outlet in Body component
- Create a footer
- create signup page component
- create login page component
- install axios
- implement CORS in backend - add this middleware with origin and credentials configuration
- install Redux Toolkit and read about it
- configure store and provide it to the application 
- create slice and use it in store  (setting up redux store)
- add redux devtool in chrome
- login and check if data is coming properly in redux store
- NavBar should update as soon as user logins
- refactor code to store constants
- we should not access other routes without login
- if token is not present, redirect to login page
- make logout functionality in ui
- make profile section in ui
- show toast msg on profile update
- show connections page
- show connection request page
- accept/reject connection request
- show ignore/interest of users functionality from feed



Body
- NavBar
- Route=/ => feed
- Route=/login => Login Page
- Route=/connections => Connections Page
- Route=/profile => Profile Page




// deploying to AWS 

- signup to aws account
- login to aws
- go to ec2 and create an ec2 instance
- chmod 400 <secret>.pem
- connect to the server machine using command:ssh -i "Buddy-Beat-Secret.pem" ubuntu@ec2-51-21-150-58.eu-north-1.compute.amazonaws.com
- install nodejs as per your local nodejs version (curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash)
- git clone your projects frontend, backend on server machine
- For frontend
  - npm install -> dependencies
  - npm run build
  - sudo apt update
  - sudo apt install nginx
  - sudo systemctl start nginx
  - sudo systemctl enable nginx
  - copy code from dist(build files) to /var/www/html
    - sudo scp -r dist/* /var/www/html
    - enable port 80 of your instance to run frontend app on public IP (Instance Details -> Security -> Security groups -> Edit Inbound Rules -> give Port Range 80 -> Save)
- For Backend
 - if any changes, push to github and then take pull on server machine
 - allow ec2 instance public IP on mongodb server (IP whitelisting)
 - npm install pm2 -g
 - pm2 start npm -- start  OR  pm2 start npm --name "Buddy-Beat-Backend" -- start (for custom process name)
 - pm2 logs
 - pm2 list, pm2 flush <name>, pm2 stop <name>, pm2 delete <name>

#############
- let us suppose we took domain buddybeat.com that maps to 51.21.150.58
- Frontend -> 51.21.150.58 -> buddybeat.com
- Backend -> 51.21.150.58:7777 -> buddybeat.com/api
- for nginx proxy pass /api to 7777, we have to configure nginx
  - go to path /etc/nginx/sites-available/default to configure
  - server 51.21.150.58;
  - location /api/ {
        proxy_pass http://localhost:7777/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
  - restart nginx -> sudo systemctl restart nginx
  - modify the BASE_URL to /api in frontend project


  # Adding a custom domain name

  - purchase domain name from godaddy
  - signup on cloudflare and add a new domain name
  - change the nameservers on godaddy and point it to the cloudflare
  - wait for sometime till your nameservers are updated
  - dns record (map your website to your IP)
  - enable SSL for website (flexible or full as per your requirement)


  # Sending emails via SES
  - create IAM user
  - give access as AmazonSESFullAccess
  - verify your domain name
  - verify your email address identity
  - install aws sdk-v3
  - https://github.com/awsdocs/aws-doc-sdk-examples/tree/main/javascriptv3/example_code/ses#code-examples
  - setup SES client
  - access credentials should be created in IAM under Security Credentials tab
  - add credentials to the env file
  - write code for SESClient
  - write code for sending Email
  - make the email dynamic by passing more params to the run function

  # Razorpay payment gateway integration
  - sign up on razorpay and complete KYC
  - created a UI for premium membership page
  - create an API for create order in backend
   - added razorpay key and secret in env file
   - initialized razorpay in utils folder
   - creating order on razorpay
   - created schema and model for payment
   - saved the order details in payment collections


   # Real-time chat application using web sockets (socket.io)

   - create UI for chat window on /chat/:targetUserId
   - setup socket.io in backend
   - npm i socket.io

   // app.js file
   const express = require('express')
   const app = express()
   const http = require('http')
   const server = http.createServer(app)
   initializeSocket(server)
   server.listen(PORT, () => console.log('server listening on PORT))

   // initializing socket in backend/server
    // socket.js file
   const socket = require('socket.io')

   const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173"
        }
    });

    io.on('connection', (socket) => {
        console.log('Socket connected: ', socket.id);

        socket.on("joinChat", (data) => {
            
        })

        socket.on("sendMessage", async (data) => {

        })

        socket.on('disconnect', () => {
            console.log('Socket disconnected: ', socket.id);
        })
    })
}

module.exports = initializeSocket;


// stting up socket in client side

npm i socket.io-client

// socket.js file

import io from "socket.io-client";
import { BASE_URL } from "./constants";

export const createSocketConnection = () => {
    return io(BASE_URL);
}
