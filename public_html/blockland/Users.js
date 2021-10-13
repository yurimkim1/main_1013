 class Users {
     
    constructor(UserNiCK){
        
        const userList = document.getElementById('users');
        const socket = io.connect();
        var users;

        const usernick = UserNiCK;
        $('#name').val(usernick);

        $('.chat').on('click', function(e){ //2
            socket.emit('send message', $('#name').val(), $('#message_send').val());
            $('#message_send').val('');
            $('#message_send').focus();
            e.preventDefault();
          });

        socket.on('receive message', function(msg){
            $('#chatLog').append(msg+'\n');
            $('#chatLog').scrollTop($('#chatLog')[0].scrollHeight);
        });

        socket.on('setId', function (data) {
            //userid = data.id;
            console.log('들고와진다' + data.id);

           socket.emit('nickdata', {nick: usernick, id: data.id});
		});

        socket.on('nicksave', (data)=>{
             userList.innerHTML = `
             ${data.map(data => `<br>${data.nick}`).join(',')}`
              users = data;
            // users.push(user)
            
           
        })

        socket.on('deleteData', (delid) => {
            for (let i = 0; i < users.length; i++) {
                if (users[i].id == delid.id) {
                    console.log("탈퇴유저:", users[i].id);
                    return users.splice(i, 1);
                }
            }
            userList.innerHTML = `
            ${users.map(users => `<br>${users.nick}`).join(',')}`
            
            socket.emit('updateData', users)
            
        })
        
    }





    

// userJoin(id, usernick){

//     const user = {id, usernick};

//     users.push(user);
    

//     return user;
// }

// getCurrentUser(id){
//     return users.find(user => user.id === id);
// }

// userLeave(id){
//     const index = users.findIndex(user => user.id === id);

//     if(index !== -1){
//         return users.splice(index , 1)[0];
        
//     }
// }



}



// module.exports = {
//     userJoin,
//     getCurrentUser,
//     userLeave
// }