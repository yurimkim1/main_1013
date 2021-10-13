let chatShow = false;
function show_hide(){

    if(chatShow) {
        $('.chat-container').show();
    } else {
        $('.chat-container').hide();
    }

    chatShow = !chatShow;
}
