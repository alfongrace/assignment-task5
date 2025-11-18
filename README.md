# Volunteam App

## Project Scope and Goal

The purpose of the app is to allow volunteers to browse upcoming community events, view important event details and participate by engaging with event information, including uploading images. It acts as a simple volunteer-event hub that helps users stay connected with opportunities to contribute to local causes.

Our goal is to provide a simple and accessible platform where volunteers can quickly find events, learn more about each opportunity and engage with organizers by viewing or uploading event content. The project also aims to strengthen essential mobile development skills by integrating navigation, API communication, authentication and image handling within a practical, real-world style application.

## Features

- View a list of volunteer events
- Open detailed information for each event
- Upload images using the ImgBB API
- Use a local JSON server as a fake API
- Organized project using screens, components and service modules

## Prerequisites

Before starting, make sure you have:

- Node.js version 14 or later
- Yarn or npm
- Expo CLI installed
- Expo Go app installed on a mobile device
- A local network connection so your device can reach your computer

## Setting up the fake API (json-server)

Update the file src/services/api.ts.

Before running your json-server, find your computer’s IP address and update the baseURL to:

`http://your_ip_address_here:3333`

Then run:

`npx json-server --watch db.json --port 3333 --host your_ip_address_here -m ./node_modules/json-server-auth`

To find your IP address in PowerShell:

`ipconfig`

To use an online API without running json-server locally, update your baseURL to:

https://my-json-server.typicode.com/<your-github-username>/<your-github-repo>

To use my-json-server, make sure your db.json file is at the root of your repository.

## Setting up the image upload API

Update the file src/services/imageApi.ts.

You may use any hosting provider, but this project uses the ImgBB API:
https://api.imgbb.com/

Create a free account at:
https://imgbb.com/signup

Generate your API key and place it inside a .env file at the root of your project:

```
IMGBB_API_KEY="your_key_here"
```

To run the app locally, start Expo with your key:

```
IMGBB_API_KEY="insert_your_api_key_here" npx expo start
```

When creating a build or publishing with EAS, import your API key using:

`eas secret:push`

## Running the app

Install dependencies:

`yarn install`

or

`npm install`

Start Expo:

`expo start`

Open Expo Go on your device and scan the QR code.

Your device and computer must be on the same Wi-Fi network for the fake API to work.

## Project structure

```
src/
components/
screens/
services/
assets/
App.tsx
db.json
```
