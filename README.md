# mazewebsite for Touch
Website version of Christopher Manson's 1985 book, Maze: Solve the World's Most Challenging Puzzle, by Al Sweigart
I than forked it for the base code and the assets.
Al Sweigart's website for the original is at [https://inventwithpython.com/mazewebsite/](https://inventwithpython.com/mazewebsite)
My take on this: I wanted to read the book, and play the puzzle. But it was very difficult to navigate on a cellphone, So I spun it into a touch app.     This can now be used as a framework for anyone else that may want to make a static point and click adventure.

There is a Janky notes system that will allow you to save text and drawings link a travel log, you can save it as a JSON file and load it between the games you play. I wanted this feature because it would save me needing a pen and paper.


From the fork I kept the images and made use of the maps for what part of the images link to what other pages.

We have built out 5 components to get this project where I wanted it.

Index.html - This file glues the resources and libraries together
App.js  - This is the application in JavaScript
roomData.js – JavaScript flat data file with room data, image maps and links between rooms.  

debug.html – Glue file for a debug version of the app, 
app-debug.js - This is based  on the normal app.js and will show the hot spot in the image with the coordinates, it also shows the current mouse position, so you can get the coordinates to update the roomData.js file.

In progress is an advanced Debug app that will let you map the destinations and area of the point of interest / hotspot so you can save the snippet into the RoomData.js

Scott Bruder ScottB.ca - London Ontario Canada
