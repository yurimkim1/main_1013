let localChannelId;
const channelNameInput = document.getElementById("channelNameInput");
const channelButton = document.querySelector('#channelBtn');
const localsocket = io.connect();

var config = {
    credential: {
        serviceId: '94b7f171-5ffa-4723-85e3-7adff3f37479',
        key: 'bd4a6ce8b860a0e968eccd1027af40cfd9a1125d7a645f57ff3a5ca5bcad0d9e'
    },
    view: {
        local: '#localVideo'
    },
    midia: {
        video: {
            width: '1280',
            height: '720',
            maxBandwidth: 2000
        },
        sendonly: true,
        audio: true
    }
};

const screenShareOptipon = {
    width: '1280',
    height: '720',
    frameRate: 30,
    maxBandwidth: 2000,
};

var listener = {
    onCreate(chid) {
        console.log(`EVENT FIRED: onCreate: ${chid}`);
        $('#localmystart').prop("disabled", true);
        $('#localmystop').prop("disabled", false);
        localChannelId = chid
    },
    onJoin(chid) { console.log(`EVENT FIRED: onJoin: ${chid}`); },
    onClose() {//통화 종료시 호출
        console.log('EVENT FIRED: onClose');
        $('#localmystart').prop("disabled", false);
        $('#localmystop').prop("disabled", true);
        localremon.close();
        localremon = new Remon({ config, listener });
    },
    onError(error) { console.log(`EVENT FIRED: onError: ${error}`); },
    onStat(result) { console.log(`EVENT FIRED: onStat: ${result}`); }
    // Stat => RemoteMonster가 통화품질 데이터를 5초마다 자동으로 생성합니다. 
    // 통화품질 데이터가 생성될 때 호출됩니다.
    // 통화품질 데이터가 인자로 전달
};

const localremon = new Remon({ config, listener });
$('#localmystart').click(function () {
    console.log('되나안되나');
    // createCast의 인자는 방송채널의 ID입니다. 
    // 실제 서비스에서는 동일한 방송채널의 ID가 아닌,
    // 고유하고 예측이 어려운 ID를 사용해야합니다.
    localChannelId = channelNameInput.value ? channelNameInput.value : getRandomId();
    localremon.createCast(localChannelId);
    localsocket.emit('channelname', localChannelId);
});



$('#localmystop').click(function () {
    localremon.close();
});


$('#screenshare').click(function () {
    localremon.captureScreen(screenShareOptipon.width, screenShareOptipon.height, screenShareOptipon.frameRate, false)
});

function getRandomId() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return Date.now() + "_" + text;
}