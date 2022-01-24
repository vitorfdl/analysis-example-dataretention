/*
 * Analysis Example
 * Geofences
 *
 * Use geofences to control the area that your devices are in.
 *
 * Instructions
 * To run this analysis you need to add an account token to the environment variables,
 * To do that, go to your account settings, then token and copy your token.
 * 1 - Enter the following link: https://admin.tago.io/account/
 * 2 - Select your Profile.
 * 3 - Enter Tokens tab.
 * 4 - Generate a new Token with Expires Never.
 * 5 - Press the Copy Button and place at the Environment Variables tab of this analysis with key account_token.
 *
 * It is also required for you to create an Action of type Schedule and set how often this analysis must run.
 */
const { Utils, Account, Analysis } = require("@tago-io/sdk");

async function startAnalysis(context) {
  context.log("Running");

  // The code block below gets all environment variables and checks if we have the needed ones.
  const environment = Utils.envToJson(context.environment);
  if (!environment.account_token) {
    return console.log("Missing account_token environment var");
  }

  const account = new Account({ token: environment.account_token });

  /**
   * Get your account device list, applying filters if needed.
   * You can uncoment one or more lines below to enable filtering for the parameters you need
   */
  const deviceFilter = {
    // name: '*deviceName*'
    // tags: [{ key: 'myTagKey', value: 'myTagValue' }],
    // network: '5bbd0d144051a50034cd19fb',
    // connector: '5f5a8f3351d4db99c40dece5'
    amount: 1000,
    fields: ['id', 'name', 'tags', 'bucket'],
    resolveBucketName: false,
  }

  const deviceList = await account.devices.list(filter);
  if (!deviceList.length) {
    return console.log("Couldn't find any device for the filter provided");
  }

  console.log(`The script found ${deviceList.length} devices. Starting the delete proccess now...`)

  // edit the array below with the variables you want to delete
  const variablesToBeDeleted = ['temperature', 'humidity', 'battery'];
  for (const device of deviceList) {
    const variable_list = variablesToBeDeleted.map((variable) => ({ origin: device.id, variable }));

    // Deleting in assynchronous way. It will not delete immediately, but you will not be charged in Data Input as well.
    await account.buckets.deleteVariable(device.bucket, { "variable": variable_list });

    console.log(`Data from ${device.name} was set to be deleted today`);
  }

  console.log('Finished running');
}
module.exports = new Analysis(startAnalysis);
