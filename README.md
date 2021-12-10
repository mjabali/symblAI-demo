## What this app is about

This apps shows you how you can add transcription/closed captioning and conversation intelligence to your Vonage video application. We are going to leverage [SymblAI web SDK](https://www.npmjs.com/package/@symblai/symbl-web-sdk) to achieve this. Audio will be sent from the client side to Symbl.ai hence there are no changes required on the server side. SymblAI allows you to easily gain insight and enable captions into your voice and video applications with their suite of APIs and developer tools.

![One to one captions](https://raw.githubusercontent.com/nexmo-se/symblAI-demo/main/public/images/javi-paco.png)

![Call Summary](https://raw.githubusercontent.com/nexmo-se/symblAI-demo/main/public/images/javi-paco-summary.png)

## How to run the app

### Dev

1. Create a .env.development file as per the .env.example
2. In the project directory, you can run `npm install` to install dependencies
3. Run `npm run server-dev` to run the server in dev mode
4. Run `npm start` to run the client side

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Production

1. Create a .env.production file as per the .env.example
2. In the project directory, you can run `npm install` to install dependencies
3. Run `npm run build` to build the bundle file
4. Run `npm run server-prod` to run the server in dev mode. The server will s

## App structure

This application is a ReactJs app created with [Create React App](https://github.com/facebook/create-react-app) communicating with a nodeJS server that acts as an API to handle Video session creation and credentials generation for the Vonage session and for the connection with Symbl.ai.

### Client Side

The client side application is structured in serveral folders.

1. api contains the logic where we communicate with Symbl.ai APIs and with our server
2. context is the creation of the preferences context that will allows us to
3. hooks is the folder that encapsulates most of the logic of our application
   3.1 usePublisher handles the logic to initialise the Vonage publisher, publish into the Vonage session and set up the event listeners that let us know when we're publishing into the session to start the connection with Symbl.ai
   3.2 useSession handles the connection with the Vonage messaging servers once we receive the credentials from the server side and subcribe to the other user stream
   3.3 useSymblai is the hook where we interact with the Symblai SDK. For a more detailed explanation of the hook, please check this blog post.
4. All of the hooks are consumed in the `Main` component. Once the component mounts, we will ask our server for credentials for the Vonage video session and for the Symbl.ai connection. Once we have credentials, we will connect and publish to the session. Finally, when we are publishing into the session, we will establish a connection with Symbl.ai and consume the captions.

The application also leverages Insights, Sentiment analysis and summary APIs from Symbl.ai. Insights API are consumed in the `Insights` component and will be output in the UI. We also have a graph that will plot the sentiment analysis score. The graph ranges between -1 and 1, with -1 being very negative and 1 being very positive.

Once you hit the exit button, you will be redirected to a different view where you can see some statistics about the call. It includes an indivudual break-down for every speaker, containing silence and talking time, and also a summary of the call. The summary includes a few sentences summing up the call. The longer the meeting is, the more accurate the summary will be.

### Server Side

The server side is a basic nodeJS server needed to generate credentials. The index.js file contains the routes of the application. The logic related to the Video API is handled within the opentok.js file
