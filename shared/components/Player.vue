<template>
    <div class="v-player" :class="{ 'v-player--ready': ready }">
        <div v-show="native" class="v-player__native">
            <audio
                ref="player"
                class="v-player__audio"
                :preload="preload"
                :loop="repeat"
                controls
            >
                <source :src="src" type="audio/mpeg" />
            </audio>
        </div>
        <div v-if="!native" class="v-player__wrapper">
            <div class="v-player__row">
                <div class="v-player__left">
                    <div class="v-player__play" @click="toggle">
                        <svg
                            v-if="status === 'play'"
                            class="v-player__play-icon"
                            viewBox="0 0 24 24"
                        >
                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                        </svg>
                        <svg
                            v-else-if="status === 'pause'"
                            class="v-player__play-icon"
                            viewBox="0 0 24 24"
                        >
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                </div>
                <div class="v-player__center">
                    <div class="v-player__title">
                        {{ title }}
                    </div>
                    <div class="v-player__time v-player__time--current">
                        {{ currentLocal }}
                    </div>
                    <div class="v-player__time v-player__time--duration">
                        {{ durationLocal }}
                    </div>
                    <div
                        class="v-player__bar"
                        ref="bar"
                        @mouseenter="showCurrentBar"
                        @mouseleave="hideCurrentBar"
                        @mousemove="updateCurrentBar"
                        @click="setCurrentBar"
                    >
                        <div
                            v-show="displayCurrentBar"
                            ref="currentBar"
                            class="v-player__bar-current"
                        >
                            <div
                                v-if="currentSection"
                                class="v-player__bar-current-label"
                            >
                                {{ currentSection.text }}
                            </div>
                            {{ currentBarLocal }}
                        </div>
                        <div class="v-player__bar-wrap">
                            <div
                                class="v-player__bar-fill"
                                :style="{ width: `${progress}%` }"
                            ></div>
                            <div
                                v-for="(section, sectionIndex) in sectionsLocal"
                                :key="sectionIndex"
                                class="v-player__bar-section"
                                @mouseenter="setCurrentSection(section)"
                                :class="{
                                    'v-player__bar-section--active':
                                        !section.empty,
                                }"
                                :style="{
                                    left: `${section.start}%`,
                                    width: `${section.width}%`,
                                }"
                            ></div>
                        </div>
                    </div>
                </div>
                <div class="v-player__right">
                    <div class="v-player__drop">
                        <div class="v-player__drop-toggle" @click="nextSpeed">
                            <div
                                class="v-player__control"
                                :class="{
                                    'v-player__control--active': speed !== 1,
                                }"
                            >
                                <div class="v-player__control-text">
                                    x{{ speed }}
                                </div>
                            </div>
                        </div>
                        <div class="v-player__drop-content">
                            <div class="v-player__drop-wrap">
                                <div class="v-player__speed">
                                    <div
                                        v-for="option in speedOptions"
                                        :key="option"
                                        class="v-player__speed-option"
                                        :class="{
                                            'v-player__speed-option--active':
                                                option === speed,
                                        }"
                                        @click="speed = option"
                                    >
                                        x{{ option }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="v-player__drop">
                        <div
                            class="v-player__drop-toggle"
                            @click="repeat = !repeat"
                        >
                            <div
                                class="v-player__control"
                                :class="{ 'v-player__control--active': repeat }"
                            >
                                <svg
                                    class="v-player__control-icon"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        d="M12,5V2L8,6l4,4V7c3.31,0,6,2.69,6,6c0,2.97-2.17,5.43-5,5.91v2.02c3.95-0.49,7-3.85,7-7.93C20,8.58,16.42,5,12,5z"
                                    />
                                    <path
                                        d="M6,13c0-1.65,0.67-3.15,1.76-4.24L6.34,7.34C4.9,8.79,4,10.79,4,13c0,4.08,3.05,7.44,7,7.93v-2.02 C8.17,18.43,6,15.97,6,13z"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div class="v-player__drop-content">
                            <div class="v-player__drop-wrap">
                                <div class="v-player__drop-text">Повторять</div>
                            </div>
                        </div>
                    </div>

                    <div
                        ref="volumeWrap"
                        @mouseenter="updateVolume"
                        class="v-player__drop v-player__drop--right"
                    >
                        <div
                            class="v-player__drop-toggle"
                            @mousedown.prevent="toggleVolume"
                        >
                            <div class="v-player__control">
                                <svg
                                    v-if="Number(volume) === 0"
                                    class="v-player__control-icon"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"
                                    />
                                </svg>
                                <svg
                                    v-else
                                    class="v-player__control-icon"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div class="v-player__drop-content">
                            <div
                                ref="volumeContent"
                                class="v-player__drop-wrap"
                            >
                                <div class="v-player__volume">
                                    <input
                                        class="v-player__volume-input"
                                        ref="volume"
                                        type="range"
                                        min="0"
                                        max="100"
                                        v-model="volume"
                                    />
                                </div>
                            </div>
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
        /**
         * Ссылка на аудио-файл или буффер
         */
        src: {
            type: String,
            default: '',
        },
        /**
         * Название
         */
        title: {
            type: String,
            default: '',
        },
        /**
         * Предзагрузка: auto, metadata, none
         */
        preload: {
            type: String,
            default: 'metadata',
        },
        /**
         * Автовоспроизведение, работает только если
         * пользователь уже куда-то кликал
         * после загрузки страницы.
         */
        autoplay: {
            type: Boolean,
            default: false,
        },
        /**
         * Отображать нативный html5-плеер
         */
        //todo нужно сделать - падает с ошибками
        native: {
            type: Boolean,
            default: false,
        },
        /**
         * Продолжительность в секундах
         */
        duration: {
            type: Number,
            default: 0,
        },

        /**
         * Секции: [ { start: 0, end: 50, text: 'Оператор' } ]
         */
        sections: {
            type: Array,
            default: () => ([]),
        },

        /**
         * Перемотка плеера
         * currentTime - секунды
         * flag - чтобы значение проперти не кешировалось. Должен иметь измененное значение при каждом вызове
         */
        rewind: {
            type: Object,
            default: () => ({
                currentTime: 0,
                flag: true,
            }),
        },
    },

    data() {
        return {
            // Готов для воспроизведения
            ready: false,
            // Отображение текущей точки
            currentLocal: '00:00',
            // Отображение продолжительности
            durationLocal: '00:00',
            // Продолжительность после загрузки файла
            durationValue: 0,
            // Статус плеера
            status: 'pause',
            // Повторять проигрывание
            repeat: false,
            // Громкость
            volume: 100,
            // Объект плеера HTMLAudioElement
            player: {},
            // Инициализирован ли плеер
            initialized: false,
            // Загружен ли файл
            loaded: false,
            // Ширина прогресс-бара в процентах
            progress: 0,
            // Показывать временную точку при наведении
            displayCurrentBar: false,
            // Отображение времени при наведении
            currentBarLocal: '00:00',
            // Скорость воспроизведения
            speed: 1,
            // Ширина трека плеера
            barWidth: 0,
            // Секция на которую навели
            currentSection: null,
            // Массив секций
            sectionsLocal: [],
            // Какие скорости можно выбрать
            speedOptions: [0.5, 1, 1.2, 1.5, 2],
        };
    },

    watch: {
        rewind: {
            deep: true,
            handler(value){
                this.getTimeFormat(value.currentTime);
                this.player.currentTime = value.currentTime;
                this.player.play();
            }
        },

        volume() {
            this.player.volume = this.volume / 100;
            this.updateVolume();
        },

        speed() {
            this.player.playbackRate = this.speed;
        },

        durationValue() {
            this.durationLocal = this.getTimeFormat(this.durationValue);
            this.updateBarWidth();
            this.updateSections();
        },
    },

    created() {
        this.player = this.$refs.player;
    },

    mounted() {
        this.init();

        if (this.autoplay) {
            this.play();
        }

        this.ready = true;
    },

    beforeUnmount() {
        this.destroy();
    },

    methods: {
        setCurrentSection(section) {
            this.currentSection = section.empty ? null : section;
        },

        updateSections() {
            const list = this.sections.map((section) => {
                let start = Math.round(
                    (section.start / this.durationValue) * 100
                );
                let end = Math.round((section.end / this.durationValue) * 100);
                let width = Math.abs(end - start);

                if (end > 100) {
                    end = 101;
                }

                if (width + start > 101) {
                    width = 101 - start;
                }

                return {
                    ...section,
                    start,
                    end,
                    width,
                };
            });

            const ranges = [];

            if (list.length) {
                list.forEach((range, index) => {
                    if (index === 0) {
                        if (range.start !== 0) {
                            ranges.push({
                                start: 0,
                                width: range.start,
                                empty: true,
                            });
                        }

                        ranges.push(range);
                    } else {
                        const last = ranges[ranges.length - 1];

                        if (last.end !== range.start) {
                            ranges.push({
                                start: last.end,
                                end: range.start,
                                width: Math.abs(range.start - last.end),
                                empty: true,
                            });
                        }

                        ranges.push(range);

                        if (index === list.length - 1) {
                            if (range.end < 100) {
                                ranges.push({
                                    start: range.end,
                                    end: 101,
                                    width: Math.abs(101 - range.end),
                                    empty: true,
                                });
                            }
                        }
                    }
                });
            } else {
                ranges.push({
                    start: 0,
                    width: 101,
                    empty: true,
                });
            }

            this.sectionsLocal.splice(0, this.sectionsLocal.length);
            this.sectionsLocal.push(...ranges);
        },

        updateBarWidth() {
            this.barWidth = this.$refs.bar.offsetWidth;
        },

        async showCurrentBar(event) {
            this.displayCurrentBar = true;
            await this.$nextTick();
            this.updateCurrentBar(event);
        },

        hideCurrentBar() {
            this.displayCurrentBar = false;
        },

        setCurrentBar(event) {
            const percent = Math.round(
                ((event.offsetX + event.target.offsetLeft) / this.barWidth) *
                    100
            );
            const currentSeconds = Math.round(
                this.durationValue * (percent / 100)
            );
            this.player.currentTime = currentSeconds;
            this.play();
        },

        updateCurrentBar(event) {
            this.displayCurrentBar = true;
            const element = this.$refs.currentBar;
            const percent = Math.round(
                ((event.offsetX + event.target.offsetLeft) / this.barWidth) *
                    100
            );
            const currentSeconds = Math.round(
                this.durationValue * (percent / 100)
            );

            this.currentBarLocal = this.getTimeFormat(currentSeconds);
            element.style.left = `${percent}%`;
        },

        getTimeFormat(value) {
            if (isNaN(value)) {
                return '00:00';
            }
            let secNum = Math.floor(value);
            let hours = Math.floor(secNum / 3600);
            let minutes = Math.floor((secNum - hours * 3600) / 60);
            let seconds = secNum - hours * 3600 - minutes * 60;

            let hoursLabel = hours;
            let minutesLabel = minutes;
            let secondsLabel = seconds;

            if (hours < 10) {
                hoursLabel = '0' + hours;
            }
            if (minutes < 10) {
                minutesLabel = '0' + minutes;
            }
            if (seconds < 10) {
                secondsLabel = '0' + seconds;
            }

            if (hours > 0) {
                return `${hoursLabel}:${minutesLabel}:${secondsLabel}`;
            } else {
                return `${minutesLabel}:${secondsLabel}`;
            }
        },

        updateDuration(value) {
            this.durationValue = value;
        },

        updateCurrentTime(value) {
            this.$emit('current-time', value);
            this.currentLocal = this.getTimeFormat(value);
        },

        nextSpeed() {
            const length = this.speedOptions.length;
            let index = this.speedOptions.indexOf(this.speed);

            if (index + 1 > length - 1) {
                index = 0;
            } else {
                index += 1;
            }

            this.speed = this.speedOptions[index];
        },

        toggleVolume() {
            if (this.volume !== 0) {
                this.volume = 0;
            } else {
                this.volume = 100;
            }
        },

        updateVolume() {
            const volume = this.$refs.volume;
            const wrapper = this.$refs.volumeWrap;
            const content = this.$refs.volumeContent;
            const position = wrapper.getBoundingClientRect();
            const windowWidth = window.innerWidth;
            content.style.marginLeft = '0px';
            volume.style.background = `linear-gradient(to right, #659be0 0%, #659be0 ${this.volume}%, #dcdcdc ${this.volume}%, #dcdcdc 100%)`;

            const offset =
                windowWidth - (position.left + position.width / 2 + 62);

            if (offset < 0) {
                content.style.marginLeft = `${offset}px`;
            }
        },

        destroy() {
            window.removeEventListener('resize', this.updateBarWidth);
        },

        init() {
            this.updateBarWidth();
            window.addEventListener('resize', this.updateBarWidth);

            this.player = this.$refs.player;
            this.player.volume = this.volume / 100;

            this.updateVolume();
            this.updateDuration(this.duration);
            this.updateSections();

            this.player.playbackRate = this.speed;

            this.player.addEventListener('play', () => {
                this.status = 'play';
                this.updateDuration(this.player.duration);
            });

            this.player.addEventListener('timeupdate', () => {
                const currentTime = this.player.currentTime;
                const duration = this.player.duration;
                this.progress = (currentTime / duration) * 100;
                this.updateCurrentTime(currentTime);
            });

            this.player.addEventListener('pause', () => {
                this.status = 'pause';
            });

            this.player.addEventListener('ended', () => {
                if (!this.repeat) {
                    this.player.currentTime = 0;
                }
            });

            this.player.addEventListener('canplay', async () => {
                this.durationValue = Math.round(this.player.duration);
                await this.$nextTick();
                this.updateBarWidth();
                this.updateSections();
            });

            this.player.addEventListener('loadedmetadata', () => {
                if (!isNaN(this.player.duration)) {
                    this.durationValue = Math.round(this.player.duration);
                }
            });

            if (!isNaN(this.player.duration)) {
                this.durationValue = Math.round(this.player.duration);
            }
        },

        toggle() {
            if (this.status === 'play') {
                this.player.pause();
            } else {
                this.player.play();
            }
        },

        async play() {
            await this.$nextTick();
            await this.player.play();
        },

        pause() {
            this.player.pause();
        },
    },
};
</script>

<style lang="stylus">
.v-player
    transition: all 0.2s ease-out
    opacity: 0.5

    &--ready
        opacity: 1

    &__wrapper
        background-color: #fff
        padding: 12px
        border: 1px solid #e5e5e5

    &__speed
        display: flex
        &-option
            display: flex
            align-items: center
            font-size: 12px
            font-weight: 600
            height: 28px
            padding: 0 4px
            color: rgb(165, 165, 165)
            transition: all 0.2s ease-out
            cursor: pointer

            &--active
                color: #659be0




    &__volume
        position: relative
        z-index: 2
        display: flex
        align-items: center
        height: 28px

        &-input
            cursor: pointer
            -webkit-appearance: none
            appearance: none
            width: 100px
            height: 4px
            outline: none
            background-color: #dcdcdc
            border-radius: 2px

            &::-webkit-slider-thumb
                -webkit-appearance: none
                appearance: none
                width: 16px
                height: 16px
                background: #659be0
                border-radius: 50%




    @keyframes player-drop
        0%
            opacity: 0

        100%
            opacity: 1


    &__drop
        position: relative

        &-text
            position: relative
            z-index: 2
            background-color: #fff
            line-height: 28px
            color: rgb(179, 179, 179)
            transition: all 0.2s ease-out


        &-content
            user-select: none
            display: none
            animation: player-drop 0.15s ease-out
            position: absolute
            bottom: 100%
            position: absolute
            left: 50%
            width: 128px
            height: 16px
            transform: translate(-50%, 16px)

            &:before
                content: ''
                position: absolute
                bottom: 0
                left: 50%
                transform: translate(-50%, -4px)
                width: 0
                height: 0
                z-index: 2
                border-style: solid
                border-width: 8px 8px 0 8px
                border-color: #fff transparent transparent transparent



        &-wrap
            position: absolute
            left: 50%
            bottom: 12px
            z-index: 1
            transform: translate(-50%, 0%)
            background-color: #fff
            padding: 0 12px
            border-radius: 4px
            box-shadow: -4px 4px 12px 0 rgba(#000, 0.1)


        &:hover &-content
            display: block



    &__row
        display: flex
        height: 44px


    &__center
        flex-grow: 1
        padding-left: 12px
        padding-right: 4px
        display: flex
        align-items: center
        position: relative


    &__left
        display: flex
        align-items: center


    &__right
        display: flex
        align-items: center


    &__control
        cursor: pointer
        width: 32px
        height: 48px
        display: flex
        align-items: center
        justify-content: center
        color: rgb(165, 165, 165)
        font-weight: 600
        transition: all 0.2s ease-out
        user-select: none
        opacity: 0.7

        &:hover
            opacity: 1


        &--active
            opacity: 1
            color: #659be0


        &-text
            transition: all 0.2s ease-out


        &-icon
            width: 24px
            height: 24px
            fill: currentColor
            transition: all 0.2s ease-out


        &:active &-icon,
        &:active &-text
            transform: scale(0.8)



    &__bar
        width: 100%
        height: 12px
        padding: 4px 0
        position: relative
        cursor: pointer

        &-current
            font-size: 12px
            font-weight: 600
            padding: 3px 5px
            border-radius: 3px
            position: absolute
            top: -4px
            background-color: #659be0
            transform: translate(-50%, -100%)
            color: #fff
            white-space: nowrap
            text-align: center

            &-label
                margin-bottom: 4px


            &:before
                content: ''
                position: absolute
                top: 100%
                left: 50%
                transform: translate(-50%, 0)
                width: 0
                height: 0
                border-style: solid
                border-width: 4px 4px 0 4px
                border-color: #659be0 transparent transparent transparent



        &-wrap
            overflow: hidden
            height: 8px
            position: relative
            width: 100%
            background-color: #dcdcdc


        &-section
            position: absolute
            z-index: 2
            top: 50%
            height: 12px
            transform: translate(0%, -50%)
            transition: all 0.1s linear
            border-top: 4px solid #fff
            border-bottom: 4px solid #fff
            border-right: 4px solid #fff

            &:last-child
                border-right: 0px


            &--active
                &:hover
                    border-top: 0px solid #fff
                    border-bottom: 0px solid #fff




        &-fill
            position: absolute
            top: 0
            left: 0
            height: 100%
            background-color: #659be0



    &__play
        width: 40px
        height: 40px
        border-radius: 50%
        background-color: #659be0
        cursor: pointer
        color: #fff
        display: flex
        align-items: center
        justify-content: center
        transition: all 0.2s ease-out
        user-select: none

        &:hover
            background-color: #337ab7


        &:active
            transform: scale(0.85)


        &-icon
            width: 32px
            height: 32px
            fill: currentColor



    &__title
        position: absolute
        top: 2px
        left: 12px
        font-size: 12px
        color: rgb(179, 179, 179)
        font-weight: 600
        white-space: nowrap
        overflow: hidden
        right: 12px
        text-overflow: ellipsis


    &__time
        font-size: 12px
        color: rgb(179, 179, 179)
        position: absolute
        bottom: 0
        font-weight: 600

        &--current
            left: 12px


        &--duration
            right: 4px
</style>
