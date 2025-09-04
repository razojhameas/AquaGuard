PREREQUISITES (if hindi pa installed)

	Node.js: https://nodejs.org/
	Git: https://git-scm.com/
	VS Code: https://code.visualstudio.com/
	Expo CLI: npm install -g expo-cli

CLONING THE REPO 

	open VS code, ta's launch terminal, run: 

		git clone https://github.com/razojhameas/AquaGuard.git
		cd AquaGuard

INSTALLING DEPENDENCIES

	run in terminal: npm install

START 

	run in terminal: npx expo start
	open another terminal, run: node utils/server.js 

	sa expo go, para ma-open mo sa phone (android only, currently), make sure na ung version is for SDK 51 
		https://expo.dev/go?sdkVersion=51&platform=android&device=true

IF ERROR IN DEPENDENCIES

	run in terminal: 

		npm cache clean --force
		npm install

IP ADDRESS:

	open cmd, run: ipconfig
	replace lahat ng http requests with the ipv4 address (ALL FILES), 
	http://{ipv4 address}:3000

