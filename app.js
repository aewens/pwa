if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").then(function() {
        console.log("Registered!");
    });
}

function updateNetwork() {
    if (navigator.onLine) {
        console.log("Online");
    } else {
        console.log("Offline");
    }
}

function pushSupported() {
    if (Notification.permission === "denied") {
        console.log("Notifications blocked");
        return;
    }

    if (!("PushManager" in window)) {
        console.log("Notifications are not supported");
        return;
    }

    navigator.serviceWorker.ready.then(function(reg) {
        reg.pushManager.getSubscription().then(function(sub) {
            pushStatus(!!sub);
        }).catch(function(err) {
            console.error("Error: ", err);
        });
    });
}

function subPush() {
    navigator.serviceWorker.ready.then(function(reg) {
        if (!reg.pushManager) {
            console.log("Notifications are not supported");
            return false;
        }

        reg.pushManager.subscribe({
            userVisibleOnly: true
        }).then(function(sub) {
            console.info("Subscribed");
            console.log(sub);
            pushStatus(true);
        }).catch(function(err) {
            console.error("Subscription error: ", err);
            pushStatus(false);
        });
    });
}

function unsubPush() {
    navigator.serviceWorker.ready.then(function(reg) {
        reg.pushManager.getSubscription().then(function(sub) {
            if (!sub) {
                console.log("Unable to unsubscribe");
                return;
            }

            sub.unsubscribe().then(function() {
                console.info("Unsubscribed");
                console.log(sub);
                pushStatus(false);
            }).catch(function(err) {
                console.error(err);
            })
        }).catch(function(err) {
            console.error("Failed to unsubscribe");
        })
    })
}

function pushStatus(status) {
    if (status) {
        console.log("Yes");
    } else {
        console.log("No");
    }
}

document.addEventListener("DOMContentLoaded", function(e) {
    if (!navigator.onLine) {
        updateNetwork();
    }

    window.addEventListener("online", updateNetwork, false);
    window.addEventListener("offline", updateNetwork, false);

    var pusher = document.getElementById("push");
    pusher.addEventListener("click", function() {
        var subscribed = pusher.dataset.checked === "true";
        if (subscribed) {
            unsubPush();
        } else {
            subPush();
        }
    });

    pushSupported();
});