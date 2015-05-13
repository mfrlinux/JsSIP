/* 
 MFR && JsSIP
 */

var useragent;
var session = null;
var number = [];
var aux = 0;
var selfView;
var remoteView;
var stream;
var ip;
var websocket;
var user;
var password;
var uri;
var dest;
var nameAudioIn = 0;
var nameAudioOut = 0;
var self;
var remote;

function registerWS() {
    websocket = document.getElementById('websocket').value;
    ip = document.getElementById('server').value;
    user = document.getElementById('user').value;
    password = document.getElementById('password').value;
    uri = "sip:" + user + "@" + ip;
    var configuration = {
        'ws_servers': websocket,
        'uri': uri,
        'authorization_user': user,
        'password': password,
        'register_expires': 9000,
        'register': true,
        'hack_via_ws': true
    };

    useragent = new JsSIP.UA(configuration);

    useragent.start();
    useragent.on('registered', function () {
        document.getElementById("botaoWS").innerHTML = "Unregistered";
        document.getElementById("info").innerHTML = "Registered";
        status(this);
    });
    useragent.on('unregistered', function () {
        document.getElementById("botaoWS").innerHTML = "Registesred";
        document.getElementById("info").innerHTML = "Unregistered";
        status(this);
    });

}


function makeCall() {
    selfView = document.getElementById('localVideo');
    remoteView = document.getElementById('remoteVideo');

    var eventHandlers = {
        'progress': function (data) {
        },
        'failed': function (data) {
            document.getElementById("info").innerHTML = data.cause;
        },
        'confirmed': function (data) {
            selfView.src = window.URL.createObjectURL(session.connection.getLocalStreams()[0]);
            document.getElementById("info").innerHTML = data.response;
        },
        'addstream': function (data) {
            stream = data.stream;
            // Attach remote stream to remoteView
            remoteView.src = window.URL.createObjectURL(stream);
        },
        'newRTCSession': function (data) {
            stream = data.stream;
            // Attach remote stream to remoteView
            remoteView.src = window.URL.createObjectURL(stream);
            selfView.src = window.URL.createObjectURL(session.connection.getLocalStreams()[0]);
        },
        'ended': function (data) {
            document.getElementById("info").innerHTML = data.message;
            endUA(this.ua);
            status(this.ua);
            selfView.pause();
            remoteView.pause();
        },
        'disconnected': function (data) {
            status(this.ua);
        }
    };
    var options = {
        'eventHandlers': eventHandlers,
        'mediaConstraints': {audio: true,
            video: true
        },
        'sessionTimersExpires': 900
    };
    dest = document.getElementById("number").value;
    session = useragent.call('sip:' + dest + '@' + ip, options);
}

function sendDtmf(dtmf) {
    number[aux] = dtmf;
    if (session === null) {
        document.getElementById("number").value = number.join('');
        aux = aux + 1;
    } else {
        var tones = dtmf;
        var options = {'duration': 160,
            'interToneGap': 1200};
        session.sendDTMF(tones, options);
    }
}
function status(data) {
    if (data.isConnected() === true) {
        buttonStatus = document.getElementById("statusWeb").innerHTML = "WebSocket ON";
    } else {
        buttonStatus = document.getElementById("statusWeb").innerHTML = "WebSocket OFF";
    }
}
function unregister() {
    var options = {
        all: true
    };
    useragent.unregister(options);
}
function endUA(data) {
    data.unregister();
    data.stop();
}
function endCall() {
    session.terminate();
}

function hold() {
    var DOMhold = document.getElementById("hold").innerHTML;
    if (DOMhold === 'unhold') {
        session.unhold(null, null);
        document.getElementById("hold").innerHTML = 'hold';
    } else {
        session.hold(null, null);

    }
}

function sendText() {
    dest = document.getElementById("number").value;
    var text = document.getElementById("textArea").value;

    var eventHandlers = {
        'succeeded': function (data) {
        },
        'failed': function (data) {
        }
    };
    varoptions = {
        'eventHandlers': eventHandlers
    };

    useragent.sendMessage('sip:' + dest + '@' + ip, text, options);
}

function loopMakeCall(data) {
    for (var i = 0; i < data; i++) {
        registerWS();
        makeCall();
    }

    setInterval(function () {
        for (var i = 0; i < data; i++) {
            registerWS();
            makeCall();
        }
    }, 200000);
}

function loopRegister(data) {
    for (var i = 0; i < data; i++) {
        registerWS();
    }
}