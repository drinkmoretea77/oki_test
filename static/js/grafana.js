window.onload = function () {
    $('.grafana-app').on("DOMNodeInserted", function () {
        grafana.submenuControls();
        grafana.changePropTitles();
        grafana.showElems();
        grafana.addEventRefreshTimeRange();
        grafana.hideElems();
    });

    grafana.visible_params = [
        'Очередь',
        'Проект',
        'Автообзвон',
    ];

    grafana.visible_param_checks = {};

    grafana.submenuControls = function () {
        const $submenu_controls = $('.submenu-controls');
        if ($submenu_controls.length) {
            $submenu_controls[0].style.display = 'none';
        }

        var $labels = $submenu_controls.find('.submenu-item label'),
            name;

        for (var index = 0; index < $labels.length; index++) {
            name = $labels[index].innerHTML;

            if (this.visible_param_checks.hasOwnProperty(name)) {
                continue;
            }

            if (!this.visible_params.includes(name)) {
                this.visible_param_checks[name] = false;
                $labels[index].closest('.submenu-item').style.display = 'none';
                continue;
            }
            this.visible_param_checks[name] = true;
        }

        for (var param in this.visible_param_checks) {
            if (this.visible_param_checks[param]) {
                $submenu_controls[0].style.display = 'block';
                return;
            }
        }
    };

    grafana.changePropTitles = function () {
        let $props = $('.variable-options-wrapper .variable-options-column .variable-option.pointer span:not(.variable-option-icon)' +
            ', .variable-link-wrapper .css-5t1gy9');

        $props.each(function (i, elem) {
            if (grafana.project_names[elem.innerHTML]) {
                elem.innerHTML = grafana.project_names[elem.innerHTML];
            } else if (grafana.queue_names[elem.innerHTML]) {
                elem.innerHTML = grafana.queue_names[elem.innerHTML];
            } else if (grafana.dialer_names[elem.innerHTML]) {
                elem.innerHTML = grafana.dialer_names[elem.innerHTML];
            }
        });
    };

    grafana.showElems = function () {
        const $elems = $('.css-jjmrnb span');
        let text;

        $elems.each(function (i, elem) {
            text = elem.innerHTML;
            if (text === 'Последний 1 час') {
                elem.closest('.css-jjmrnb').style.display = "flex";
            }
        });
    };

    grafana.hideElems = function () {
        $('.css-1fngiab button:last-child').html('').css('display', 'none');
        $('.css-1fngiab button:first-child').css('border-right-width', '1px');
        $('.css-74lldy').remove();

        const hide = [
            'Последние 90 дней',
            'Last 90 days',
            'Последние 6 месяцев',
            'Last 6 months',
            'Последний 1 год',
            'Last 1 year',
            'Последние 2 года',
            'Last 2 years',
            'Последние 5 лет',
            'Last 5 years',
            'Прошлый год',
            'Previous year',
            'Этот год',
            'This year',
            'Этот год до текущего времени',
            'This year so far',
        ];
        for (var i in hide) {
            $(".css-jjmrnb span:contains('" + hide[i] + "')").closest('div').remove();
        }
    };

    grafana.addEventRefreshTimeRange = function () {
        const change = function () {
            setTimeout(function () {
                const url = new URL(location.href);
                const time_ranges = [
                    "now-5m",
                    "now-15m",
                    "now-30m",
                    "now-1h",
                ];
                const from = url.searchParams.get('from');
                if (from && !time_ranges.includes(from)) {
                    $('.event-added-refresh').trigger('click');
                    setTimeout(function() {
                        const $refresh = $('.css-14m2rxo');
                        $refresh.each(function (i, elem) {
                            if (elem.innerHTML.trim() === 'Off') {
                                let x = $(elem).offset().left + 15;
                                let y = $(elem).offset().top + 15;

                                let clickEvent = document.createEvent('MouseEvents');
                                clickEvent.initMouseEvent('click',
                                    true,
                                    true,
                                    window,
                                    0,
                                    0,
                                    0,
                                    x,
                                    y,
                                    false,
                                    false,
                                    false,
                                    false,
                                    0,
                                    null
                                );
                                document.elementFromPoint(x, y).dispatchEvent(clickEvent);
                            }
                        });
                    }, 1000);
                }
            }, 1000);
        };

        const $time_range = $('.css-15dl6a3 span');
        $time_range.each(function (i, elem) {
            if (elem.classList.contains('event-added-time-range')) {
                return;
            }
            elem.classList.add('event-added-time-range');
            elem.addEventListener('DOMCharacterDataModified', change)
            change();
        });

        const $refresh = $('.css-12dam7b');
        $refresh.each(function (i, elem) {
            if (elem.classList.contains('event-added-refresh')) {
                return;
            }

            elem.classList.add('event-added-refresh');
            elem.addEventListener('DOMCharacterDataModified', change)
            change();
        });
    }
};
