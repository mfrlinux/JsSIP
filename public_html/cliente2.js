/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var userAgent;
    

function registerWS() {
    
    userAgent = new SIP.UA({        
        wsServers: ["ws://10.5.0.17:8088/ws"],
        uri: "1000@10.5.0.17:5080",
        registrarServer: "10.5.0.17:5080",
        authorizationUser: "1000",
        password: "1000",        
        wsServerMaxReconnection: 3,
        traceSip: true,
        hackIpInContact: true
    });
    
    var options = {
  'extraHeaders': [ 'X-Foo: foo', 'X-Bar: bar' ]
    };
    
    if (userAgent.isRegistered()) {
        document.getElementById("botaoWS").innerHTML = "Unregistered";
        userAgent.unregister();        
    } else {
        document.getElementById("botaoWS").innerHTML = "Registered";
        userAgent.start();
        userAgent.register(options);
    }    
    userAgent.on('registered', function () {    
            document.getElementById("info").innerHTML = "CLIENT Registered WS";
            status();        
    });
}

function registerWSS() {
}

//function makeCall() {
//    var session, mediaStream;
//    var target = 'sip:100@10.5.0.17';
//    //mediaConstraints Setting audio and video; 
//    //getUserMediaSuccess Getting Reference Call Stream
//    //getUserMediaFailure Fail stream
//    // Use   SIP.WebRTC.getUserMedia(mediaConstraints, getUserMediaSuccess, getUserMediaFailure); for method
//    var mediaConstraints = {
//        audio: true,
//        video: true
//    };
//    function getUserMediaSuccess(stream) {
//        console.log('getUserMedia succeeded', stream);
//        mediaStream = stream;
//        document.getElementById("change").innerHTML = "CALLING";
//        
//        // Makes a call
//        useSession(userAgent.invite(target, {
//            media: {
//                stream: mediaStream,
//                render: {
//                    remote: {
//                        video: document.getElementById('remoteVideo')
//                    },
//                    local: {
//                        video: document.getElementById('localVideo')
//                    }
//                }
//
//            }
//        }));
//        // Picks up incoming calls
//        userAgent.on('invite', function (s) {
//            useSession(s);
//            s.accept({
//                media: mediaStream
//            });
//        });
//    }
//
//    function getUserMediaFailure(e) {
//        console.error('getUserMedia failed:', e);
//        document.getElementById("change").innerHTML = "MEDIA FAILED";
//    }
//    
//    var startCall = document.getElementById('startCall');
//    startCall.addEventListener('click', function () {
//        if (mediaStream) {
//            getUserMediaSuccess(mediaStream);
//        } else {
//            if (SIP.WebRTC.isSupported()) {              
//                SIP.WebRTC.getUserMedia(mediaConstraints, getUserMediaSuccess, getUserMediaFailure);
//            }
//        }
//    }, false);
//
//    function useSession(s) {
//        session = s;
//        session.on('bye', function () {
//            session = null;
//        });
//    }
//    
//
//    var endButton = document.getElementById('endCall');
//    endButton.addEventListener("click", endCall(session), false);  
//    status();
//}
function makeCall() {
    var session, mediaStream;

    var endButton = document.getElementById('endCall');
    endButton.addEventListener("click", function () {
        session.bye();
        alert("Call Ended");
    }, false);

//here you determine whether the call has video and audio
    var target = '1000@10.5.0.17:5080';
    var options = {
        media: {
            constraints: {
                audio: true,
                video: true
            },
            stream: mediaStream,
            render: {
                remote: {
                    video: document.getElementById('remoteVideo')
                },
                local: {
                    video: document.getElementById('localVideo')
                }
            }

        }

    };
//makes the call
    session = userAgent.invite(target, options);
    status();
    userAgent.on('invite', function (session) {
        session.accept({
            media: {
                render: {
                    remote: {
                        video: document.getElementById('remoteVideo')
                    },
                    local: {
                        video: document.getElementById('localVideo')
                    }
                }
            }
        });
    });
}



function endCall(session) {
    if (session && session.startTime && !session.endTime) {
        session.bye();
    }
}

function sendDtmf(dtmf) {
}

function status() {
    if (userAgent.isConnected() == true) {
            buttonStatus=document.getElementById("statusWeb").innerHTML = "WebSocket ON";
    } else {
            buttonStatus=document.getElementById("statusWeb").innerHTML = "WebSocket OFF";
    }
}

