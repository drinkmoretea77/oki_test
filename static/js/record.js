var input = null,
    _blob = null,
    record_state = 0,
    _stream = null, 
    recorder = null,
    audioContext = null;

function initAudio(){
    if (!audioContext){
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContext = new AudioContext();  
    } 
    navigator.getUserMedia_ = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
    navigator.getUserMedia_({
        "audio": {
            "mandatory": {
                "googEchoCancellation": "false",
                "googAutoGainControl": "false",
                "googNoiseSuppression": "false",
                "googHighpassFilter": "false"
              },
              "optional": []
          },
      }, gotStream, function(e) {
    });
}
function gotStream(stream) {
    _stream = stream;
    input = audioContext.createMediaStreamSource(stream);
    recorder = new Recorder(input);
    recorder.record();
}
function startRecording() {
  _blob=null;
  if (!recorder || !audioContext){
    initAudio();  
  }
  else
    recorder.record();
}
function stopRecording(audio_element, link_element) {
  recorder && recorder.stop();
  set_link(audio_element, link_element);
  recorder.clear();
  if (_stream){
      _stream.getTracks()[0].stop();
  }
  if (audioContext){
    audioContext.close();
    audioContext = null;
  }

}
function clearRecording() {
  _blob=null;
  recorder.clear();
}
function upload(_url, _callback){
  var url = (window.URL || window.webkitURL).createObjectURL(_blob);
  var data = new FormData();
  data.append('file', _blob);
  $.ajax({
    url :  _url,
    type: 'POST',
    data: data,
    contentType: false,
    processData: false,
    success: function(data) {
      _callback;    
    },    
    error: function() {
    }
  });
}
function set_link(audio_element, link_element) {
  recorder && recorder.exportWAV(function(blob) {
    _blob = blob;
    var url = URL.createObjectURL(blob);
    $(audio_element).attr('src', url);
    $(link_element).attr('href', url);
  });
}
