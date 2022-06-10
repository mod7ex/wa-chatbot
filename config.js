let validator = require('./validation')
let A = require('./tree')

let chats = {}

let initChat = (token) => {
	chats[token] = Object.assign([], {
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
	}) // [{2 ==> undefined}, {first_name ==> 'Mourad'}]
}

let chatExists = (token) => {
    return Reflect.has(chats, token)
}

let getChat = (token) => {
	if(!chatExists(token)) {
		initChat(token)
	}

	return Reflect.get(chats, token)
}

let currentLevel = (token) => {
	let level = A;

	let inputMap = getChat(token)

	inputMap.keys().forEach((key) => {
		level = level[key];
	});

	return level;
};

let ask = (someMsg, token) => {
	let inputMap = getChat(token)

	let msg = someMsg ? `${someMsg}\n\n` : ''
	let level = currentLevel(token);
	if (typeof level === "object" && level.ask) msg+= level.ask;
	else msg+= "Thanks."; // end of tree

	msg = msg.trim()
	inputMap.keys().forEach((key, i)=>{
		msg = msg.replace(`$${key}`, inputMap[i][key])
	})

	return msg
};

let handelMsg = (msg, token) => {
	if(!chatExists(token)) {
		return ask(undefined, token);
	}

	let inputMap = getChat(token)

	let level = currentLevel(token);

	let keys = Object.keys(level).filter((v) => v != "ask"); // keys except the 'ask' key

	if(keys.includes('end')) {
		try {
			started = false;
			return ask(undefined, token);
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
			return ask('Sorry!, can you please input a valide (choice)', token) // see if you want to ask again or not
		} else {
			// user input is a valide option
			inputMap.set(n, undefined)
			return ask(undefined, token);
		}

	} else {
		// case 1 options ==> role[0] (keys has only one element)
		// we can in real senarios run some validation 
		// to check if msg is of type keys[0]

		let key = keys[0]
		if(Object.keys(validator).includes(key)) {
			if(!validator[key](msg)){
				return ask('Sorry!, can you please input a valide data', token)
			}
		}

		inputMap.set(key, msg)
		return ask(undefined, token);
	}
};


module.exports = handelMsg;