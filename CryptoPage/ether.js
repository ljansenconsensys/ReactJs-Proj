


//AccountInfo class for displaying user data
//This is where the data is put into a table and sent to the HTML through reactJS!
class AccountInfo extends React.Component {
	render() {
		return (
			<table className="table">
				<tr>
					<td><b>Address:</b></td>
					<td>{currentUser.address}</td>
				</tr>
				<tr>
					<td><b>Balance:</b></td>
					<td>{currentUser.balanceEther}</td>
				</tr>
				<tr>
					<td><b>Network:</b></td>
					<td>{currentUser.network}</td>
				</tr>
				<tr>
					<td><b>Network ID:</b></td>
					<td>{currentUser.networkId}</td>
				</tr>
			</table>
		)
	}
}



//The current user variable, used to access and store all the data on the user who has visitted the website
var currentUser = {
	//address: 'string' Type | Representation of user address '0x...' as a string
	'address': null,
	//balance: 'BigNumber' Type | Current wallet balance of the user in Wei respresented as a BigNumber, note that this type must be converted to be useful
	'balance': null,
	//balanceEther: 'string' Type | A string representation of the users current balance in Ether
	'balanceEther': null,
	//networkId: 'string' Type | A string numeric value of the network ID the user is on
	'networkId': null,
	//nework: 'string' Type | A string value of the name of the network they are on
	'network': null,
	//This function converts a saved balance to ether; currently unused since balanceEther exists, consider deleting
	'getEther': function() {
		return web3js.fromWei(this.balance).toString();
	},
	//Updates the balance of both 'balance' which is in Wei, and 'balanceEther' which is in Ethereum
	//Note that balance is a 'BigNumber' type and must be converted to a string to be useful
	'updateBalance': function() {
		if ( this.address !== null ){
			var newBalance;
			web3js.eth.getBalance(this.address, function(err, res) {
				if (!err) {
					currentUser.balance = res;
					currentUser.balanceEther = web3js.fromWei(currentUser.balance).toString();
				}
			});
		}
	},
	//Checks the network the user is on and assigns a name representation for the network ID. Several net IDs can be handled, in the case of
	'updateNetwork': function() {
		var newId;
		newId = web3js.version.network;
		this.networkId = newId;
		switch (newId) {
			case "1":
				this.network = "Main";
				break;
			case "2":
				this.network = "Morden";
				break;
			case "3":
				this.network = "Ropsten";
				break;
			case "4":
				this.network = "Rinkeby";
				break;
			case "42":
				this.network = "Kovan";
				break;
			default:
				this.network = "Unknown";
		}
	},
	//cummulative function to update everything
	'update': function() {
		this.updateBalance();
		this.updateNetwork();
	},

};


//Starts the check timer for updating account info, update speed at 4Hz
function startWeb3() {
	var accountCheckup = setInterval(Web3App,250);
}


//The function to output userdata, is called at a rate of 4Hz
function Web3App() {
	if (web3js.eth.accounts[0] !== currentUser) {
		currentUser.address = web3js.eth.accounts[0];
	} 
	if (web3js.eth.accounts[0] == null) {
		tellNotLoggedIn();
		return;
	}

	currentUser.update();
	writeUserData();

}

//This function actually writes the data in a table format
function writeUserData() {
	ReactDOM.render(
	<AccountInfo />,
	document.getElementById("userdata")
);}


//If there is no valid address logged in, this prompts the user to log in
function tellNotLoggedIn() {
	ReactDOM.render(
	<div>
		There is currently no user logged in! Please log in with MetaMask to see your data.
	</div>,
	document.getElementById("userdata")
);
}


function donateEther() {
	console.log(document.getElementById('donation').value);
	web3js.eth.sendTransaction({from: currentUser.address, to: "0xbaed36562fd33db715468916f624973331cfeb56", value: web3js.toWei(document.getElementById('donation').value, "ether")},
		function(err, res) {

		})
}


//Setup the web3js variable, used in all the code above
var web3js;


//Listening function to check if MetaMask is active in the browser
//Only runs when the webpage finishes loading
window.addEventListener('load', function() {

	// Checking if Web3 has been injected by the browser (Mist/MetaMask)
	if (typeof web3 !== 'undefined') {
	  // Use Mist/MetaMask's provider
	  web3js = new Web3(web3.currentProvider);
	//window.alert("Yes MetaMask");
	} else {
	  // Handle the case where the user doesn't have Metamask installed
	  // Probably show them a message prompting them to install Metamask
	console.log("No MetaMask Detected");
	$("#noMetaMask").show();
	//End execution here, pointless to try and run the code if no metamask is installed.
	return;
	}

	//Entry function for gathering ethereum data
	startWeb3();
});
