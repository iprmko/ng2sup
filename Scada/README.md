Scada
=====

This is a simple node js application that can be used for test the supervisor demo app or as starting point for a real application.

The express js server host a rest-full service with the list of page and variable definitions used by the supervisor. The websocket emit random data for simulate variable changes.

Table of Contents
-----------------
 * [Getting Started](#getting-started)
 * [Usage](#Usage)
 * [Debug](#Debug)

Getting Started
---------------
0. Install node-js
1. Clone this repository: `git clone https://github.com/iprmko/ng2sup/scada/scada.git`.
2. Change dir to the project root folder `cd Scada`
3. Run `npm install` from the project root.
4. Run `PORT=9000 npm start` in a terminal from the project root.

**Note:** Is your build slow? Update `npm` to 3.x: `npm install -g npm`.

Usage
-----
* Supervisor contents can be changed by editing the content of `pages.json` and `variables.json` file in the data folder, then refresh the supervisor page if needed.
* Ambient variables can be used for options tuning:

| Ambient Variable | description  |
| ------------- |:-------------:| -----:|
| PORT | server port |
| DEBUG | debug filter (See: Node debug) |
| TICK_TIME | variable change rate |

Debug
-----
Run the application with:
```javascript
  PORT=9001 TICK_TIME=300 DEBUG=scada:* npm test
```
then open the `chrome-devtools://` link shown in console with your chrome browser.
