var redisClient = require('../modules/redisClient');
const TIMEOUT_IN_SECONDS = 3600;

module.exports = function(io) {
	// collaboration sessions
	var collaborations = {};

	// map from socketId to sessionId
	var socketIdToSessionId = {};

	var sessionPath = '/temp_sessions/';

	// waiting for connection from client
	io.on('connection', (socket) => {

		// get the session id, which is the problem id
		// socket id= 'ABCD', sessionId = 1
		let sessionId = socket.handshake.query['sessionId'];

		// given a socket id, I know which problem it's working on
		socketIdToSessionId[socket.id] = sessionId;

		// add current socket id to collaboration sesssion participants
		// if (!(sessionId in collaborations)) {
		// 	collaborations[sessionId] = {
		// 		'participants': []
		// 	};
		// }

		if (sessionId in collaborations) {
			collaborations[sessionId]['participants'].push(socket.id);
		} else {
			redisClient.get(sessionPath + sessionId, (data) => {
				if (data) {
					console.log('session terminated previously, pulling back from redis');
					collaborations[sessionId] = {
						'participants': [],
						'cachedInstructions': JSON.parse(data)
					};

				} else {
					console.log('creating new session');
					collaborations[sessionId] = {
						'participants': [],
						'cachedInstructions': []
					};
				}

				// given a problem id, I know all participants
				collaborations[sessionId]['participants'].push(socket.id);

				// get all participants of the current session
				console.log(collaborations[sessionId]['participants']);
			});

			// get here immediately after line 33
		}


		// when receive change event from client
		socket.on('change', delta => {
			// change 1: blah blah
			console.log('change ' + socketIdToSessionId[socket.id] + ': ' + delta);
			// 1=>ABCD, CDEF
			let sessionId = socketIdToSessionId[socket.id];
			// forward to all participants, except the originating one
			if (sessionId in collaborations) {
				collaborations[sessionId]['cachedInstructions'].push(
					["change", delta, Date.now()]);

				let participants = collaborations[sessionId]['participants'];
				for (let i = 0; i < participants.length; i++) {
					if (socket.id != participants[i]) {
						io.to(participants[i]).emit('change', delta);
					}
				}
			} else {
				console.log('warning: could not find socket id in collaborations');
			}
		});

		// when receive restoreBuffer event from client
		socket.on('restoreBuffer', () => {
			let sessionId = socketIdToSessionId[socket.id];
			console.log('restore buffer for session: ' + sessionId + ', socket: ' +
				socket.id);

			if (sessionId in collaborations) {
				let instructions = collaborations[sessionId]['cachedInstructions'];

				for (let i = 0; i < instructions.length; i++) {
					socket.emit(instructions[i][0], instructions[i][1]);
				}
			} else {
				console.log('no collaboration found for this socket');
			}
		});

		// when the client disconnect from the server
		socket.on('disconnect', () => {
			let sessionId = socketIdToSessionId[socket.id];
			console.log('disconnect session: ' + sessionId + ', socket: ' +
				socket.id);

			console.log(collaborations[sessionId]['participants']);

			let foundAndRemoved = false;

			if (sessionId in collaborations) {
				let participants = collaborations[sessionId]['participants'];
				let index = participants.indexOf(socket.id);

				if (index >= 0) {
					participants.splice(index, 1);
					foundAndRemoved = true;

					// if participants.length is 0, this is the last one
					// leaving the session
					if (participants.length === 0) {
						console.log('last participant is leaving, commit to redis');

						let key = sessionPath + sessionId;
						let value = JSON.stringify(
							collaborations[sessionId]['cachedInstructions']);

						redisClient.set(key, value, redisClient.redisPrint);

						redisClient.expire(key, TIMEOUT_IN_SECONDS);
						delete collaborations[sessionId];
					}
				}
			}

			if (!foundAndRemoved) {
				console.log('warning: could not find socket id in collaborations');
			}
		});

	})
}