// based on https://learn.microsoft.com/en-us/graph/tutorials/javascript?tabs=aad

const readline = require('readline-sync');
const settings = require('./appSettings');
const graphHelper = require('./graphHelper');

async function main() {
  console.log('JavaScript Graph CLI');

  let choice = 0;

  // Initialize Graph
  initializeGraph(settings);

  // Greet the user by name
  await greetUserAsync();

  const choices = [
    'Display access token',
    'List my OneDrive'
  ];

  while (choice != -1) {
    choice = readline.keyInSelect(choices, 'Select an option', { cancel: 'Exit' });

    switch (choice) {
      case -1:
        // Exit
        console.log('Goodbye...');
        break;
      case 0:
        // Display access token
        await displayAccessTokenAsync();
        break;
        case 1:
            // List OneDrive Files
            await listOneDriveAsync();
            break;
      default:
        console.log('Invalid choice! Please try again.');
    }
  }
}

main();

function initializeGraph(settings) {
    graphHelper.initializeGraphForUserAuth(settings, (info) => {
      // Display the device code message to
      // the user. This tells them
      // where to go to sign in and provides the
      // code to use.
      console.log(info.message);
    });
  }
  
  async function greetUserAsync() {
    try {
      const user = await graphHelper.getUserAsync();
      console.log(`Hello, ${user?.displayName}!`);
      // For Work/school accounts, email is in mail property
      // Personal accounts, email is in userPrincipalName
      console.log(`Email: ${user?.mail ?? user?.userPrincipalName ?? ''}`);
    } catch (err) {
      console.log(`Error getting user: ${err}`);
    }
  }
  
  async function displayAccessTokenAsync() {
    try {
      const userToken = await graphHelper.getUserTokenAsync();
      console.log(`User token: ${userToken}`);
    } catch (err) {
      console.log(`Error getting user access token: ${err}`);
    }
  }
  
  async function listOneDriveAsync() {
    try {
      const oneDriveFiles = await graphHelper.getOneDriveAsync();
      const files = oneDriveFiles.value;
  
      // Output each message's details
      for (const file of files) {
        console.log(`File: ${file.webUrl}`);
      }
  
      // If @odata.nextLink is not undefined, there are more messages
      // available on the server
      const moreAvailable = oneDriveFiles['@odata.nextLink'] != undefined;
      console.log(`\nMore files available? ${moreAvailable}`);
    } catch (err) {
      console.log(`Error getting user's OneDrive files: ${err}`);
    }
  }

  async function listInboxAsync() {
    try {
      const messagePage = await graphHelper.getInboxAsync();
      const messages = messagePage.value;
  
      // Output each message's details
      for (const message of messages) {
        console.log(`Message: ${message.subject ?? 'NO SUBJECT'}`);
        console.log(`  From: ${message.from?.emailAddress?.name ?? 'UNKNOWN'}`);
        console.log(`  Status: ${message.isRead ? 'Read' : 'Unread'}`);
        console.log(`  Received: ${message.receivedDateTime}`);
      }
  
      // If @odata.nextLink is not undefined, there are more messages
      // available on the server
      const moreAvailable = messagePage['@odata.nextLink'] != undefined;
      console.log(`\nMore messages available? ${moreAvailable}`);
    } catch (err) {
      console.log(`Error getting user's inbox: ${err}`);
    }
  }
