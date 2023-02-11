# Proximity Messaging (WECONNECT)
https://weconnect.symneycameron.repl.co/
<br>This was my project for HACKPSU 2022. In this project I had 24 hours to develop a platform that will help bring people Closer together.<br>
So, I decided to build a messaging application where chats were only visible to people within a specific radius determined by the chat creator. Chats are also sent in real time!<br> 
This incentivizes people to talk with people within their close proximity and encourages them to make new in person connections.<br>
All of the proximity data was done in vanilla js and the calculations are stored in a database<br>
Only people within the chat radius can communicate with each other and if you try to create a chat that conflicts with another radius the application will not let you. Chats overlapping with other chats defeats the purpose.<br>
When creating a Chat you are the center of the radius and the geofence is in the shape of a square. represented with four coordinate points containing longitude and latitude data.

<h1>How to test</h1>
* Try to join after entering a username. If it automatically joins you the there is already a group for your area and the app works.<br>
* If there is no chat created for your group create a group and set the radius to .01 miles (50ft). Make the name unique<br>
* Once you are in the chat send a message and go back to the home page<br>
* Walk 100 ft away (might have to be 150ft) and create a new chat with a new name. Optionally send a message<br>
* Walk back to the original location you created the original chat and click the join chat button ( this should take you to the original chat you created and you should see your original message)<br>
* Congratulations You have now seen the power of geofencing<br>


<h1> The Tech Stack</h1>
* MongoDb to store chat data and geofencing data<br>
* Express For networking with Node.js<br>
* NodeJS as the backend js runtime enviornment and to calculate to geofence data<br>
* HTML/JS/CSS for the visuals and libraries that supplement devices location data <br>
* SOCKET IO for the real time messaging protocol<br>
* The entire project was originally hosted locally using a linux machine then subsequently a cloud linux machine<br>

<h1>How to set up</h1>
1) install Node .js<br>
2) clone the project to a folder<br>
3) run npm install<br>
4) Set up a mongo database and replace the database uri with your uri<br>
5) node index.js<br>


<h1> Usage Notes</h1>
* The HTML location data gets kind of buggy within small radius' while the best visual example would be to create a chat with a .01 mile radius (about 50ft) then create another chat with a .01 mile radius 100 ft away your results may have varying success<br>
* To make sure that the application works make the radius .01 miles, drive far away and see if you can join the chat. Then return to the place you created the chat and you should be able to join back.


