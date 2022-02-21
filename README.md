# VALET - Voting app for an immersive theatre experience

This app was costum-built for the theatre play "VALET" performed by Revet Scenkonst in Gothenburg, Sweden.
See www.revetscenkonst.se for more info (website also built by me).

The play is based on a tree-like storyline where the audience (through this app) votes to keep characters in the show.
The character with the least votes gets revmoved until only one remains.

The app uses a mix of TailwindCSS and ChakraUI for styling.

There is no routing in the app. Instead authentication through Firebase determines if AdminPanel or UserPanel should be rendered.

Will probably transisition entire project to Typescript in the future.

## Available Scripts

In the project directory, you can run:

### `npm run local`

Runs the app with Firebase emulator suit (firestore, Cloud Functions, Authentication, hosting).\
Open [http://localhost:4000](http://localhost:4000) to view the emulator dashboard in your browser.

## Learn More

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)
