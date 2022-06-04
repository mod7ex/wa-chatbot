let validator = require('./validation')

let E = {
	ask: `What is your current Status\n\nEnter 1 if you are Non-UAE Resident\nEnter 2 if you are UAE Citizen\nEnter 3 if UAE Resident`,

	1: {end: undefined},

	2: {end: undefined},

	3: {end: undefined},
};

let D = {
	ask: `Is it a Joint or Single Application?\n\nEnter 1 if Single Application\nEnter 2 if Joint Application`,

	1: E,

	2: E,
};

let C = {
	ask: `Can you provide proof of income?\n\nEnter 1 if Yes\nEnter 2 if No`,

	1: D,

	2: D,
};

let B = {
	ask: `What is your employment situation?\n\nEnter 1 if you are employed\nEnter 2 if you are self-employed`,

	1: D,

	2: {
		ask: `How old is the business you are operating under?.\n\nEnter 1 if is over 2 years\nEnter 2 it is Under 2 years`,

		1: D,

		2: C,
	},
};

let A = {
	ask: `Hello! You want to buy the property of your dream?\nWondering how! Calm down! Lenddoo is here to help you!\nOur mission is to suggest for you the best UAE’s Mortgage!\nCool , but can I get a mortgage ? Even, I don’t know much can\n afford? don’t worry! Lenddoo will Find the solution for you!\n\nEnter 1 if you want to know more about Lennddo\nEnter 2 if you want to start your journey with Lenddoo`,

	1: {
		ask: "some data...",

		end: undefined
	},

	2: {
		ask: `You want to know the appropriate mortgage for you? You are in\nthe right place! Lenddoo is here to help you! I Let’s start by giving\nus truthful information about yourself.\n\nFirstly, what’s you first name ?`,

		first_name: {
			ask: "Welcome $first_name! give us your Last Name",

			last_name: {
				ask: "Enter your Email",

				email: {
					ask: "What year you were born?",

					dob: {
						ask: "What's your country of origin?",

						country: B,
					},
				},
			},
		},
	},
};

// ********************************************************************************************

/*
 * role[0] in this example we suppose that all <options> are only number and can't be words ....
 * role[1] 'end' can't have siblings except for the key 'ask' (optional)
*/

let inputMap = Object.assign([], {
	set: function(key, value){
		let obj = {}
		obj[key] = value
		this.push(obj)
	},

	keys: function(){
		return this.map((obj) => Object.keys(obj)[0])
	},

	clear: function(){
		this.length = 0
	}
}) // [2 ==> undefined, first_name ==> 'Mourad']

let started = false;

let currentLevel = () => {
	let level = A;

	[...inputMap.keys()].forEach((key) => {
		level = level[key];
	});

	return level;
};

let ask = (someMsg) => {
	let msg = someMsg ? `${someMsg}\n\n` : ''
	let level = currentLevel();
	if (typeof level === "object" && level.ask) msg+= level.ask;
	else msg+= "Thanks."; // end of tree
	msg = msg.trim()
	inputMap.keys().forEach((key, i)=>[
		msg = msg.replace(`$${key}`, inputMap[i][key])
	])

	return msg
};

let handelMsg = (msg) => {
	if(!started) {
		started = true;
		return ask();
	}

	let level = currentLevel();

	let keys = Object.keys(level).filter((v) => v != "ask"); // keys except the 'ask' key

	if(keys.includes('end')) {
		try {
			started = false;
			return ask();
		} finally {
			inputMap.clear()
		}
	}

	msg = msg.trim()

	if(keys.length>1){
		// case 1 options ==> role[0]

		let n = Number(msg)

		if (Number.isNaN(n) || !keys.includes(`${n}`)) {
			// user input isn't a number or a number that doesn't exists in the options
			return ask('Sorry!, can you please input a valide (choice)') // see if you want to ask again or not
		} else {
			// user input is a valide option
			inputMap.set(n, undefined)
			return ask()
		}

	} else {
		// case 1 options ==> role[0] (keys has only one element)
		// we can in real senarios run some validation 
		// to check if msg is of type keys[0]

		let key = keys[0]

		if(Object.keys(validator).includes(key)) {
			if(!validator[key](msg)){
				return ask('Sorry!, can you please input a valide data')
			}
		}

		inputMap.set(key, msg)
		return ask()
	}
};


module.exports = handelMsg;