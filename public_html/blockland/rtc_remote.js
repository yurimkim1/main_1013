let remoteChannelId;
let remoteremon;
const remotesocket = io.connect();

var config = {
    credential: {
        serviceId: '94b7f171-5ffa-4723-85e3-7adff3f37479',
        key: 'bd4a6ce8b860a0e968eccd1027af40cfd9a1125d7a645f57ff3a5ca5bcad0d9e'
    },
    view: {
        remote: '#localVideo'
    },
    media: {
        recvonly: true,
        // audio: true,
        // video: true
    }
};

var listener = {
    onCreate(chid) { console.log(`EVENT FIRED: onCreate: ${chid}`); },
    onJoin(chid) { console.log(`EVENT FIRED: onJoin: ${chid}`); $('#remotemystart').prop("disabled", true); $('#remotemystop').prop("disabled", false); },
    onClose() {
        console.log('EVENT FIRED: onClose');
        $('#remotemystop').prop("disabled", true);
        remoteremon.close();
        remoteremon = new Remon({ config, listener });
    },
    onError(error) { console.log(`EVENT FIRED: onError: ${error}`); },
    onStat(result) { console.log(`EVENT FIRED: onStat: ${result}`); }
};

remoteremon = new Remon({ config, listener });

$('#remotemystop').click(function () {
    remoteremon.close();
});

remotesocket.on('channelnametowatch', function (remoteChannelId) {
    console.log("dsadsad", remoteChannelId);


    $('#remotemystart').click(function () {

        remoteremon.joinCast(remoteChannelId);
    })




});