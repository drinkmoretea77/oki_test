const offerOptions = {
    voiceActivityDetection: false
};
var okitoki_webcall = {
    url: 'wss://lvp1-de.oki-toki.net:4014/',
    ws: null,
    pc: null,
    ping_id: null,
    phone_state: "init",
    mic_state: "denied",
    webrtc_state: "down",
    add_webcall_interface: function(){
        $('body').append('<table id="okitoki_table"><tr>' +
            '<td><button id="okitoki_call_button" style="display:none;" onclick="okitoki_webcall.call()">Call</button></td>' +
            '<td><button id="okitoki_hang_button" style="display:none;" onclick="okitoki_webcall.hang()">Hang up</button></td>' +
            '</tr>' +
            '</table>' +
            '<audio id="audio_remote" autoplay="autoplay"></audio>' +
            '<audio id="audio_local" autoplay="autoplay"></audio>');
        return;
    },
    fire: function(event_type, event_data){
        const event = new CustomEvent(event_type, event_data);
        window.dispatchEvent(event);
    },
    call: function(){
        this.send({
            invite:"sip:989898@1",
            phone_num:"989898"});
    },
    hang: function(){
        this.stop_webrtc();
    },
    init_phone: function() {
        var that = this;
        this.ws.onopen = function() {
            that.fire('phone_state', {detail:"connected"});
            that.ping_id = setInterval(function () {
                okitoki_webcall.ping();
            }, 30000);
            that.send({
                connect: {
                    login: 'webcall_test12345',
                    password: 'hello',
                    phone_number: 'webcall_test12345',
                    ver: 8
                }
            });
        };
        this.ws.onclose = function(evt) {
            that.fire('phone_state', {detail:"closed"});
            that.stop_ping();
        };
        this.ws.onmessage = function(evt) {
            that.fire('okitoki_message', {detail: JSON.parse(evt.data)});
        };
        this.ws.onerror = function() {
            that.fire('phone_state', {detail:"error_closed"});
            that.stop_ping();
        };
    },
    init_listeners: function(){
        window.addEventListener('okitoki_message', function (e) {
            okitoki_webcall.proccess_message(e.detail)
        }, false);
        window.addEventListener('phone_state', function (e) {
            okitoki_webcall.proccess_websocket_state(e.detail)
        }, false);
        window.addEventListener('mic', function (e) {
            okitoki_webcall.proccess_mic_state(e.detail)
        }, false);
        window.addEventListener('webrtc', function (e) {
            okitoki_webcall.proccess_webrtc_state(e.detail)
        }, false);
        window.addEventListener('call', function (e) {
            okitoki_webcall.proccess_call_state(e.detail)
        }, false);
    },
    ping: function() {
        this.send({
            client_ping: 'client_ping'
        });
    },
    stop_ping: function() {
        clearInterval(this.ping_id);
    },
    start_webrtc: function () {
        var that = this;
        this.pc = new RTCPeerConnection();
        this.pc.onnegotiationneeded = function () {
            okitoki_webcall.pc.createOffer(offerOptions).then(function(offer) {
                return okitoki_webcall.pc.setLocalDescription(offer);
            }).then(function() {
                okitoki_webcall.send(okitoki_webcall.pc.localDescription);
            })
            .catch(function (e){
                that.fire('webrtc', {detail:"offer error"});
            });
        };
        this.pc.ontrack = function (evt) {
            document.getElementById("audio_remote").srcObject = evt.streams[0];
        };
        navigator.mediaDevices.getUserMedia({"audio": true})
            .then(function(localStream) {
                okitoki_webcall.localStream = localStream;
                localStream.getTracks().forEach(function (track) {
                    if (okitoki_webcall.pc) {
                        okitoki_webcall.pc.addTrack(track, localStream);
                    }
                });
            })
            .catch(function(err) {
                that.fire('webrtc', {detail:"media error"});
            });
    },
    stop_webrtc: function () {
        this.send({
            info: "bye",
            msg_values: {
                line: 1
            }
        });
        if (this.pc) {
            this.pc.onnegotiationneeded = null;
            this.pc.ontrack = null;
            this.pc.oniceconnectionstatechange= null;
            this.pc.onicegatheringstatechange = null;
            this.pc.onsignalingstatechange = null;
            this.send({
                webrtc: "close"
            });
            if (document.getElementById("audio_remote").srcObject) {
                document.getElementById("audio_remote").srcObject.getTracks().forEach(function (track) {
                    track.stop();
                });
            }
            if (this.localStream) {
                this.localStream.getTracks().forEach(function (track) {
                    track.stop();
                });
            }
            this.pc.close();
            this.pc = null;
        }
        this.fire('webrtc', {detail:"down"});
    },
    send: function(json) {
        if (this.ws && this.ws.readyState === 1) {   // OPEN
            this.ws.send(JSON.stringify(json));
            return true;
        } else {
            return false;
        }
    },
    proccess_message: function(message){
        console.log(message);
        switch (message.msg_type) {
            case 'ping':
                this.send({
                    pong: 'pong'
                });
                break;
            case 'client_pong':
                break;
            case 'callme':
                this.start_webrtc();
                break;
            case 'sdp':
                if (this.pc) {
                    this.pc.setRemoteDescription(new RTCSessionDescription(message.msg_values));
                }
                break;
            case 'dtls':
                this.fire('webrtc', {detail:"up"});
                break;
            case 'dtls_timeout':
                this.stop_webrtc();
                break;
            case 'call_session':
                this.fire('call', {detail:"session "+message.msg_values.session});
                break;
            case 'accepted':
                this.fire('call', {detail:"accepted"});
                break;
            case 'byed':
                this.stop_webrtc();
                break;
        }

    },
    proccess_websocket_state: function(state){
        this.log('Websocket: ' + state);
        this.phone_state = state;
        this.draw_buttons();
    },
    proccess_mic_state: function(state){
        this.log('Microphone access: ' + state);
        this.mic_state = state;
        this.draw_buttons();
    },
    proccess_call_state: function(state){
        this.log('Call state: ' + state);
        this.draw_buttons();
    },
    proccess_webrtc_state: function(state){
        this.log('Webrtc state: ' + state);
        this.webrtc_state = state;
        this.draw_buttons();
    },
    draw_buttons: function(){
        if (this.mic_state === 'granted' && this.phone_state === 'connected' && this.webrtc_state !== "up"){
            $("#okitoki_call_button").show();
        }
        else{
            $("#okitoki_call_button").hide();
        }
        if (this.webrtc_state === "up"){
            $("#okitoki_hang_button").show();
        }
        else{
            $("#okitoki_hang_button").hide();
        }

    },
    log: function(log){
        $("#okitoki_log").append(log + "\n");
    },
    check_mic: function () {
        var that = this;
        return navigator.mediaDevices.getUserMedia({"audio": true})
            .then(function(stream) {
                var track = stream.getTracks()[0];
                track.stop();
                that.fire('mic', {detail: 'granted'});
            })
            .catch(function(err) {
                that.fire('mic', {detail: 'denied'});
            });
    },
    init: function(){
        this.add_webcall_interface();
        this.init_listeners();
        this.ws = null;
        this.ws = new WebSocket(this.url);
        this.init_phone();
        this.check_mic();
    }
}
okitoki_webcall.init();
