<template>
    <div>
        <div class="row" v-if="transcript && transcript.done && link_transcript_export_html">
            <div class="col-md-12">
                <div v-if="!isTranscriptEmpty()" class="pull-right margin-top-15">
                    <div class="btn-group btn-group-solid pull-right js-export-dropdown">
                        <button class="btn btn-default dropdown-toggle" data-toggle="dropdown" type="button" aria-expanded="false">
                            {{ $t("Экспорт") }}
                            <i class="fa fa-angle-down"></i>
                        </button>
                        <ul class="dropdown-menu">
                            <li>
                                <a :href="link_transcript_export_html"> HTML </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <h3 class="inline-block pull-left">{{ $t('Стенограмма') }}</h3>
            </div>
        </div>

        <div class="transcript-wrapper" v-if="Object.keys(transcript).length > 0 && transcript.done">
            <!--  Отключен сервис создания стенограммы -->
            <div v-if="false">
                <div class="row">
                    <div class="col-md-12 transcript-center">
                        <div id="filter_call" class="note note-warning">
                            <h6>
                                {{ $t('Этот инструмент делает автоматический перевод записи разговора в текст - стенограмму.') }}
                                <br>
                                {{ $t('Используйте бесплатные минуты, а потом получайте дополнительные минуты распознавания за небольшую плату…. ну или ждите следующий день.') }}
                                <br>
                            </h6>
                            <p>
                                <a class="hoverable-popover" href="javascript:"
                                   :data-tipped-options="'title: \'' + $t('Список очередей с автоматическим распознаванием') + '\''"
                                >{{ $t('Автосоздание стенограммы') }}</a>
                                {{ $t('для очереди') }}: {{ auto_create_enabled ? $t('включено') : $t('выключено') }}
                            </p>

                            <div class="hidden" rel="popover-content">
                                <template v-if="queues.length > 0">
                                    {{ $t('Очереди') }}:
                                    <ul class="list-unstyled">
                                        <li v-for="queue in queues" :key="queue.id">
                                            <a :href="queue.link">{{ queue.name }}</a>
                                        </li>
                                    </ul>
                                </template>

                                <template v-if="queues.length === 0">
                                    {{ $t('Нет очередей и автообзвонов с автоматическим распознаванием.') }}
                                </template>
                                <template v-else>
                                    {{ $t('Нет очередей с автоматическим распознаванием.') }}
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row" v-if="Object.keys(transcript).length === 0">
                    <div class="col-md-12 transcript-empty">
                        <div v-show="!is_wait">
                            <button class="btn btn-primary" @click="createTranscript">{{ $t('Получить стенограмму') }}</button>
                            <span class="margin-left-15">{{ $t('Осталось бесплатных минут:') + ' ' + time_left }}</span>
                        </div>
                        <div v-show="is_wait" class="transcript-empty-wait">
                            <div class="alert alert-info">
                                {{ $t('Получение стенограммы разговора. Примерное время ожидания: 20 секунд на каждую минуту разговора.') }}
                            </div>
                            <div class="text-center">
                                <div v-show="is_check" class="loading-message">
                                    <div class="block-spinner-bar">
                                        <div class="bounce1"></div>
                                        <div class="bounce2"></div>
                                        <div class="bounce3"></div>
                                    </div>
                                </div>
                                <span v-show="!is_check"> {{ time_wait | asTime }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row transcript" v-if="Object.keys(transcript).length > 0 && transcript.done">
                <div v-if="!isTranscriptEmpty()" class="col-md-12">
                    <div>
                        <span v-for="tag in speech_statistic.tags_inverse" class="badge badge-success">{{ tag }}</span>
                        <template v-for="item in speech_statistic.tags">
                            <span class="badge badge-success">{{ item.tag }}: {{ item.count }}</span>{{ ' ' }}
                        </template>
                        <span v-if="speech_statistic.operator_temp > 0" class="badge badge-info">{{ $t("Темп речи") }}: {{ speech_statistic.operator_temp }}</span>
                        <span v-if="speech_statistic.obscenity > 0" class="badge badge-danger">{{ $t('Обсценка') }}: {{ speech_statistic.obscenity }}</span>
                        <span v-if="speech_statistic.interrupt > 0" class="badge badge-danger">{{ $t('Перебивание') }}: {{ speech_statistic.interrupt }}</span>
                        <span v-if="speech_statistic.silence > 0" class="badge badge-danger">{{ $t('Пауза') }}: {{ speech_statistic.silence }}</span>
                    </div>
                    <div class="margin-top-20">
                        <ul class="chats">
                            <li v-for="item in transcript_prepared" :class="item.channel === operator_channel ? 'in' : 'out'">
                                <div class="avatar text-center font-grey-salsa bold transcript-center transcript-avatar">
                                    <span v-if="item.channel === operator_channel">{{ $t('Оператор') }}</span>
                                    <span v-if="item.channel !== operator_channel">{{ $t('Клиент') }}</span>
                                </div>
                                <div class="message transcript-message">
                                    <span class="arrow"> </span>
                                    <a href="javascript:" class="name" @click="startPlayFromTimestamp(item.start_time)">{{ Math.round(item.start_time) | asTime}}</a>
                                    <template v-for="block in item.items">
                                        <div v-if="block.speech_analyze" class="body">
                                            <span v-if="block.speech_analyze.obscenity" class="badge badge-danger">{{ $t('Обсценка') }}</span>
                                            <span v-if="block.speech_analyze.interrupt" class="badge badge-danger">{{ $t('Перебивание') }}</span>
                                            <span v-if="block.speech_analyze.silence" class="badge badge-danger">{{ $t('Пауза') }}</span>
                                            <template v-for="(item, index) in block.speech_analyze.tags">
                                                <span class="badge badge-success">{{ item.tag }}: {{ item.count }}</span>{{ ' ' }}
                                            </template>
                                        </div>
                                        <div v-if="(current_time < block.start_time) || (block.end_time < current_time)"
                                             class="body" :class="{'font-blue': block.end_time < current_time}"
                                             v-html="block.text_html || block.text"
                                        ></div>
                                        <div v-else class="body">
                                            <span v-for="phrase in parsePhrases(block)" :class="{'font-blue': phrase.start_time < current_time}">{{ phrase.text }} </span>
                                        </div>
                                    </template>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div v-else class="col-md-12">
                    <div class="alert alert-warning alert-report transcript-empty-alert">
                        <i class="fa fa-warning transcript-empty-warning"></i>
                        <div>
                            <h2>{{ $t('Нет данных для отображения.') }}</h2>
                            <p v-if="transcript.bad_reasons && transcript.bad_reasons.unsupported_browser" class="lead" >
                                {{ $t("Для распознавания речи оператора, рекомендуем использовать браузер «Google Chrome». Данная стенограмма отсутствует по причине использования другого браузера.") }}
                            </p>
                            <p v-else-if="transcript.bad_reasons && transcript.bad_reasons.operators_dialog" class="lead" >
                                {{ $t("Для разговоров между операторами стенограмма не сохраняется.") }}
                            </p>
                            <p v-else class="lead" >
                                {{ $t("Ой, мы изучили файл и не разобрали ни одного слова. Возможно звонок очень короткий, проблемный или вы дозвонились молчуну :)") }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        transcript_data: null,
        current_time: 0,
    },

    data() {
        return {
            time_wait: 0,
            is_wait: false,
            is_check: false,

            storage_id: this.transcript_data.storage_id,
            transcript: this.transcript_data.transcript ? this.transcript_data.transcript : {},
            operator_channel: this.transcript_data.operator_channel,
            duration: this.transcript_data.duration,
            auto_create_enabled: this.transcript_data.auto_create_enabled,
            queues: this.transcript_data.queues,
            time_left: this.transcript_data.time_left,
            link_transcript_create: this.transcript_data.link_transcript_create,
            link_transcript_export_html: this.transcript_data.link_transcript_export_html || null,

            transcript_prepared: [],
            speech_statistic: {
                interrupt: 0,
                silence: 0,
                obscenity: 0,
                operator_temp: 0,
                tags_inverse: [],
                tags: [],
            }
        }
    },

    filters: {
        asTime(value) {
            if (!value) {
                return '00:00';
            }

            let sign = '';
            if (value < 0) {
                value = -value;
                sign = '-';
            }
            const seconds = value % 60;
            const min = Math.trunc(value / 60);
            return sign + min + ':' + (seconds < 10 ? '0' : '') + seconds;
        }
    },

    created() {
        if (!this.isTranscriptEmpty()) {
            this.prepareTranscript();
            this.speech_statistic.operator_temp = this.transcript.statistics?.speech_speed[this.operator_channel] || 0;
            this.speech_statistic.tags_inverse = this.transcript.statistics?.tags_inverse || [];
        }
    },

    mounted() {
        const obj = $(this.$el);
        obj.find('.hoverable-popover').each(() => {
            $(this).attr('title', obj.find('[rel=popover-content]').html());
        });
        Tipped.create(
            obj.find('.hoverable-popover'),
            {
                skin: 'light'
            }
        );

        /*
        if (this.player_id && !this.isTranscriptEmpty()) {
            // Навешиваемся на событие плеера: проигрывание началось
            .bind($.jPlayer.event.playing, (event) => {
                return;

                const currentTime = event.jPlayer.status.currentTime;
                if (currentTime > 2) {
                    return;
                }
                // Перемотаем на начало разговора по данным из стенограммы
                const start_time = that.transcript.items[0].start_time - 1;
                if (start_time > 10000) {
                    return;
                }
                if (currentTime < start_time) {
                    $("#" + that.player_id).jPlayer("play", start_time);
                }
            });
        }
        */
    },

    methods: {
        isTranscriptEmpty() {
            return !(this.transcript && this.transcript.items && this.transcript.items.length)
        },

        startPlayFromTimestamp(timestamp) {
            timestamp = Math.trunc(timestamp);
            if (timestamp > 10000) {
                // Проблема с timestamp - обнулить
                timestamp = 0;
            }
            this.$emit('rewind', timestamp);
        },

        // Разбить блок на фразы с указанием времени начала для каждой
        parsePhrases(item) {
            const char_duration = item.text.length ? item.duration / item.text.length : 0;
            let chars_played = 0;
            const words = item.text.split(/\s+/u);
            let result = [];

            for (let i = 0; i < words.length; ++i) {
                result.push({
                    text: words[i] + ' ',
                    start_time: item.start_time + chars_played * char_duration,
                });

                chars_played += words[i].length + 1;
            }

            return result;
        },

        // Объединить подряд идущие блоки канала
        prepareTranscript() {
            let that = this,
                item = null,
                result = [],
                end_time = this.duration;

            // calc duration of items
            for (let index = this.transcript.items.length - 1; index >= 0; index--) {
                end_time = this.transcript.items[index].end_time || end_time;
                if (!end_time) {
                    end_time = this.transcript.items[index].start_time + 1;
                }
                this.transcript.items[index].duration = end_time - this.transcript.items[index].start_time;
                end_time = this.transcript.items[index].start_time;
            }

            for (let i = 0; i < this.transcript.items.length; ++i) {
                let cur_item = this.transcript.items[i];

                // speech_analyze
                if (cur_item.speech_analyze) {
                    if (cur_item.speech_analyze.interrupt) {
                        // Перебивание клиентом не учитываем
                        if (cur_item.channel !== this.operator_channel) {
                            delete cur_item.speech_analyze.interrupt;
                        } else {
                            this.speech_statistic.interrupt += 1;
                        }
                    }
                    if (cur_item.speech_analyze.silence) {
                        this.speech_statistic.silence += 1;
                    }
                    if (cur_item.speech_analyze.obscenity) {
                        this.speech_statistic.obscenity += cur_item.speech_analyze.obscenity;
                    }
                    if (cur_item.speech_analyze.tags) {
                        cur_item.speech_analyze.tags.forEach(function (tag) {
                            const obj = that.speech_statistic.tags.find(function (item) {
                                return item.tag === tag.tag;
                            });
                            if (obj) {
                                obj.count += tag.count
                            } else {
                                that.speech_statistic.tags.push({...tag});
                            }
                            // Выделить слова в тексте
                            if (tag.words) {
                                const words = tag.words.map(function(word) { return word.replace(/(?=\W)/gu, '\\');});
                                const pattern = new RegExp(' (' + words.join('|') + ') ', 'ig');
                                cur_item.text_html = cur_item.text.replace(pattern, function(match, word) {
                                    return ' <b>' + word + '</b> ';
                                });
                            }
                        });
                    }
                }

                if (item && (item.channel === cur_item.channel)) {
                    item.items.push(cur_item);
                    continue;
                }

                if (item) {
                    result.push(item);
                    item = null;
                }

                item = Object.assign({}, cur_item);
                item.items = [cur_item];
            }

            if (item) {
                result.push(item);
            }

            this.transcript_prepared = result;
        },

        createTranscript() {
            const that = this;
            that.is_wait = true;
            that._createTranscript();
        },

        _timer(time) {
            const that = this;
            if (time) {
                that.time_wait = time;
            }
            that.time_wait--;

            if (that.time_wait < 0) {
                that._createTranscript();
                return;
            }

            setTimeout(() => {
                that._timer()
            }, 1000);
        },

        async _createTranscript() {
            this.is_check = true;

            const response = await this.$action({
                method: 'post',
                url: this.link_transcript_create,
                dataParams: {
                    storage_id: this.storage_id
                }
            })

            if (!response.error) {
                if (data.done === false) {
                    this._timer(20);
                    this.is_check = false;
                    return;
                }
                this.is_wait = false;
                this.transcript = data;
                this.prepareTranscript();
            }
            else {
                this.is_wait = false;
                const json = JSON.parse(xhr.responseText) || {};
                console.log(json.error || json);
            }
        },
    }
}
</script>

<style lang="stylus" scoped>
    .transcript-wrapper
        background: rgba(255,255,255, 0.3)
        padding: 10px 10px 0 10px
        margin-bottom: 15px
        .transcript-center
            align-items: center
            justify-content: center
        .transcript-empty
            display:flex
            min-height:50px
            align-items: center
        .transcript-empty-wait
            width: 100%
            align-self: flex-start
        .transcript-empty-alert
            display: block
            max-width: 650px
            margin: 20px auto
        .transcript-empty-warning
            vertical-align: inherit
        .transcript .badge
            margin-left: 0
        .chats
            .transcript-avatar
                font-size: 195%
            .body:first-letter
                text-transform: capitalize
            li
                display: flex
                .avatar
                    width: auto
                    height: auto
                .transcript-message
                    background: rgba(255,255,255, 0.3)
                &.in
                    .message
                        margin-left: 0
                &.out
                    flex-direction: row-reverse
                    .message
                        margin-right: 0

</style>
