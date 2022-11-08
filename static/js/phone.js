var fphone = {
    is_connected: false,
    is_supported: false,
    support_error: '',
    is_permitted: false,
    PeerConnection: null,
    SessionDescription: null,
    ws: null,
    ice: {"iceServers": []},
    isFirefox: navigator.userAgent.indexOf("Firefox") != -1,
    pc: null,
    state: 'init', //init
    localStream: null,
    offerConstraints: {
        "optional": [
            {"OfferToReceiveAudio": true},
            {"OfferToReceiveVideo": false},
            {DtlsSrtpKeyAgreement: true},
        ]
    },
    stop_ice: 0,
    moz_offer: null,
    send: function (msg) {
        this.ws.send(msg);
    },
    start_webrtc: function () {
        this.state = 'alert';
        this.pc = new this.PeerConnection(this.ice);
        this.stop_ice = 0;
        this.busy = 1;
        this.pc.onicecandidate = function (evt) {
            if (evt.candidate && fphone.stop_ice == 0) {
                if (fphone.isFirefox) {
                    fphone.send(JSON.stringify(fphone.moz_offer));
                }
                else {
                    fphone.pc.createOffer(function (offer) {
                        fphone.pc.setLocalDescription(offer);
                        fphone.send(JSON.stringify(offer));
                    }, fphone.logError);
                }
                fphone.stop_ice = 1;
            }
        };
        this.pc.onaddstream = function (evt) {
            console.log("addin remote audio");
            var remote_audio = document.getElementById('audio_remote');
            remote_audio.srcObject = evt.stream;
        };
        navigator.getUserMedia_({"audio": true, "video": false}, fphone.gotStream, fphone.logError);
    },
    gotStream: function (evt) {
        fphone.pc.addStream(evt);
        fphone.localStream = evt;
        fphone.pc.createOffer(function (offer) {
            fphone.pc.setLocalDescription(offer);
            fphone.moz_offer = offer;
        }, fphone.logError);
    },
    logError: function (error) {
        console.log(error.name + ": " + error.message);
    },
    stop_webrtc: function () {
        console.log('stop');
        this.send('{"webrtc":"close"}');
        this.busy = 0;
        if (this.localStream != null) {
            var track = this.localStream.getTracks()[0];
            track.stop();
        }
        if (this.pc != null) {
            this.pc.close();
            this.pc = null;
        }
        this.state = 'ready';
    },
    check_support: function () {
        if (typeof(WebSocket) != "function") {
            this.support_error = 'Websockets are not supported';
            return false;
        }
        navigator.getUserMedia_ = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
        if (typeof(navigator.getUserMedia_) != "function") {
            this.support_error = 'Webrtc are not supported';
            return false;
        }
        this.PeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
        if (typeof(this.PeerConnection) != "function") {
            this.support_error = 'PeerConnection support error';
            return false;
        }
        this.SessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;
        if (typeof(this.SessionDescription) != "function") {
            this.support_error = 'SessionDescription are not supported';
            return false;
        }
        this.is_supported = true;
        this.support_error = '';
        navigator.getUserMedia_({"audio": true}, function (stream) {
            var track = stream.getTracks()[0];
            track.stop();
            fphone.is_permitted = true;
            fphone.connect();
        }, function (stream) {
            fphone.is_permitted = false;
            fphone.support_error = 'Microphone permisson denied';
        });
    },
    destroy : function(){
        this.stop_call();
        this.ws.close();
    },
    connect: function () {
        console.log('connecting');
        this.ws = new WebSocket('wss://lvp1-kz.oki-toki.net:4014/');
        this.ws.onopen = function (evt) {
            fphone.send('{"connect":{"login":"webcall_test","password":"aksdalksdnsk","phone_number":"webcall_test", "ver":"7"}}');
            fphone.is_connected = true;
            fphone.state = 'ready';
        };
        this.ws.onclose = function (evt) {
            fphone.is_connected = false;
            fphone.state = 'init';
        };
        this.ws.onmessage = function (evt) {
            fphone.is_connected = true;
            fphone.got_message(evt.data);
        };
        this.ws.onerror = function (evt) {
            fphone.is_connected = false;
            fphone.state = 'init';
        };
    },
    got_message: function (m) {
        var o = jQuery.parseJSON(m);
        if (o.msg_type == 'ping') {
            this.send('{"pong":"pong"}');
        }
        if (o.msg_type == 'route') {
        }
        if (o.msg_type == 'callme') {
            this.start_webrtc();
            fphone.state = 'alert';
        }
        if (o.msg_type == 'byed') {
            fphone.busy = 0;
            this.stop_webrtc();
        }
        if (o.msg_type == 'sdp') {
            fphone.state = 'alert';
            this.pc.setRemoteDescription(new this.SessionDescription(o.msg_values));
        }
    },
    call: function (phone) {
        this.send('{"invite":"sip:call_script1@1", "phone_num":"' + phone + '"}');
    },
    send_dtmf: function(dtmf, session){
        this.send('{"dtmf":"'+session+'|'+dtmf+'"}');
    },
    stop_call: function () {
        this.send('{"info":"bye","msg_values":{"line":"1"}}');
        this.stop_webrtc();
    }
};

