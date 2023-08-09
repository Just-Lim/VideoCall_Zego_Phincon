let appID = 1278821728;
let server = "db728d0e341aec229aa69187e47859fc";
let remoteStreamID;
let remoteStream;
let result = false;
const zg = new ZegoExpressEngine(appID, server);
let streamID;
let localStream;
let audioSet = true;
let videoSet = true;
let axiosEndpoint = "http://127.0.0.1:8000/api/room";
let userID;
let roomID;
let token;
let holdRoom = false;
const myTimeout = setInterval(showAxios, 2000);
var localVid = document.getElementById("local-video");
var remoteVid = document.getElementById("remote-video");

//==========================================
// Function Section
//==========================================

async function login() {
  userID = document.getElementById("UserID").value;
  roomID = document.getElementById("RoomID").value;
  token = document.getElementById("Token").value;

  if (userID == "" || roomID == "" || token == "") {
    alert("Invalid input");
    return;
  }

  try {
    await loginRoom(roomID, userID, token);
    postAxios(roomID);
    result = true;
    alert("Success");
  } catch (error) {
    alert("Fail");
  }
}

async function loginRoom(roomId, userId, token) {
  return await zg.loginRoom(
    roomId,
    token,
    {
      userID: userId,
      userName: userId,
    },
    { userUpdate: true }
  );
}

async function startStream() {
  localStream = await zg.createStream(getStreamConfig());

  // const localView = zg.createLocalStreamView(localStream);
  // localView.play("local-video");

  localVid.srcObject = localStream;

  streamID = new Date().getTime().toString();
  zg.startPublishingStream(streamID, localStream);
}

function getStreamConfig() {
  const config = {
    camera: {
      video: videoSet,
      audio: audioSet,
    },
  };
  return config;
}

async function destroyStream() {
  zg.stopPublishingStream(streamID);
  zg.destroyStream(localStream);
}

async function changeVideoSet() {
  if (videoSet == true) videoSet = false;
  else if (videoSet == false) videoSet = true;

  console.log(videoSet);
  reloadStream();
}

async function changeAudioSet() {
  if (audioSet == true) audioSet = false;
  else if (audioSet == false) audioSet = true;

  console.log(audioSet);
  reloadStream();
}

async function reloadStream() {
  destroyStream();
  startStream();
}

async function holdInteraction() {
  updateAxios();
}

async function roomConditionUpdate(db_Data) {
  if (db_Data == 0) {
    this.localVid.play();
    this.remoteVid.play();

    localVid.style.filter = "blur(0)";
    remoteVid.style.filter = "blur(0)";
  } else if (db_Data == 1) {
    this.localVid.pause();
    this.remoteVid.pause();

    localVid.style.filter = "blur(0.5rem)";
    remoteVid.style.filter = "blur(0.5rem)";
  }
}

function postAxios() {
  axios
    .post(axiosEndpoint, {
      roomid: roomID,
    })
    .then((res) => {
      console.log(">>>");
      console.log(res);
    })
    .catch((err) => {
      console.error(err);
    });
}

function showAxios() {
  axios
    .get(axiosEndpoint + "/" + roomID)
    .then((res) => {
      const db_Data = res.data.data;

      if (holdRoom != db_Data.hold) {
        roomConditionUpdate(db_Data.hold);
        holdRoom = db_Data.hold;

        console.log(holdRoom);
      }
    })
    .catch((err) => {
      console.error(err);
    });
}

function updateAxios() {
  axios
    .get(axiosEndpoint + "/" + roomID)
    .then((res) => {
      const db_Data = res.data.data;
      let change;

      if (db_Data.hold == 0) change = 1;
      else if (db_Data.hold == 1) change = 0;

      axios
        .put(axiosEndpoint + "/" + roomID, {
          hold: change,
        })
        .then((res) => {
          console.log(res);
        });
    })
    .catch((err) => {
      console.error(err);
    });
}

//==========================================
// Event Section
//==========================================

zg.on(
  "roomStreamUpdate",
  async (roomID, updateType, streamList, extendedData) => {
    if (updateType == "ADD") {
      remoteStreamID = streamList[0].streamID;

      remoteStream = await zg.startPlayingStream(remoteStreamID);

      // const remoteView = zg.createRemoteStreamView(remoteStream);
      // remoteView.play("remote-video");

      remoteVid.srcObject = remoteStream;
    } else if (updateType == "DELETE") {
      if (streamList[0].streamID === remoteStreamID) {
        zg.stopPlayingStream(remoteStreamID);
        remoteStreamID = null;
      }
    }
  }
);
