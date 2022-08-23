# Showcase of Trander
## Client web
<hr>

### Login
Login shared between the client and admin with slighlty different features.
Animated error and success attempts.
![login](https://i.imgur.com/wHHUJu0.png)

### Index
User index page with files belonging to the user.
![login](https://i.imgur.com/11Uwr7X.png)

User can download files

![login](https://i.imgur.com/8JePJt6.png)

![login](https://i.imgur.com/Qd9KiBU.png)

<br>

## Admin web
<hr>

### User management
_Currently not fully implemented_

### User files management
Admin can view all the users created and manage their files.
![login](https://i.imgur.com/LONx4Jy.png)

Also is possible to see users statistics (disk space for now).

![login](https://i.imgur.com/KVSlJ4F.png)

When admin enters the user management page, the user is able to see the files he has uploaded, edit the name, delete the file and upload more files.

#### View
![login](https://i.imgur.com/yeII9Rl.png)

#### Edit
![login](https://i.imgur.com/VqxtD2A.png)
![login](https://i.imgur.com/6bnGNzQ.png)
![login](https://i.imgur.com/evzADdg.png)

#### Delete
![login](https://i.imgur.com/yeII9Rl.png)

#### Upload
![login](https://i.imgur.com/7v10zRp.png)

Uploads are controlled by middlewares to prevent admin accidentally upload unwanted files.

- File size limit: 1 GB
- File type limiter: .jpg, .png, .jpeg, .gif, .mp4, .avi, .mp3, .wav, .mp4, .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .txt, .zip, .rar

_not implemented yet_
- User space limit: do not exceed the maximum size of client space
- Server space limit: do not exceed the maximum size of server space 
- File name limiter: no special characters, no spaces, no accents


