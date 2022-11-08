new Vue({
    el: "#current_comp_time",

    data: {
        time: null,
        display_time: ""
    },

    mounted: function() {
        var that = this;
        this.time = moment($("#current_comp_time").data("time"));
        this.display_time = this.time.format("HH:mm");
        $("#current_comp_time").show();
        setInterval(function() {
            that.time.add(10, "s");
            that.display_time = that.time.format("HH:mm");
        }, 10000);
    }
});