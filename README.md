# coin-flip
A coin-flipping site. A user joins, creates a new game, then gives the game code to friend.

Friend goes to site, enters with that code, and the two can flip a coin against each other. After both ready up, the server flips a coin and the result is sent to users. Users can then re-ready and re-flip.

If one user leaves, the remaining user is left with a screen that is as if they just created the game, regardless of if they created the game. The room still exists, and another person can join to face the remaining user. Once the room is empty, however, it is deleted.

Yes, this is pretty useless. It's literally Math.random() > 0.5 wrapped with some code. But, I never thought this would be useful. Instead, I wrote this to learn how to use some cool frameworks and to prove to myself that I could do it, especially because I wanted to do this months ago but have been too demotivated to write code until recently. But, here it is, working and looking good (somewhat).

Speaking of which, I am terrible at frontend design. Much like drawing, I had a great image of the site in my head, but that didn't really translate well to CSS.

## Frameworks Used:
* socket.io
* React
* Express

## To-Do List:
In no particular order:
* Coin-flipping animation
* Make or find better coin images
* Better font
* Better colors
* Better error messages
* Notify if enemy leaves
* Just generally make the frontend look less crap (aiming for same aesthetic as the buttons, which is the only part I like)
* Mobile design
* Maybe an app to try out React Native
* Maybe include a chat between the two players