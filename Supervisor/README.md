Supervisor
==========

This is purely an angular 2 test. It is still in development.

The demo show how to fill a ionic-2 page with a list of dynamic variables defined by the server. Variables update are pushed by the server through a web socket.

The [test scada application]() can be used to simulate traffic.

Table of Contents
-----------------
 * [Getting Started](#getting-started)
 * [Usage](#Usage)

Getting Started
---------------
0. Install node-js
1. Clone this repository: `git clone https://github.com/iprmko/ng2sup/supervisor/supervisor.git`.
2. Run `npm install` from the project root.
3. Install the ionic CLI (`npm install -g ionic`)
4. Run `ionic serve` in a terminal from the project root.

**Note:** Is your build slow? Update `npm` to 3.x: `npm install -g npm`.

Usage
-----
 * Run the scada simulator as show in the `README` in a local or remote machine.
 * Start the ionic application and update the simulator url in the settings page.
 * Create new variables and pages as show in the scada `README`
 * See the ionic page for mobile deploy.
