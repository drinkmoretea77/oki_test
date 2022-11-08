let list = [];

onmessage = function (event) {
    let data = event.data;
    if (data.close_all) {
        while (list.length > 0) {
            let item = list.pop();
            item.close();
        }
    }
    if (!data.title) {
        return;
    }
    let notif = new Notification(data.title, data.options);
    if (data.action) {
        notif.onclick = function () {
            postMessage(data.action);
        };
    }
    notif.onclose = function () {
        // do nothing yet
    };
    list.push(notif);
};

