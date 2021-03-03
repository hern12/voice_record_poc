const btn = document.getElementById("record_sound");
const stopBtn = document.getElementById("record_sound_stop");
stopBtn.style.display = "none";
btn.addEventListener("click", allowRecord);

let record_time = 1;

function allowRecord() {
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();
      console.log("start record");

      //hide record btn and show stopBtn
      btn.style.display = "none";
      stopBtn.style.display = "block";

      //interval show record time text
      const recordTimeTxt = document.getElementById("record_time");
      const interval = setInterval(function () {
        record_time++; //increase record time
        recordTimeTxt.innerText = `Record time ${record_time}`;
      }, 1000);

      const audioChunks = [];
      mediaRecorder.addEventListener("dataavailable", (event) => {
        audioChunks.push(event.data);
      });
      mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks);
        let formdata = new FormData();
        formdata.append("soundBlob", audioBlob, "myfiletosave.mp4");
        var serverUrl = "/uploader";
        var httpRequestOptions = {
          method: "POST",
          body: formdata,
          headers: new Headers({
            enctype: "multipart/form-data",
          }),
        };
        fetch(serverUrl, httpRequestOptions);
      });
      stopBtn.addEventListener("click", function () {
        console.log("stop record");
        mediaRecorder.stop();

        //show record btn and hide stopBtn
        btn.style.display = "block";
        stopBtn.style.display = "none";
        //clear record time
        record_time = 0;
        clearInterval(interval);
        recordTimeTxt.innerText = `Record time ${record_time}`;
      });
    })
    .catch((err) => {
      alert("Please allow record");
    });
}
