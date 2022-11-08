function player_obj(id, call_json, comments_json)
{

	var seekOffset = 0;
	var event_x = 0;
	var signaling_segments = [];
	var file_segments = [];
	var dtmf_segments = [];
	var functions_segments = [];
	var check_sig_start = [];
	var check_file_start = [];
	var check_dtmf_start = [];
	var check_func_start = [];
	var chartData = []; //массив данных графика
	var chartData2 = []; //массив комментариев
	var width = 0;
	var width1 = 0;
	var delta = 0;
	var chart = [];
	var isPaused = true;
	var isReady = true;
	var isOk = false;
	var isEdit = false;
	var bottom_bar_width = 0;
	var step = 0;
	var funcDuration = 0;
	var duration = 0;
	var char_div_height = 0;
	var chart_block_height = 50; //размер ширины одного блока по умолчанию
	var off_set = 0; //разница общего времени в json и временем с файла
	var isPressPlay=false;// если нажали плей кнопку
	var seekClick=false;

	init_visual(id, call_json, comments_json);

	function init_visual(id, call_json, comments_json)
	{

		chartData2=comments_json;
		var json = call_json;
		off_set = json.duration - $("#"+id).data("jPlayer").status.duration;
		console.log("off_set="+off_set);
		funcDuration = json.duration;
		//funcDuration = $("#"+id).data("jPlayer").status.duration;

		duration = $("#"+id).data("jPlayer").status.duration;


		console.log(json.duration);
		console.log(duration);

		var events=json.events;
		var functions=json.functions;
		width = $('#chartdiv'+id).width();
		$("#title"+id).text(json.file_name);


		setInterval(function () {
			isPaused = $('#'+id).data().jPlayer.status.paused;
		}, 500);

		setInterval(function () {
			isReady = $('#'+id).data().jPlayer.status.waitForPlay;
		}, 500);


		$("#session"+id).text("Session ID: " + json.session_id);

		//проходим по всему разделу событий json
		for (var n in events){
			if (events[n].group == 'signaling') {
				if (events[n].stop == 'N/A' || events[n].stop<1) {

					signaling_segments.push({"start": events[n].start, "duration": 0, "details":  events[n].details, "event": events[n].event,"color": "#46615e","bullet": "diamond"});

					} else {
					//dur = events[n].stop;
					dur=events[n].stop-events[n].start;

					if (dur==0) dur=1;

					if (!checkStart(check_sig_start, events[n].start)) {
						check_sig_start.push(events[n].start);
						signaling_segments.push({"start": events[n].start, "duration": dur, "details": events[n].details, "event": events[n].event});
						} else {
						signaling_segments.push({"duration": dur, "details": events[n].details, "event": events[n].event});
					}

				}
			}
			if (events[n].group == 'file') {

				if (events[n].stop == 'N/A' || events[n].stop<1) {
					file_segments.push({"start": events[n].start, "duration": 0, "details":  events[n].details, "event": events[n].event,"color": "#46615e","bullet": "diamond"});

					}else{

					if (events[n].details) {
						det = events[n].file + "(" + events[n].details + ")";
						} else {
						det = events[n].file;
					}

					//dur = events[n].stop;
					dur=events[n].stop-events[n].start;

					if (dur==0) dur=1;

					if (!checkStart(check_file_start, events[n].start)) {
						check_file_start.push(events[n].start);
						file_segments.push({"start": events[n].start, "duration": dur, "details": det, "event": events[n].event});
						} else {
						file_segments.push({"duration": dur, "details": det, "event": events[n].event});
					}

				}
			}
			if (events[n].group == 'dtmf') {
				if (events[n].stop == 'N/A' || events[n].stop<1) {
					dtmf_segments.push({"start": events[n].start, "duration": 0, "details": events[n].details, "event": events[n].event,"color": "#46615e","bullet": "diamond"});
					} else {
					//dur = events[n].stop;
					dur=events[n].stop-events[n].start;

					if (dur == 0) dur = 1;

					if (!checkStart(check_dtmf_start, events[n].start)) {
						check_dtmf_start.push(events[n].start);
						dtmf_segments.push({"start": events[n].start, "duration": dur, "details": events[n].details, "event": events[n].event});
						} else {
						dtmf_segments.push({"duration": dur, "details": events[n].details, "event": events[n].event});
					}

				}

			}
		}

		//проходим по всему разделу функций json
		for (var n in functions) {

			if (functions[n].stop == 'N/A' || functions[n].stop<1) {

				functions_segments.push({"start": functions[n].start, "duration": 0, "details": functions[n].details, "event": functions[n].fname,"color": "#46615e","bullet": "diamond"});


				} else {

				dur = functions[n].stop - functions[n].start;

				if (dur == 0) dur = 1;



				if (!checkStart(check_func_start, functions[n].start)) {
					check_func_start.push(functions[n].start);
					functions_segments.push({"start": functions[n].start, "duration": dur, "details": functions[n].details, "event": functions[n].fname});
					console.log(functions[n].start + '/' + dur);
					} else {
					functions_segments.push({"duration": dur, "details": functions[n].details, "event": functions[n].fname});
				}

			}

		}

		//формируем размер по высоте графика отностельно наличия данных в блоках
		if (signaling_segments.length > 0) {
			chartData.push({"category": "signaling", "segments": signaling_segments});
			char_div_height = chart_block_height;
		}
		if (file_segments.length > 0) {
			chartData.push({"category": "file", "segments": file_segments});
			char_div_height = chart_block_height * 2;
		}
		if (dtmf_segments.length > 0) {
			chartData.push({"category": "dtmf", "segments": dtmf_segments});
			char_div_height = chart_block_height * 2;
		}
		if (functions_segments.length > 0) {
			chartData.push({"category": "function", "segments": functions_segments});
			char_div_height = chart_block_height * 2;
		}
		//назначаем размер нашему диву графика
		$('#chartdiv'+id).css({height: char_div_height});
        //$('#chartdiv'+id).css({"max-width": width});
		chart = AmCharts.makeChart("chartdiv"+id, {
			"type": "gantt",
			"marginRight": 70,
			"period": "ss",
			"valueAxis": {
				"type": 'timestamp',
				"minimum": 0,
				"maximum": funcDuration,
				"axisAlpha": 0,
				"gridAlpha": 0.1,
				"labelsEnabled": false,
				"gridCount": 30,
				"autoGridCount": false,
				"duration": "ss",
				"strictMinMax": true,
			},
			"categoryAxis": {
				"axisAlpha": 0,
			},
			"brightnessStep": 8,
			"graph": {
				"fillAlphas": 1,
				"dateFormat": "JJ:SS",
				"balloonText": "",
				"title": "duration",
				"valueField": "duration",
				"type": "line",
				"lineColorField": "lineColor",
				"fillColorsField": "lineColor",
				"fillAlphas": 0.5,
				"lineThickness": 1,
				"bullet": "square",
				"bulletBorderThickness": 1,
				"bulletBorderAlpha": 1,
				"bulletField": "bullet",
				"bulletSize": 8,
				"bulletColor":"#ff0000",
				"balloonFunction" : adjustBalloonText
			},
			"rotate": true,
			"dataDateFormat": "YYYY-MM-DD",
			"categoryField": "category",
			"segmentsField": "segments",
			"startDate": "2016-08-24",
			"startField": "start",
			"endField": "end",
			"durationField": "duration",
			"dataProvider": chartData,
			"chartCursor": {
				"valueBalloonsEnabled": false,
				"cursorAlpha": 0,
				"valueLineBalloonEnabled": false,
				"valueLineEnabled": true,
				"valueZoomable": false,
				"zoomable": false,
				"cursorPosition": "start",
				"listeners": [{"event": "moved", "method": handleEvent3}, {"event": "render", "method": handleClick}, {
					"event": "onHideCursor",
					"method": handleEvent4
				}, {"event": "onShowCursor", "method": handleEvent5}]

			},
		});
		chart.addListener("clickGraphItem", handleClick2);
		//showComments();
		console.log(chart);
		chart.gridCount = Math.floor(chart.plotAreaWidth / funcDuration);
		//////////////////////////////////////////////
		function adjustBalloonText(graphDataItem, graph){

			var start=graphDataItem.graph.customData.start;
			var duration=graphDataItem.graph.customData.duration;
			var event=graphDataItem.graph.customData.event;
			var category=graphDataItem.serialDataItem.category;
			var details=graphDataItem.serialDataItem.details;

			if(category=="signaling") category="Сигнализация: ";
			if(category=="file") category="Файл: ";
			if(category=="dtmf") category="Сигнализация: ";
			if(category=="function") category="Функция: ";


			if(duration>0){
				duration="Длительность: "+duration.toFixed(1) +"<br>";
			}else duration="";

			if(details){
				details="Подробности: "+details+"<br>";
			}else details="";


			return "<div align='left'><b>"+category+event+"</b><br>Начало: "+start.toFixed(1)+"<br>"+duration+"</div>";

		}

		/////////////////////////////////////////////
		//позицируем линию по дефолту
		var chartp = $("#chartdiv"+id).position();

		console.log(chartp.left);

		$('#line'+id).css({
			left: chartp.left+chart.marginLeft,
			height: chart.plotAreaHeight,
			top: chartp.top + chart.marginTop
		});
		//позицируем добавить комментарий по дефолту
		var line_post = $('#line'+id).position();
		$('#add_comment'+id).css({
			left: line_post.left - $('#add_comment'+id).width() / 2 + 2,
			top: line_post.top - 28
		});
		//проверяем оффсет
		$("#"+id).bind($.jPlayer.event.play, function (event) {

            alert(event.jPlayer.status.currentTime);

			if (!isPressPlay || event.jPlayer.status.currentTime <= 0 ) {

				if(off_set<0){
					$("#"+id).jPlayer("play",-off_set);
				}else{
					$("#"+id).jPlayer("play");
				};

				isPressPlay=true;

			}

		});

		//привязываем лини к событию играния плеера
		$("#"+id).bind($.jPlayer.event.timeupdate, function (event) { // Add a listener to report the time play began
			//$("#log").text("Play began at time = " + event.jPlayer.status.currentTime);

			var chartp = $("#chartdiv"+id).position();




			//if(!isPressPlay){





			$('#line'+id).css({
				left:(chartp.left+chart.marginLeft+chart.plotAreaWidth * (event.jPlayer.status.currentTime+off_set)/ funcDuration)-2,
				height: chart.plotAreaHeight,
				top: chartp.top + chart.marginTop
			});



		//}



		/*
			if(seekClick){


			$('#line'+id).css({
			left:chart.marginLeft+(chart.plotAreaWidth+10) * event.jPlayer.status.currentTime/ funcDuration,
			height: chart.plotAreaHeight,
			top: chartp.top + chart.marginTop
			});


			alert('77777777777');

			//seekClick=false;
			}

		*/
	//}else {
	//	$('#line'+id).css({
	//	left: chart.plotAreaWidth * event.jPlayer.status.currentTime / funcDuration,
	//height: chart.plotAreaHeight
	//top: chartp.top + chart.marginTop
//});



var line_post = $('#line'+id).position();

//}
$('#add_comment'+id).show();

$('#add_comment'+id).css({
	left: line_post.left - $('#add_comment'+id).width() / 2 + 2,
	top: line_post.top - 28
});

});

//назначаем клик на кнопку добавить комментарий
 /*
$("#add_comment"+id).click(function () {
	isEdit = false;

	$('[data-toggle="popover"]').popover('destroy');
	setTimeout(function () {
		createPopover();
	}, 200);
	var pos = $("#add_comment"+id).position();
	$('#popover'+id).css("left", pos.left - 50);
	$('#popover'+id).css("top", 280);
	if (!isReady && !isPaused) {
		$("#"+id).jPlayer("pause");
		isOk = true;
		} else {
		isOk = false;
	}
});*/

//по событию ресайза всё расставляем как нам надо
$(window).bind('resize', function (e) {
	window.resizeEvt;
	$(window).resize(function () {
		clearTimeout(window.resizeEvt);
		window.resizeEvt = setTimeout(function () {

			/*console.log("wr-"+$('#report_table').width());
            $('#chartdiv'+id).css({"max-width": $('#report_table .tab-pane.active.in').width() - 20});
            $('#chartdiv'+id).css({"width": $('#report_table .tab-pane.active.in').width() - 20});*/
			chart.validateData();
			chart.validateSize();


			//showComments();
			var chartp = $("#chartdiv"+id).position();
			$('#line'+id).css({
				left: chartp.left+chart.marginLeft,
				height: chart.plotAreaHeight,
				top: chartp.top + chart.marginTop
			});
			var line_post = $('#line'+id).position();
			$('#add_comment'+id).css({
				left: line_post.left - $('#add_comment'+id).width() / 2 + 2,
				top: line_post.top - 28
			});
		}, 250);
	});
});
}

function handleEvent4(event) {
	//$('#seek').hide();
}

//по событию он маусе овер на графике показывает время бегунок
function handleEvent5(event) {
	var id = $(event.chart.chartDiv.parentElement.parentElement).data("id");
	$('#seek'+id).show();
}

//по событию движения курсора графика двигаем бегунок времени 
function handleEvent3(event) {
	//event.target.valueLineAxis.balloon.text=calculateAndInitTime(Math.floor(seekOffset));
	//iterate(event.target) ;
	var id = $(event.chart.chartDiv.parentElement.parentElement).data("id");
	bottom_bar_width = event.chart.plotAreaWidth;
	seekOffset_t = funcDuration * event.x / bottom_bar_width;

	event_x = event.x;

	var chartp=$("#chartdiv"+id).position();

	$('#seek'+id).html(calculateAndInitTime(Math.floor(seekOffset_t)));
	$('#seek'+id).css({
		left: event.x + $('#seek'+id).width() + chartp.left-8,
		top: chartp.top + event.chart.plotAreaHeight + $('#seek'+id).height()-1
	});


}
//ну если кликнули по блоку графика
function handleClick2(event) {
	//var info = event.chart.getDevInfo();
	//console.log(event.chart);
	//  console.log(event.chart);
	//$("#jquery_jplayer_1").jPlayer("stop");

	var id = $(event.chart.chartDiv.parentElement.parentElement).data("id");

	var chartp = $("#chartdiv"+id).position();
	/*
		$('#line'+id).css({
		height: chart.plotAreaHeight,
		top: chartp.top + chart.marginTop,
		left: chart.mouseX+chartp.left
		})

		var line_post = $('#line'+id).position();

		$('#add_comment'+id).css({
		left: line_post.left - $('#add_comment'+id).width() / 2 + 2,
		top: line_post.top - 28,
		});

	*/

	//$("#"+id).jPlayer("pause");

	$('#line'+id).show();

	/*
		if(off_set<0){
		funcDuration_of=funcDuration+off_set*(-1);
		}else{
		funcDuration_of=funcDuration+off_set;
	};*/

	functTime= funcDuration * event_x / chart.plotAreaWidth;



	seekOffset= functTime-off_set;

	console.log("fff="+functTime+"/"+seekOffset+"/"+off_set);

	//		$('#seek'+id).html(calculateAndInitTime(Math.floor(seekOffset_t)));

	//int(funcDuration * (mouseX - bottom_bar.timeline.x) / bottom_bar.timeline.all.width);

	///if (seekOffset >=off_set ) {



	if (!isPressPlay) { isPressPlay=true;}


	$("#"+id).jPlayer("play", seekOffset);






}

//по клику на комментарий по айди его,показываем и редактируем поповер 
function handleClickEdit(id) {
	var pp = $('#com_' + id).position();
	isEdit = true;
	$('[data-toggle="popover"]').popover('destroy');
	var idd = $(chart.chartDiv.parentElement.parentElement).data("id");
	setTimeout(function () {
		createPopoverEdit();

		$('#popover'+idd+' .popover-content #autor').val(chartData2[id]["autor"]);
		$("#msg").val(chartData2[id]["comment"]);
		$('#popover'+idd+' .popover-content #id').val(chartData2[id]["id"]);

	}, 200);
	$('#popover'+idd).css("left", pp.left - 132 / 2 + 45);
	$('#popover'+idd).css("top", $('#chartdiv'+idd).height() / 2 - 30);
	if (!isReady && !isPaused) {
		$("#"+idd).jPlayer("pause");
		isOk = true;
		} else {
		isOk = false;
	}
}



function handleClick(event)
{
	//alert(event.item.category + ": " + event.item.values.value);
	//console.log(event.item.values);

	//console.log(event.item.dataContext);
	// console.log( event.item.graph);


	//console.log(event.item.graph.valueAxis.balloon.text)

	///	iterate(event.item.graph);

	//console.log(event.item.graph.valueAxis.balloon.text)



}

function handleClick(event)
{
	//alert(event.item.category + ": " + event.item.values.value);
	//console.log(event.item.values);

	//console.log(event.item.dataContext);
	// console.log( event.item.graph);


	//console.log(event.item.graph.valueAxis.balloon.text)

	///	iterate(event.item.graph);




	//console.log(event.item.graph.valueAxis.balloon.text)



}
///функция пересчёта секунд в минути секунды
function calculateAndInitTime(secondsDuration) { //transformtime
	var totalTime = '';
	var minutes = 0;
	var seconds = 0;
	var stringMinutes = '';
	var stringSeconds = '';
	minutes = Math.floor(secondsDuration / 60);
	seconds = Math.floor(secondsDuration - (60 * minutes));

	if (minutes < 10) {
		stringMinutes = '0' + minutes;
		} else {
		stringMinutes = '' + minutes;
	}
	if (seconds < 10) {
		stringSeconds = '0' + seconds;
		} else {
		stringSeconds = '' + seconds;
	}

	totalTime = stringMinutes + ':' + stringSeconds;

	return totalTime;
}

///функция проверку совпадения времени старта
function checkStart(arr, val) {

	for (var i = 0; i < arr.length; i++) {
		if (arr[i] === val) {
			return true;
		}
	}

	return false;
}

///функция прикольно отображения любого обьекта
function iterate(obj) {
	var walked = [];
	var stack = [{obj: obj, stack: ''}];
	while (stack.length > 0) {
		var item = stack.pop();
		var obj = item.obj;
		for (var property in obj) {
			if (obj.hasOwnProperty(property)) {
				if (typeof obj[property] == "object") {
					var alreadyFound = false;
					for (var i = 0; i < walked.length; i++) {
						if (walked[i] === obj[property]) {
							alreadyFound = true;
							break;
						}
					}
					if (!alreadyFound) {
						walked.push(obj[property]);
						stack.push({obj: obj[property], stack: item.stack + '.' + property});
					}
				}
				else {
					console.log(item.stack + '.' + property + "=" + obj[property]);
				}
			}
		}
	}
}




///прячем попапер
function hide() {

	isEdit = false;

	$('[data-toggle="popover"]').popover('hide');

	var id = $(chart.chartDiv.parentElement.parentElement).data("id");

	if (!isReady && isPaused && isOk) $("#"+id).jPlayer("play");

}

///удаляем комментарий
    /*
function del() {

	var idd = $(chart.chartDiv.parentElement.parentElement).data("id");
	var id = parseInt($('#popover'+idd+' .popover-content #id').val());

	alasql('CREATE localStorage DATABASE IF NOT EXISTS test');
	alasql('ATTACH localStorage DATABASE test');
	alasql('USE test');

	alasql('CREATE TABLE IF NOT EXISTS users (id number,time string,visits number,autor string,comment string,date string)');
	alasql('SELECT * INTO users FROM ?', [chartData2]);

	alasql('DELETE FROM users WHERE id=' + id);

	chartData2 = alasql('SELECT * FROM users ORDER BY time');

	/////////////////////////////////////////////////////////////////////////
	//chart2.dataProvider = chartData2;

	//chart2.validateData();

	console.log(JSON.stringify(chartData2));

	showComments();
	//////////////////////////////////////////////////////////////////////////
	alasql('DROP TABLE users');
	alasql('DETACH DATABASE test');

	out = JSON.stringify(chartData2);

	isEdit = false;

	///сохраняем комментарии в файл
	$.ajax({
		type: "POST",
		url: "controller.php",
		data: {save: out},
		success: function (data) {

		},
		error: function () {
			alert('error handing here');
		}
	});


	if (!isReady && isPaused && isOk) $("#jquery_jplayer_1").jPlayer("play");


	$('[data-toggle="popover"]').popover('hide');

}
*/
///чистим слой и отображем все комментарии с массива
/*
function showComments() {

	$("#comments_div").empty();

	chart.validateSize();

	var step = chart.plotAreaWidth / funcDuration;

	for (var i = 0; i < funcDuration; i++) {


		for (j = 0; j < chartData2.length; j++) {


			if (typeof(chartData2[j]["time"]) !== 'undefined') {


				if (chartData2[j]["time"] === calculateAndInitTime(i)) {

					var val = step * i;

					$('#comments_div').append('<img src="css/comment.png" data-toggle="tooltip" id="com_' + j + '" width="18" height="18" style="left:' + (val + step / 2) + 'px;top:0;position:absolute;z-index:' + i + 'width:18px;height:18px;cursor:pointer;"  data-placement="bottom" title="<div align=\'left\' style=\'word-wrap: break-word;\' ><b>Дата:</b> ' + chartData2[j]["date"] + '<br><b>Cекунда:</b> ' + chartData2[j]["time"] + '<br><b>Aвтор:</b> ' + chartData2[j]["autor"] + '<br>' + chartData2[j]["comment"] + '</div>" onClick="handleClickEdit(' + j + ')" >');


				}


			}


		}


	}


	$(document.body).tooltip({selector: '[data-toggle="tooltip"]', html: true});

}
*/
///отображаем попапер редактирования комментария
/*
function createPopoverEdit() {


	$('[data-toggle="popover"]').popover({
		html: true,
		title: "Редактирование",
		placement: 'bottom',
		trigger: 'manual',
		content: '<div class="form-group"><input type="text" class="form-control" placeholder="Автор" id="autor" ></div><div class="form-group"><textarea maxlength="150" class="form-control" placeholder="Комментарий" name="msg" id="msg" cols="5" rows="3" style="resize:none;"></textarea></div><div class="form-group"><button type="button" id="edit_butt" class="btn btn-default btn-block" >Сохранить</button><button type="button" id="del_butt" class="btn btn-default btn-block" onClick="del();" >Удалить</button><button type="button" id="сancel_butt" class="btn btn-default btn-block" onClick="hide();" >Отменить</button></div><input type="hidden" id="id" value="0" >'
		}).parent().delegate('button#edit_butt', 'click', function (event) {

		event.stopImmediatePropagation();
		event.stopPropagation();
		event.preventDefault();

		$(this).unbind('click');

		var idd = $(chart.chartDiv.parentElement.parentElement).data("id");

		var autor = $('#popover'+idd+' .popover-content #autor').val();

		var msg = $("#msg").val();


		var id = parseInt($('#popover'+idd+' .popover-content #id').val());


		for (var i = 0; i < chartData2.length; i++) {

			if (chartData2[i].id === id) {
				chartData2[i].autor = autor;
				chartData2[i].comment = msg;
			}

		}
		///////////////////////////////////////////////////////////////////////

		showComments();
		//////////////////////////////////////////////////////////////////////
		out = JSON.stringify(chartData2);

		isEdit = false;

		var id = $(chart.chartDiv.parentElement.parentElement).data("id");

		if (!isReady && isPaused && isOk) $("#"+id).jPlayer("play");

		///сохраняем комментарии в файл
		$.ajax({
			type: "POST",
			url: "controller.php",
			data: {save: out},
			success: function (data) {

			},
			error: function () {
				alert('error handing here');
			}
		});

		$('[data-toggle="popover"]').popover('hide');


	});


	$('[data-toggle="popover"]').popover('show');


}
*/

///отображаем попапер нового комментария
/*
function createPopover() {


	$('[data-toggle="popover"]').popover({
		html: true,
		title: "Комментарий",
		placement: 'top',
		trigger: 'manual',
		content: '<div class="form-group"><input type="text" class="form-control" placeholder="Автор" id="autor" ></div><div class="form-group"><textarea maxlength="150" class="form-control" placeholder="Комментарий" name="msg" id="msg"></textarea></div><div class="form-group"><button type="button" id="send_butt" class="btn btn-default btn-block" >Добавить</button><button type="button" id="сancel_butt" class="btn btn-default btn-block" onClick="hide();" >Отменить</button></div>'
		}).parent().delegate('button#send_butt', 'click', function (event) {

		event.stopImmediatePropagation();
		event.stopPropagation();
		event.preventDefault();

		$(this).unbind('click');

		var id = $(chart.chartDiv.parentElement.parentElement).data("id");

		var autor = $('#popover'+id+' .popover-content #autor').val();
		var msg = $("#msg").val();
		var seek = $('#seek'+id).text();

		//var pp=$('#line'+id).position();

		//console.log(seek+"/"+calculateAndInitTime(pp.left-77));

		//var visits = 5;
		//var text = $("#infoartist").val();

		msg = msg.replace(/\r?\n/g, '<br />');


		var tmp_time = alasql('SELECT visits FROM ? WHERE time LIKE "' + seek + '"', [chartData2]);

		//if (tmp_time.length>0){

		//var res = alasql('SELECT MAX(visits) AS visits_max FROM ? ORDER by visits DESC LIMIT 1',[tmp_time]);

		//visits=res[0]['visits_max']+1;

	//}else{

	visits=5;


//}


var today = new Date();


var res2 = alasql('SELECT MAX(id) AS id_max FROM ? ORDER by id DESC LIMIT 1', [chartData2]);

if (res2[0]['id_max']) {
	max = res2[0]['id_max'] + 1;
	} else {
	max = 1;
}

if (tmp_time.length == 0) {
	//chartData2.push({"id":max,"time":seek,"visits":visits,"autor":autor,"comment":msg,"date":yyyymmdd(today)});

	alasql('CREATE localStorage DATABASE IF NOT EXISTS test');
	alasql('ATTACH localStorage DATABASE test');
	alasql('USE test');

	alasql('CREATE TABLE IF NOT EXISTS users (id number,time string,visits number,autor string,comment string,date string)');
	alasql('SELECT * INTO users FROM ?', [chartData2]);

	alasql('INSERT INTO users (id,time,visits,autor,comment,date) VALUES (' + max + ',"' + seek + '",' + visits + ',"' + autor + '","' + msg + '","' + yyyymmdd(today) + '")');

	chartData2 = alasql('SELECT * FROM users ORDER BY time');

	alasql('DROP TABLE users');
	alasql('DETACH DATABASE test');

	} else {

	chartData2 = alasql('SELECT * FROM ? ORDER BY time', [chartData2]);
}

//////////////////////////////////////////////////////////////////////////////////////
showComments();
////////////////////////////////////////////////////////////////////////////////////////////////////


isEdit = false;

var id = $(chart.chartDiv.parentElement.parentElement).data("id");

if (!isReady && isPaused && isOk) $("#"+id).jPlayer("play");


out = JSON.stringify(chartData2);

console.log(JSON.stringify(chartData2));

///сохраняем комментарии в файл
$.ajax({
	type: "POST",
	url: "controller.php",
	data: {save: out},
	success: function (data) {

	},
	error: function () {
		alert('error handing here');
	}
});

$('[data-toggle="popover"]').popover('hide');


});

$('[data-toggle="popover"]').popover('show');


}
*/
///получаем текущую дату в формате день месяц год
function yyyymmdd(dateIn) {
	var yyyy = dateIn.getFullYear();
	var mm = dateIn.getMonth() + 1; // getMonth() is zero-based
	var dd = dateIn.getDate();

	if (mm < 10) mm = "0" + mm;

	return String(dd + "." + mm + "." + yyyy); // Leading zeros for mm and dd
}

}