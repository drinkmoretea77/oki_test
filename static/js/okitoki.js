navigator.getUserMedia_ = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
var PeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
var SessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;
var offerConstraints = {
    "optional": [
        {"OfferToReceiveAudio": true},
        {"OfferToReceiveVideo": false},
        {DtlsSrtpKeyAgreement: true}
    ]
};

var okitoki = {
    data_url: 'wss://erl.oki-toki.net:8443/ws',
    data_connected: false,
    data_ping_id: null,
    phone_ping_id: null,
    data_ws: null,
    reconnects_count: 0,
    api_phone : "",
    is_api_call : false,
    settings: {},
    api_token: '',
    ringtone: "https://noname.oki-toki.net/sound/ringtone.wav",
    end_call_sound: "https://noname.oki-toki.net/sound/end4.wav",
    user_id: 0,
    objects: [],
    state: "init",
    next_node: "",
    skip_anketa_once: false,
    backup_nodes: ["46.4.36.194", "195.201.13.68", "144.76.104.216", "185.100.65.25", "193.19.229.145"],
    phone_url: 'wss://lvp2-de.oki-toki.net:4014/',
    phone_connected: false,
    isFirefox: navigator.userAgent.indexOf("Firefox") !== -1,
    phone_ws: null,
    pc: null,
    user_login: "",
    from_hold: 0,
    localStream: null,
    webrtc_state: 'DOWN', // UP or DOWN
    call_state: 'idle',
    current_session_id: 0,
    current_listen_id: 0,
    sip_release_code: 0,
    current_bp_session_id: 0,
    current_queue: 0,
    user_status: 0,
    discard_timeout: 15,
    users: [],
    queues: [],
    current_calls: {},
    confs: {},
    recent_calls: null,
    domain: "noname.oki-toki.net",
    ping_stat: {
        data: {
            last_ping: 0,
            sent: 0,
            received: 0,
            time: {
                min: 0,
                total: 0,
                current: 0,
                max: 0
            }
        },
        phone: {
            last_ping: 0,
            sent: 0,
            received: 0,
            time: {
                min: 0,
                total: 0,
                current: 0,
                max: 0
            }
        }
    },

    get_api_url: function (path) {
        if (this.api_token.length > 0) {
            return "https://" + this.domain + "/api/operator/" + path;
        }
        else {
            return "/operator/" + path;
        }
    },

    update_recent_call: function (x) {
        var that = this;

        if (parseInt(x.user_to) === this.user_id || parseInt(x.author) === this.user_id) {
            x.is_mine = 1;
            this.fire_event('set_current_queue', {queue_id: parseInt(x.queue)});
        }
        if (this.recent_calls === null) {
            return;
        }
        if (parseInt(this.current_listen_id) > 0 && parseInt(this.current_listen_id) === parseInt(x.session)
            && x.fstate === 'finish') {
            this.hangup();
        }
        if (this.recent_calls && !this.recent_calls[x.session] && x['is_mine']) {
            this.recent_calls[x.session] = {
                ani: "",
                answer: "",
                atime: 0,
                author: 0,
                bp_id: 0,
                call_type: "",
                conf_id: 0,
                connect_time: 0,
                contact_id: 0,
                contact_name: "",
                ctime: 0,
                dialer_id: 0,
                task_id: 0,
                disconnect_reason: 0,
                dnis: "",
                auth: "",
                etime: 0,
                fname: "",
                id: 0,
                orig_type: "",
                queue_id: 0,
                redirect_type: "",
                detailes: "",
                session_id: 0,
                sid: 0,
                stime: Math.floor(Date.now() / 1000),
                user_from: 0,
                user_id: 0,
                fstate: ""
            };

            var sessions = Object.keys(this.recent_calls);

            if (sessions.length > 10) {
                sessions.sort(function (a, b) {
                    if (that.recent_calls[a].stime > that.recent_calls[b].stime) {
                        return -1;
                    } else if (that.recent_calls[a].stime < that.recent_calls[b].stime) {
                        return 1;
                    } else {
                        return 0;
                    }
                });

                for (var i = 10; i < sessions.length; i++) {
                    delete this.recent_calls[sessions[i]];
                    var event_data = {};
                    event_data[sessions[i]] = {};
                    this.fire_event("recent_calls", event_data);
                }
            }
        }

        if (x['is_mine'] && x.fstate === 'start') {
            this.fire_event('call_session_id', {session_id: x.session, phone: x.phone});
        }

        if (this.recent_calls && this.recent_calls[x.session]) {
            if (x.fstate === 'start') {
                if (x.call_type === 'O' || x.call_type === 'P') {
                    this.recent_calls[x.session]['dnis'] = x.phone;
                }
                else {
                    this.recent_calls[x.session]['ani'] = x.phone;
                }
                this.recent_calls[x.session]['stime'] = Math.floor(Date.now() / 1000);
            }
            if (x.fstate === 'connect') {
                this.recent_calls[x.session]['connect_time'] = Math.floor(Date.now() / 1000);
                if ((this.recent_calls[x.session]['connect_time'] - this.recent_calls[x.session]['stime']) > 0) {
                    this.recent_calls[x.session]['atime'] = this.recent_calls[x.session]['connect_time'] - this.recent_calls[x.session]['stime'];
                }

            }
            if (x.fstate === 'stop' || (x.fstate === 'finish' && this.recent_calls[x.session]['fstate'] !== 'stop' )) {
                this.recent_calls[x.session]['etime'] = Math.floor(Date.now() / 1000);
                if (this.recent_calls[x.session]['atime'] > 0 || this.recent_calls[x.session]['connect_time'] > 0) {
                    if ((this.recent_calls[x.session]['etime'] - this.recent_calls[x.session]['connect_time']) > 0) {
                        this.recent_calls[x.session]['ctime'] = this.recent_calls[x.session]['etime'] - this.recent_calls[x.session]['connect_time'];
                    }
                } else {
                    if ((this.recent_calls[x.session]['etime'] - this.recent_calls[x.session]['stime']) > 0) {
                        this.recent_calls[x.session]['atime'] = this.recent_calls[x.session]['etime'] - this.recent_calls[x.session]['stime'];
                    }
                }
            }
            if (x.auth_name !== undefined) {
                this.recent_calls[x.session]['auth_name'] = x.auth_name;
            }
            this.recent_calls[x.session]['fname'] = x.fname;
            this.recent_calls[x.session]['auth'] = x.dnis;
            this.recent_calls[x.session]['fstate'] = x.fstate;
            this.recent_calls[x.session]['state'] = x.fstate;
            this.recent_calls[x.session]['queue_id'] = parseInt(x.queue);
            this.recent_calls[x.session]['session_id'] = parseInt(x.session);
            this.recent_calls[x.session]['sid'] = parseInt(x.sid);
            this.recent_calls[x.session]['author'] = parseInt(x.author);
            this.recent_calls[x.session]['user_from'] = parseInt(x.author);
            this.recent_calls[x.session]['user_id'] = parseInt(x.user_to);
            this.recent_calls[x.session]['contact_id'] = parseInt(x.contact);
            if (x.call_contact.search("\\|") > -1) {
                this.recent_calls[x.session]["contact_name"] = x.call_contact.split("|")[1];
            }
            this.recent_calls[x.session]['bp_id'] = x.hasOwnProperty('bp') ? parseInt(x.bp) : 0;
            this.recent_calls[x.session]['detailes'] = x.hasOwnProperty('d') ? x.d : "";
            this.recent_calls[x.session]['call_type'] = x.call_type;
            this.recent_calls[x.session]['conf_id'] = x.hasOwnProperty('conference') ? parseInt(x.conference) : 0;
            this.recent_calls[x.session]['dialer_id'] = x.hasOwnProperty('did') ? x.did : 0;
            this.recent_calls[x.session]['task_id'] = x.hasOwnProperty('task') ? x.task : 0;

            var tmp = {};
            tmp[x.session] = this.recent_calls[x.session];

            this.fire_event("recent_calls", tmp);
        }

        var conf;

        if (x.fname === 'conference' && x.fstate !== 'finish') {
            if (x.session === x.conference) {
                if (x.fstate === "start") {
                    this.confs[x.session] = [];
                    conf = {
                        session_id: x.session,
                        start_time: Math.floor(Date.now() / 1000),
                        user_id: parseInt(x.user_to) > 0 ? parseInt(x.user_to) : parseInt(x.author),
                        phone: x.phone
                    };
                    this.confs[x.session].push(conf);
                }
            }
            else {
                if (x.fstate === "start") {
                    if (this.confs.hasOwnProperty(x.conference)) {
                        conf = {
                            session_id: x.session,
                            start_time: Math.floor(Date.now() / 1000),
                            user_id: parseInt(x.user_to) > 0 ? parseInt(x.user_to) : parseInt(x.author),
                            phone: x.phone
                        };
                        this.confs[x.conference].push(conf);
                    }
                }
            }
        }

        if (x.fname === 'conference' && x.fstate === 'finish') {
            for (var ses in this.confs) {
                if (this.confs.hasOwnProperty(ses)) {
                    for (i = 0; i < this.confs[ses].length; i++) {
                        if (this.confs[ses][i] && this.confs[ses][i].session_id && this.confs[ses][i].session_id === x.session) {
                            this.confs[ses].splice(i, 1);
                        }
                    }
                }
            }
            if (this.confs.hasOwnProperty(x.session) && this.confs[x.session].length === 0) {
                delete this.confs[x.session];
            }
        }
    },

    data_init: function (user_id, hash) {
        var that = this;
        this.data_ws.onopen = function () {
            that.data_connected = true;
            var json = {
                string: user_id,
                hash: hash,
                type: 'user_online',
                user_to: 'all',
                user_from: user_id,
                objects : okitoki.objects
            };
            that.send_json(json);
            that.fire_event('data_websocket_connected', {});
            that.fire_event("call_notification", {close_all: true});
            that.data_ping_id = setInterval(function () {
                okitoki.data_ping();
            }, 30000);
        };

        this.data_ws.onclose = function (evt) {
            that.log_error(evt.code);
            that.data_connected = false;
            that.data_stop_ping();
            that.fire_event('data_websocket_closed', {code: evt.code});
            that.fire_event("call_notification", {close_all: true});
            if (evt.code === 1000) {
                okitoki.disconnect(1000);
            }
            if (evt.code !== 1000 && that.settings.reconnect.value === true) {
                setTimeout(function () {
                    okitoki.data_connect();
                }, 3000);
            }
        };

        this.data_ws.onmessage = function (evt) {
            that.data_onmessage(evt.data);
        };

        this.data_ws.onerror = function () {
            that.data_connected = false;
            that.data_stop_ping();
            that.fire_event('data_websocket_error', {});
            that.fire_event("call_notification", {close_all: true});
        };
    },

    phone_init: function () {
        var that = this;
        this.phone_ws.onopen = function () {
            that.current_session_id = 0;
            that.phone_login();
            that.phone_connected = true;
            that.reconnects_count = 0;
            that.state = "ready";
            that.fire_event('phone_websocket_connected', {});
            that.fire_event("call_notification", {close_all: true});
            that.phone_ping_id = setInterval(function () {
                okitoki.phone_ping();
            }, 30000);
        };
        this.phone_ws.onclose = function (evt) {
            that.current_session_id = 0;
            that.log_error("phone_websocket_closed, code:", evt.code);
            that.log_error(evt);
            that.phone_connected = false;
            if (!that.data_connected) {
                that.disconnect();
                that.fire_event('phone_websocket_closed', {code: evt.code});
                that.fire_event("call_notification", {close_all: true});
            }
            else{
                setTimeout(function(){
                    okitoki.reconnects_count = okitoki.reconnects_count + 1;
                    if (okitoki.reconnects_count > 5){
                        okitoki.set_next_node();
                    }
                    okitoki.fire_event('phone_reconnect', {});
                    okitoki.fire_event("call_notification", {close_all: true});
                    okitoki.phone_connect();
                }, 1000);
            }
            that.phone_stop_ping();

        };
        this.phone_ws.onmessage = function (evt) {
            that.phone_onmessage(evt.data);
        };
        this.phone_ws.onerror = function () {
            that.current_session_id = 0;
            that.phone_connected = false;
            that.phone_stop_ping();
            that.set_next_node();
            that.fire_event("call_notification", {close_all: true});
            that.fire_event('phone_websocket_error', {});
        };
    },

    set_next_node: function () {
        if (this.state === 'init' && this.backup_nodes.length > 0) {
            for (var i = 0; i < this.backup_nodes.length; i++) {
                if (this.next_node === this.backup_nodes[i]
                    && i < this.backup_nodes.length - 1
                ) {
                    this.next_node = this.backup_nodes[i + 1];
                }
            }
            if (this.next_node.length === 0) {
                this.next_node = this.backup_nodes[0];
            }
        }
    },

    phone_connect: function () {
        if (!this.phone_connected) {
            this.phone_url = this.get_url(this.settings.node.ip);
            this.phone_ws = null;
            this.phone_ws = new WebSocket(this.phone_url);
            this.phone_init();
        }
    },

    get_url: function (ip) {
        if (this.next_node.length > 0) {
            ip = this.next_node;
        }

        switch (ip) {
            case '193.19.229.145':
                return "wss://lvp1-ua.oki-toki.net:4014/";
            case '195.201.13.68':
                return "wss://lvp2-de.oki-toki.net:4014/";
            case '185.100.65.25':
                return "wss://lvp1-kz.oki-toki.net:4014/";
            case '144.76.104.216':
                return "wss://lvp3-de.oki-toki.net:4014/";
            default:
                return "wss://lvp1-de.oki-toki.net:4014/";
        }
    },

    phone_login: function () {
        this.phone_send({
            connect: {
                login: this.user_login,
                password: 'eindslsdfekfdmfsdf',
                phone_number: this.user_login,
                ver: 8
            }
        });
    },

    phone_onmessage: function (data) {
        var json = JSON.parse(data);
        //console.log(data);
        //console.log("phone message:", json);
        switch (json.msg_type) {
            case 'ping':
                this.phone_send({
                    pong: 'pong'
                });
                break;
            case 'client_pong':
                this.set_ping_result(this.ping_stat.phone);
                break;
            case 'dtls':
                this.webrtc_state = 'UP';
                this.fire_event('webrtc_up', {});
                break;
            case 'dtls_timeout':
                this.fire_event('dtls_error', {});
                this.phone_send({
                    webrtc: 'close'
                });
                this.shutdown_webrtc();
                break;
            case 'callme':
                this.start_webrtc();
                break;
            case 'alerting':
                this.call_state = 'alerting';
                this.fire_event('call_alerting', {});
                break;
            case 'sip_release_code':
                this.sip_release_code = json.msg_values.code;
                if (this.current_calls.hasOwnProperty(this.current_session_id)) {
                    this.current_calls[this.current_session_id]["sip_release_code"] = json.msg_values.code;
                }
                this.fire_event('sip_release_code', {code: json.msg_values.code});
                break;
            case 'call_session':
                this.current_session_id = json.msg_values.session;
                var phone_num = "";
                if (json.msg_values.phone_num !== undefined){
                    phone_num = json.msg_values.phone_num;
                }
                this.fire_event('call_session_id', {session_id: json.msg_values.session, phone : phone_num});
                break;
            case 'sdp':
                if (this.pc) {
                    this.pc.setRemoteDescription(new SessionDescription(json.msg_values));
                }
                break;
            case 'accept_ok':
                this.call_state = 'call';
                this.stop_ring();
                this.fire_event('call_connected', {});
                break;
            case 'accepted':
                this.stop_ring();
                this.call_state = 'call';
                this.fire_event('call_connected', {});
                break;
            case 'invited':
                this.call_state = 'ringing';
                this.fire_event('call_start', {state: 'ringing'});
                this.fire_event('call_ringing', {});
                this.start_ring();
                this.phone_send({
                    ringing:
                        {
                            id: json.msg_values.id,
                            line: 1
                        }
                });
                this.sip_release_code = 0;
                this.fire_event('sip_release_code', {code: 0});
                if (this.settings && this.settings.autoanswer.value === true) {
                    var delay = parseInt(this.settings.autoanswer_delay.value);
                    if (delay > 0) {
                        setTimeout(function () {
                            okitoki.answer();
                        }, delay * 1000);
                    }
                    else {
                        okitoki.answer();
                    }
                    return;
                }
                if (this.queues[this.current_queue] && this.queues[this.current_queue].autoanswer === 1) {
                    delay = parseInt(this.queues[this.current_queue].autoanswer_delay);
                    if (delay > 0) {
                        setTimeout(function () {
                            okitoki.answer();
                        }, delay * 1000);
                    } else {
                        okitoki.answer();
                    }
                    return;
                }
                if (json.msg_values.ani_num === 'pd' || this.from_hold === 1) {
                    this.answer();
                }
                break;
            case 'byed':
                this.current_session_id = 0;
                this.current_listen_id = 0;
                this.is_api_call = false;
                this.call_state = 'idle';
                this.fire_event('call_finish', {});
                this.stop_ring();
                this.start_end();
                this.shutdown_webrtc();
                this.fire_event('call_session_id', {session_id: 0, phone: ""});
                this.fire_event("call_notification", {close_all: true});
                break;
        }
    },

    data_connect: function () {
        var that = this;
        this.data_ws = null;
        if (location.host === "okitoki.dila.com.ua"){
            this.data_url = "wss://okitoki.dila.com.ua:8443/ws"
        }
        var load_promise = this.data_login();
        load_promise.then(function (answ) {
            if (answ.status === 'error') {
                that.fire_event('user_login_error', {error: answ.error});
            } else {
                okitoki.settings = answ.settings;
                okitoki.user_login = answ.login;
                okitoki.queues = answ.queues;
                okitoki.users = answ.users;
                okitoki.current_queue = parseInt(answ.current_queue);
                okitoki.user_id = parseInt(answ.user_id);
                okitoki.domain = answ.domain;
                okitoki.objects = answ.objects;
            }
            var mic_promise = that.check_mic();
            var popup_promise = that.check_windows();
            var checks_promise = Promise.all([mic_promise, popup_promise]);
            checks_promise.then(function () {
                that.data_ws = new WebSocket(that.data_url);
                that.data_init(answ.user_id, answ.hash);
            });
        }, function (error) { //reject
            that.fire_event('user_login_error', {error: error});
        });
    },

    connect: function () {
        this.data_connect();
    },

    disconnect: function (code) {
        console.log("disconnect");
        if (typeof code !== 'undefined') {
            if (this.data_ws && (this.data_ws.readyState === WebSocket.OPEN || this.data_ws.readyState === WebSocket.CONNECTING)) {
                this.data_ws.close(code);
            }
            this.shutdown_webrtc();
            if (this.phone_ws && (this.phone_ws.readyState === WebSocket.OPEN || this.phone_ws.readyState === WebSocket.CONNECTING)) {
                this.phone_ws.close(code);
            }
        } else {
            if (this.data_ws && (this.data_ws.readyState === WebSocket.OPEN || this.data_ws.readyState === WebSocket.CONNECTING)) {
                this.data_ws.close();
            }
            this.shutdown_webrtc();
            if (this.phone_ws && (this.phone_ws.readyState === WebSocket.OPEN || this.phone_ws.readyState === WebSocket.CONNECTING)) {
                this.phone_ws.close();
            }
        }
    },

    set_user_status: function (status) {
        var that = this;
        var _url = this.get_api_url("set_status");
        var data = "id=" + status.id;
        if (status.extended !== undefined) {
            data = data + "&extended=" + status.extended;
        }
        if (this.api_token.length > 0) {
            data = data + "&api_token=" + this.api_token;
        }
        else {
            data = data + "&_token=" + _token;
        }
        $.ajax({
            dataType: "json",
            url: _url,
            data: data,
            crossDomain: true,
            type: 'POST'
        }).done(function (answ) {
            that.fire_event('user_set_status_result', answ);
            that.log_error(answ);
        });
    },

    data_login: function () {
        var that = this;
        var _url = this.get_api_url("init");
        var data = "";
        if (this.api_token.length > 0) {
            data = "api_token=" + this.api_token;
        }
        else {
            data = "_token=" + _token;
        }
        that.fire_event('data_login_start', {});
        return new Promise(function (resolve, reject) {
            $.ajax({
                dataType: "json",
                url: _url,
                data: data,
                crossDomain: true,
                type: 'GET'
            }).done(function (answ) {
                that.log_error(answ);
                that.fire_event('data_login_success', {});
                resolve(answ);
            }).fail(function (jqXHR, textStatus) {
                that.fire_event('data_login_failed', {});
                reject(textStatus)
            });
        });
    },

    data_ping: function () {
        this.ping_stat.data.last_ping = Date.now();
        this.ping_stat.data.sent += 1;
        this.send_plain('client_ping');
    },

    phone_ping: function () {
        this.ping_stat.phone.last_ping = Date.now();
        this.ping_stat.phone.sent += 1;
        this.phone_send({
            client_ping: 'client_ping'
        });
    },

    get_ping_stat: function (type) {
        return {
            data: this.get_stat(this.ping_stat.data),
            phone: this.get_stat(this.ping_stat.phone)
        }
    },
    get_stat: function (stat) {
        return {
            sent: stat.sent,
            received: stat.received,
            loss: (100 - ((stat.received * 100) / stat.sent)).toFixed(2) + "%",
            time: {
                total: stat.time.total + 'ms',
                min: stat.time.min + 'ms',
                max: stat.time.max + 'ms',
                avg: (stat.time.total / stat.received).toFixed(2) + "ms",
                current : stat.time.current + 'ms'
            }
        }
    },
    set_ping_result: function (stat) {
        stat.received += 1;
        if (stat.time.min > Date.now() - stat.last_ping || stat.time.min === 0) {
            stat.time.min = Date.now() - stat.last_ping;
        }
        if (stat.time.max < Date.now() - stat.last_ping) {
            stat.time.max = Date.now() - stat.last_ping;
        }
        stat.time.total += Date.now() - stat.last_ping;
        stat.time.current = Date.now() - stat.last_ping;
        /*
        last_ping : 0,
            sent : 0,
            received : 0,
            time : {
                min : 0,
                total : 0,
                max : 0
            }
         */

    },
    phone_stop_ping: function () {
        clearInterval(this.phone_ping_id);
    },

    data_stop_ping: function () {
        clearInterval(this.data_ping_id);
    },

    data_onmessage: function (data) {
        if (data === 'ping') {
            this.send_plain('pong');
        }
        else if (data === 'client_pong'){
            this.set_ping_result(this.ping_stat.data);
        }
        else {
            var json = JSON.parse(data);
            switch (json.type) {
                case 'user_online':
                    this.fire_event('user_online', json);
                    this.user_status = json.status;
                    this.phone_connect();
                    break;
                case 'user_offline':
                    this.user_status = 0;
                    this.fire_event('user_offline', json);
                    break;
                case 'change_user_status':
                    this.user_status = json.status;
                    this.fire_event('user_status_changed', json);
                    break;
                case 'manage_make_dial':
                    this.start_api_call(json);
                    break;
                case 'manage_logout_user':
                    this.logout();
                    break;
                case 'dialer':
                    this.proccess_dialer_message(json);
                    break;
                case 'call':
                    var array_fname = ['start','contact_type','contact','bp','schedule','end_call','get_data','check_phone','change_var','call_if','call_case', 'add_to_call','dow','blacklist_contact'];
                    if(array_fname.indexOf(json.fname) === -1){
                        // console.log(json);
                        this.update_recent_call(json);
                        this.fire_event('call_info', json);
                        this.send_notification(json);
                        this.open_anketa(json);
                    }else{
                        if(sessionStorage.getItem("blacklist_all")){
                            var blacklist_all = sessionStorage.getItem("blacklist_all");
                            blacklist_all++;
                            sessionStorage.setItem("blacklist_all", blacklist_all);
                        }else{
                            sessionStorage.setItem("blacklist_all", 0);
                        }

                        if(sessionStorage.getItem("blacklist_circle")){
                            var blacklist_all = sessionStorage.getItem("blacklist_circle");
                            blacklist_all++;
                            sessionStorage.setItem("blacklist_circle", blacklist_all);
                        }else{
                            sessionStorage.setItem("blacklist_circle", 0);
                        }

                        // sessionStorage.setItem("blacklist_circle", );
                    }

                    break;
                case 'say_to_user':
                case 'say_to_all':
                case 'bot_message':
                    this.fire_event('chat_message', json);
                    break;
                //send message <root><string>message</string><queue>queue_id</queue><type>say_to_all | say_to_user</type><user_to>all | user_id</user_to><user_from></user_from></root>
                default:
                    this.fire_event('unknown', json);
            }
        }
    },

    proccess_dialer_message : function(json){
        if (json.status !== undefined) {
            this.fire_event('dialer_status_changed', json);
        }
        if (json.lines !== undefined) {
            this.fire_event('dialer_lines_changed', json);
        }
    },
    start_api_call: function(x){
        if (x.diffsec !== undefined && parseInt(x.diffsec) >= this.discard_timeout){
            return;
        }
        if (parseInt(x.user_to) === this.user_id) {
            var q = this.current_queue;
            if (parseInt(x.queue) > 0) {
                this.fire_event('set_current_queue', {queue_id: parseInt(x.queue)});
                q = parseInt(x.queue);
            }
            if (parseInt(x.skip_anketa) === 1) {
                this.skip_anketa_once = true;
            }
            this.api_phone = x.phone;
            this.is_api_call = true;
            this.call({
                type: "phone",
                phone: x.phone,
                uuid: x.uuid,
                contact_id: parseInt(x.contact),
                queue_id: q
            })
        }
    },
    logout : function (){
        this.fire_event('force_logout_user', {});
    },
    tr_ctype: function (t) {
        if (t === 'I')
            return "incoming_call";
        else if (t === 'P')
            return "incoming_call_pd";
        else if (t === 'O')
            return "outgoing_call";
        else if (t === 'C')
            return "callback_call";
        else
            return "offline";
    },

    send_notification: function (x){
        if (x.fname !== 'operator' && x.fname !== 'callback') {
            return;
        }
        if (parseInt(x.user_to) !== this.user_id && parseInt(x.author) !== this.user_id) {
            return;
        }
        if (x.fstate === 'stop' || x.fstate === 'finish'){
            this.fire_event("call_notification", {close_all: true});
            return;
        }
        var p_state = "";
        if (x.fstate === 'start'){
            if (x.call_type === 'O'){
                p_state = 'alerting';
            }
            else{
                p_state = 'ringing';
            }
            if (x.call_type === 'I' && parseInt(x.otm) > 0){
                if (this.call_state !== 'call') {
                    this.fire_event('run_answer_timeout', parseInt(x.otm));
                }
            }
        }
        if (x.fstate === 'connect'){
            p_state = 'connected';
        }
        var queue = this.queues[parseInt(x.queue)];
        this.fire_event('call_session_id', {session_id: x.session, phone : x.phone});
        this.fire_event('set_current_queue', {queue_id: parseInt(x.queue)});
        this.fire_event("call_notification", {
            phone_state: p_state,
            phone: x.phone,
            auth: x.auth_name !== undefined ? x.auth_name : "",
            queue_name: queue !== undefined ? queue.name : "",
            timeout: queue !== undefined ? queue.alert_timeout : 0
        });
    },

    open_anketa: function (x) {
        var open = true;
        if (x.call_type === 'O' && parseInt(x.author) > 0 && parseInt(x.user_to) > 0) {
            open = false;
        }
        if (x.fname === 'redirect' && parseInt(x.user_to) === this.user_id) {
            open = true;
        }
        if (parseInt(x.author) > 0 && parseInt(x.user_to) !== this.user_id && x.fname !== 'redirect') {
            x.user_to = parseInt(x.author);
        }
        if (parseInt(x.user_to) === this.user_id) {
            this.current_queue = parseInt(x.queue);

        }
        if ((x.fname === 'operator' || x.fname === 'callback' || x.fname === 'redirect') && parseInt(x.user_to) === this.user_id
            && x.fstate === 'start' && this.current_bp_session_id !== x.sid) {
            if (x.diffsec !== undefined && parseInt(x.diffsec) >= this.discard_timeout){
                return;
            }
            if (open) {
                this.current_bp_session_id = x.sid;
                if (this.skip_anketa_once) {
                    this.skip_anketa_once = false;
                    return;
                }
                x.ctype = this.tr_ctype(x.call_type);
                x.auto_check = 0;
                if (x.ctype === 'incoming_call_pd' || this.settings.autoanswer.value) {
                    x.auto_check = 1;
                }
                var x1 = JSON.stringify(x);
                x1 = x1.replace(/&/g, '||');
                var _url = this.get_api_url("get_bp_url");
                var data = "json=" + encodeURIComponent(x1);
                if (this.api_token.length > 0) {
                    data = data + "&api_token=" + this.api_token;
                }
                else {
                    data = data + "&_token=" + _token;
                }
                $.ajax({
                    dataType: "json",
                    url: _url,
                    data: data,
                    crossDomain: true,
                    type: 'POST'
                }).done(function (response) {
                    okitoki.fire_event('open_link', response);
                    if (okitoki.settings.pop_anketa.value) {
                        if (response.url.search('anketa.php') > -1 || response.url.search('testing10') > -1) {
                            window.open(response.url, '_blank', 'width=1000px,height=800px,scrollbars=1, toolbar=no,menubar=no,location=no,status=no');
                        } else {
                            window.open(response.url, '_blank');
                        }
                    }
                });
            }
        }
    },

    send_json: function (json) {
        if (this.data_ws && this.data_ws.readyState === 1) {    // 1 = OPEN
            this.data_ws.send(JSON.stringify(json));
        }
    },
    send_plain: function (str) {
        if (this.data_ws && this.data_ws.readyState === 1) {    // 1 = OPEN
            this.data_ws.send(str);
        }
    },

    check_mic: function () {
        this.fire_event('mic_check_started', {});
        var that = this;
        return new Promise(function (resolve, reject) {
            navigator.getUserMedia_ = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
            navigator.getUserMedia_(
                {"audio": true},
                function (stream) {
                    var track = stream.getTracks()[0];
                    track.stop();
                    that.fire_event('mic_enabled', {});
                    resolve(true);
                },
                function () {
                    that.fire_event('mic_disabled', {});
                    reject("mic_disabled");
                }
            );
        });
    },

    check_windows: function () {
        var that = this,
            pop = window.open("about:blank", "new_window_123", "height=150,width=150");
        this.fire_event('popup_check_started', {});
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                if (!pop || pop.closed || pop.closed === undefined || pop.innerWidth === 0) {
                    that.fire_event('popup_disabled', {});
                    reject("popup_disabled")
                } else {
                    pop && pop.close();
                    that.fire_event('popup_enabled', {});
                    resolve(true);
                }
            }, 500);
        });
    },

    fire_event: function (e, data) {
        var event = new CustomEvent('okitoki', {
            detail: {
                event_type: e,
                event_data: data
            }
        });
        document.dispatchEvent(event);
    },

    start_ring: function () {
        var $audio_ring = $("#audio_ring");
        if (this.api_token.length > 0 && $audio_ring.attr("src").length === 0) {
            $audio_ring.attr("src", this.ringtone);
        }
        $audio_ring.trigger("play");
    },

    stop_ring: function () {
        $("#audio_ring").trigger("pause");
    },

    start_end: function () {
        var $audio_end = $("#audio_end");
        if (this.api_token.length > 0 && $audio_end.attr("src").length === 0) {
            $audio_end.attr("src", this.end_call_sound);
        }
        $audio_end.trigger("play");
    },

    phone_send: function (json) {
        if (this.phone_ws && this.phone_ws.readyState === 1) {   // OPEN
            this.phone_ws.send(JSON.stringify(json));
            return true;
        } else {
            return false;
        }
    },

    mute: function (flag) { //true or false
        this.localStream.getTracks().forEach(function (track) {
            track.enabled = !flag;
        });
    },

    shutdown_webrtc: function () {
        if (this.settings.persistent_connection.value === false) {
            if (this.pc) {
                this.phone_send({
                    webrtc: "close"
                });
                this.pc.onnegotiationneeded = null;
                this.pc.ontrack = null;
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
            this.webrtc_state = 'DOWN';
            this.fire_event('webrtc_down', {});
        }
        this.current_listen_id = 0;
        this.current_session_id = 0;
        if (this.settings.reset_queue_after_call.value) {
            this.fire_event('set_current_queue', {queue_id: parseInt(this.settings.reset_queue_id.value)});
            this.current_queue = parseInt(this.settings.reset_queue_id.value);
        }
        this.is_api_call = false;
        this.call_state = 'idle';
    },

    is_action_disabled: function (button) {
        return !!(this.current_queue > 0 && this.queues[this.current_queue] !== undefined && this.queues[this.current_queue].disabled_buttons &&
            Object.values(this.queues[this.current_queue].disabled_buttons).indexOf(button) > -1);
    },

    start_webrtc: function () {
        if (this.webrtc_state === 'UP' || this.pc) {
            this.fire_event('webrtc_error', {error: "cannot start webrtc session. Already started."});
            return;
        }
        var that = this;
        this.pc = new PeerConnection();
        this.pc.onnegotiationneeded = function () {
            that.pc.createOffer(function (offer) {
                okitoki.phone_send(offer);
                okitoki.pc.setLocalDescription(offer);
            }, function (e) {
                okitoki.log_error(e);
            });
        };
        this.pc.ontrack = function (evt) {
            document.getElementById("audio_remote").srcObject = evt.streams[0];
        };
        navigator.getUserMedia_({"audio": true, "video": false},
            function (localStream) {
                that.localStream = localStream;
                localStream.getTracks().forEach(function (track) {
                    if (okitoki.pc) {
                        okitoki.pc.addTrack(track, localStream);
                    }
                });
            },
            function (e) {
                okitoki.log_error(e);
            });

    },

    hangup: function () {
        if (this.call_state === 'idle') {
            this.log_error("phone is idle");
            return;
        }
        if (!this.phone_connected) {
            this.log_error("phone is disconnected");
            return;
        }
        if (this.is_action_disabled("hang")) {
            this.log_error("hangup is disabled in user settings");
            return;
        }

        if (this.call_state === 'ringing') {
            this.stop_ring();
        }
        this.phone_send({
            info: "bye",
            msg_values: {
                line: 1
            }
        });
        this.fire_event('call_finish');
        this.fire_event("call_notification", {close_all: true});
        this.is_api_call = false;
        this.shutdown_webrtc();
        this.fire_event('call_session_id', {session_id: 0, phone: ""});
    },

    call: function (json) {
        if (this.call_state !== 'idle') {
            this.log_error("phone is busy");
            return;
        }
        if (!this.phone_connected) {
            this.log_error("phone is disconnected");
            return;
        }
        if (this.current_queue === 0) {
            this.log_error("queue is no set");
            return;
        }
        this.sip_release_code = 0;
        this.fire_event('sip_release_code', {code: 0});
        var command = {};
        switch (json.type) {
            case 'test':
                command = {
                    invite: "sip:mtst|" + this.user_id + "@1",
                    phone_num: "mtst|" + this.user_id
                };
                break;
            case 'phone':
                if (json.phone.length === 0) {
                    this.log_error("phone length is 0");
                }
                if (this.current_queue > 0 && parseInt(this.queues[this.current_queue].out_calls) === -1) {
                    this.log_error("outbound calls from this queue are forbidden");
                    return;
                }
                if (json.phone.length > 12) {
                    command = {
                        invite: "sip:create_phone@1",
                        phone_num: "create_phone",
                        cphone: json.phone,
                        queue: json.queue_id
                    };
                }
                else {
                    command = {
                        invite: "sip:acd_out|" + json.phone + "|" + json.queue_id + "@1",
                        phone_num: "acd_out|" + json.phone + "|" + json.queue_id
                    };
                }
                //skip hunt from settings
                if (json.uuid !== undefined && json.uuid.length > 0) {
                    command.uuid = json.uuid;
                }
                if (json.contact_id !== undefined && parseInt(json.contact_id) > 0) {
                    command.var1 = json.contact_id;
                }
                break;
        }
        this.call_state = 'alerting';
        this.fire_event('call_start', {state: 'alerting'});
        this.phone_send(command);
    },

    log_error: function (error, tp) {
        if (error.url && error.url === "") {
            return;
        }
        if (tp !== undefined) {
            if (tp === 'info'){
                console.info(error);
            }
            else{
                console.log(error);
            }
        }
        else{
            console.log(error);
        }
    },

    redirect: function (json) {
        if (this.call_state !== 'call') {
            this.log_error("no phone call to redirect");
            return;
        }
        if (!this.phone_connected) {
            this.log_error("phone is disconnected");
            return;
        }
        if (this.is_action_disabled("pa")) {
            this.log_error("redirect is disabled in user settings");
            return;
        }
        var command = {};
        var data = "";
        switch (json.type) {
            case 'user':
                command = {
                    cmgs: "redirect|" + json.session_id + "|" + json.user_id
                };
                data = "action=redirect_user&redirect_user=" + json.user_id + "&session_id=" + json.session_id + "&queue_id=" + this.current_queue;
                break;
            case 'queue':
                command = {
                    cmgs: "queue_redirect|" + json.session_id + "|" + json.queue_id
                };
                data = "action=redirect_queue&redirect_queue=" + json.queue_id + "&session_id=" + json.session_id + "&queue_id=" + this.current_queue;
                break;
            case 'phone':
                var cid = 0;
                if (json.contact_id !== undefined) {
                    cid = parseInt(json.contact_id);
                }
                command = {
                    cmgs: "cl_redirect|" + json.session_id + "|" + json.phone
                };
                data = "action=redirect_phone&redirect_phone=" + json.phone + "&session_id=" + json.session_id + "&contact_id=" + cid + "&queue_id=" + this.current_queue;
                break;
        }
        //this.send(command); //commented due to ajax
        this.make_ajax(data);
    },

    send_sms : function(json){
        var d = "";
        if (this.api_token.length > 0) {
            d = "api_token=" + this.api_token;
        }
        else {
            d = "_token=" + _token;
        }
        var data = "";
        if (json.user_id !== undefined && json.user_id>0){
            data = "user_id="+json.user_id;
        }
        else{
            data = "phone="+json.phone;
        }
        if (json.template_id !== undefined && json.template_id>0){
            data = data + "&template_id="+json.template_id;
        }
        data = data + "&text="+encodeURIComponent(json.text);
        var _url = this.get_api_url("send_sms");
        $.ajax({
            dataType: "json",
            url: _url,
            data: d + "&" + data,
            crossDomain: true,
            type: 'POST'
        }).done(function (answ) {
            okitoki.fire_event('send_sms_result', answ);
        });
    },

    make_ajax: function (data) {
        var d = "";
        if (this.api_token.length > 0) {
            d = "api_token=" + this.api_token;
        }
        else {
            d = "_token=" + _token;
        }
        var _url = this.get_api_url("manage_call");
        $.ajax({
            dataType: "json",
            url: _url,
            data: d + "&" + data,
            crossDomain: true,
            type: 'POST'
        }).done(function (answ) {
            console.log(answ);
            okitoki.fire_event('command_result', answ);
        });
    },

    answer: function () {
        if (this.call_state !== 'ringing') {
            this.log_error("no incoming ringing phone calls");
            return;
        }
        if (!this.phone_connected) {
            this.log_error("phone is disconnected");
            return;
        }
        this.stop_ring();
        this.phone_send({
            accept: {
                line: 1
            }
        });
    },

    start_hold: function (json) {
        if (this.call_state !== 'call') {
            this.log_error("no phone call to set on hold");
            return;
        }
        if (!this.phone_connected) {
            this.log_error("phone is disconnected");
            return;
        }
        if (this.is_action_disabled("hold")) {
            this.log_error("hold is disabled in user settings");
            return;
        }
        /*
        var command = {
            cmgs: "start_hold|" + json.session_id + "|" + this.user_id
        };
        */
        var data = "action=start_hold&session_id=" + json.session_id + "&queue_id=" + this.current_queue;
        //this.phone_send(command); //commented due to ajax
        this.make_ajax(data);
    },

    stop_hold: function (json) {
        if (this.call_state !== 'idle') {
            this.log_error("phone is busy");
            return;
        }
        if (!this.phone_connected) {
            this.log_error("phone is disconnected");
            return;
        }
        if (this.is_action_disabled("hold")) {
            this.log_error("hold is disabled in user settings");
            return;
        }
        this.from_hold = 1;
        setTimeout(function () {
            okitoki.from_hold = 0;
        }, 3000);
        /*
        var command = {
            cmgs: "stop_hold|" + json.session_id + "|" + this.user_id
        };
        */
        var data = "action=stop_hold&session_id=" + json.session_id + "&queue_id=" + this.current_queue;
        //this.phone_send(command); //commented due to ajax
        this.make_ajax(data);
    },

    connect_call_with_hold: function (json) {
        if (this.call_state !== 'call') {
            this.log_error("no phone call to connect");
            return;
        }
        if (!this.phone_connected) {
            this.log_error("phone is disconnected");
            return;
        }
        setTimeout(function () {
            okitoki.from_hold = 0;
        }, 3000);
        /*
        var command = {
            cmgs: "stop_hold|" + json.session_id + "|" + this.user_id
        };
        */
        var data = "action=call_to_hold&hold_session_id=" + json.hold_session_id + "&call_session_id=" + json.call_session_id + "&queue_id=" + this.current_queue;
        //this.phone_send(command); //commented due to ajax
        this.make_ajax(data);
    },

    end_call: function (session_id) {

        /*
        var command = {
            cmgs: "stop_hold|" + json.session_id + "|" + this.user_id
        };
        */
        var data = "action=end_call&session_id=" + session_id + "&queue_id=" + this.current_queue;
        //this.phone_send(command); //commented due to ajax
        this.make_ajax(data);
    },

    listen: function (json) {
        if (this.call_state !== 'idle') {
            this.log_error("phone is busy");
            return;
        }
        if (!this.phone_connected) {
            this.log_error("phone is disconnected");
            return;
        }
        var command = {
            invite: "sip:listen|" + json.session_id + "|" + json.queue_id + "|" + this.user_id + "@1",
            phone_num: "listen|" + json.session_id + "|" + json.queue_id + "|" + this.user_id
        };
        this.current_listen_id = json.session_id;
        this.phone_send(command);
    },

    intercept: function (json) {
        if (this.call_state !== 'idle') {
            this.log_error("phone is busy");
            return;
        }
        if (!this.phone_connected) {
            this.log_error("phone is disconnected");
            return;
        }
        /*
        var command = {
            cmgs: "intercept|" + json.session_id + "|" + this.user_id
        };
        */
        var data = "action=intercept&session_id=" + json.session_id + "&queue_id=" + this.current_queue;
        //this.phone_send(command); //commented due to ajax
        this.make_ajax(data);
    },

    receive_fax: function (json) {
        var command = {
            cmgs: "start_fax|" + json.session_id + "|" + this.user_id
        };
        this.phone_send(command);
    },

    me2conf: function (json) {
        if (this.call_state !== 'idle') {
            this.log_error("phone is busy");
            return;
        }
        if (!this.phone_connected) {
            this.log_error("phone is disconnected");
            return;
        }
        if (this.is_action_disabled("conf")) {
            this.log_error("conference is disabled in user settings");
            return;
        }
        var command = {
            invite: "sip:me_to_conf|" + json.session_id + "@1",
            phone_num: "me_to_conf|" + json.session_id,
            var1: json.queue_id,
            var2: this.user_id
        };
        this.phone_send(command);
    },

    client2conf: function (json) {
        if (this.call_state !== 'call') {
            this.log_error("no phone call to conference");
            return;
        }
        if (!this.phone_connected) {
            this.log_error("phone is disconnected");
            return;
        }
        if (this.is_action_disabled("conf")) {
            this.log_error("conference is disabled in user settings");
            return;
        }
        var command = {
            cmgs: "put_in_conf|" + json.session_id + "|" + json.conf_session_id
        };
        var data = "action=put_in_conf&session_id=" + json.session_id + "&conf_session_id=" + json.conf_session_id + "&queue_id=" + this.current_queue;
        //this.phone_send(command); //commented due to ajax
        this.make_ajax(data);
    },

    start_conf: function (json) {
        if (this.call_state !== 'call') {
            this.log_error("no phone call to make conference");
            return;
        }
        if (!this.phone_connected) {
            this.log_error("phone is disconnected");
            return;
        }
        if (this.is_action_disabled("conf")) {
            this.log_error("conference is disabled in user settings");
            return;
        }
        /*
        var command = {
            cmgs: "set_on_hold|" + json.session_id + "|" + this.user_id
        };
        */
        var data = "action=start_conf&&session_id=" + json.session_id + "&queue_id=" + this.current_queue;
        //this.phone_send(command); //commented due to ajax
        this.make_ajax(data);
    },

    set_current_queue: function (id) {
        this.current_queue = id;
    },

    send_dtmf_key: function (json) {
        var command = {
            dtmf: json.session_id + "|" + json.key
        };
        this.phone_send(command);
    },

    get_recent_calls: function () {
        var that = this;
        return new Promise(function (resolve, reject) {
            var load_recent_calls = function () {
                $.ajax({
                    dataType: "json",
                    url: that.get_api_url("recent_calls"),
                    crossDomain: true,
                    type: 'GET'
                }).done(function (response) {
                    that.recent_calls = response;
                    resolve(response);
                }).fail(function () {
                    reject("failed to load recent calls");
                });
            };
            if (that.recent_calls !== null) {
                resolve(that.recent_calls);
            } else {
                if (that.user_login.length > 0) {
                    load_recent_calls();
                } else {
                    var wait_for_init = setInterval(function () {
                        if (that.user_login.length > 0) {
                            load_recent_calls();
                            clearInterval(wait_for_init);
                        }
                    }, 500);
                }
            }
        });
    }
};
