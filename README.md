# firebase-api
API to upload files to firebase

# How to use
1. Download the project
2. run `npm install` in root folder
3. create a .env file in root folder
4. add keyFileName, projectId, bucket variables
5. run `npm start`
6. open localhost:3000


# Features
## upload via API
You can use `/upload` endpoint to send form-data to the api from another api.

## EJS upload / portal upload
You can visit the localhost:3000 and upload using the ejs template.
The resultant file url will be displayed there

## Raw upload
You can use the `/upload/raw` to post using from postman for testing.

**Note : It uses form-data and only a single file can be uploaded once **


