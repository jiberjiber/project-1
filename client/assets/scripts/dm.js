//connecting/ setting up client side
let socket = io();

// let sender= $("#from").val()
//step 1) send user name to back-end
// step 2) get user name from and show it to users
// step 3) allow interaction of username(button)
// step 4) send message to specific username
//step 5) save messagess to mysql
//step 6) retieve old messages saved to database

let sendTo='';
let sender='';
let message=''
// let find=$("h5").val()
let notifier=''
//this variable hepls make sure messaged only appends/show on specific screen(stops 3 user messages from showing on the same screen)
let conversationWith=''

$('#sendName').click(function(e){
     //for testing only to be deleted
    e.preventDefault();
    console.log("emiting")
    sender= $("#from").val()
    //emiting here
    socket.emit("user",sender)
    // console.log("this is the result"+ find)
    $(`button[value=${sender}`).hide();
    $("#from").toggle();
    $("#sendName").toggle();
    notifier=sender
})
// socket.on("user",function(data){
//    //for testing only to be deleted
//     console.log("front-end "+data)
//         // $("#online").append($(`<button id=thisUser value=${data}>${data}</button>`))
//         // $(`button[value=${data}`).removeClass( "allUsers" ).addClass( "allUsersOnline" );
//         $(`#onlineNow[value=${data}`).css("visibility", "visible")
//     })
    

//1) on load make an ajax call to get all user names
// get user user username on load and emit it to back end serever
$("document").ready(function(){
    $.ajax({
        url: "/user/allUsers",
        method: "GET",
      })
      .then(function(result){
          
          console.log(result[0].username)
          for (let i=0;i<result.length; i++){
            $("#online").append($(`<button id=thisUser class="list-group-item allUsers" value=${result[i].username}><sub id=onlineNow value=${result[i].username}>Online</sub>${result[i].username}<sub id=newSms value=${result[i].username}>New</sub></button>`))
          }
      })
      
})
// socket.on("user",function(data){
//     console.log("front-end "+data)
//     // $("#online").append($(`<button id=thisUser value=${data}>${data}</button>`))
//     // $(`button[name=${data}`).removeClass( "redDot" ).addClass( "greenDot" );
// })

//on user page load get username


//2) emit
//get user user username on load and emit it to back end serever
// $("document").ready(function(){
//     sender= $("#from").val()
//     socket.emit("user",sender)
// })
// socket.on("user",function(data){
//     console.log("front-end "+data)
//     // $("#online").append($(`<button id=thisUser value=${data}>${data}</button>`))
//     $(`button[name=${data}`).removeClass( "redDot" ).addClass( "greenDot" );
// })


//3 this allow you to message/select a specific user
$('#online').on('click','#thisUser',function(e){
        e.preventDefault();
    let thisUser= $(this).val()
    sendTo=thisUser
    // console.log("sending to "+sendTo)
    // console.log("sender "+sender)
    $("#textingTo").empty(),
    $("#incoming").empty()
    $("#textingTo").append($(`<h3 id=toWho value=${sendTo}>Recipient: ${sendTo}</h3>`))
    conversationWith=sendTo
    //make an ajax call 
    $.ajax({
        url: `/api/msgs/${sender}/${sendTo}`,
        method: "GET",
      })
        .then(function(result) {
          console.log((result[0].message));
          for (let i=0;i<result.length; i++){
            $("#incoming").append($('<p class=dmRetrieve>').text(`${result[i].sender} said: ${result[i].message}`))
          }
         
        });

    })

//this 
$('#send').click(function(e){
    e.preventDefault();
    $(`#newSms[value=${sendTo}`).css("visibility", "hidden")
    message=$("#message").val();
    if (message==''){
    alert("Text must be filled out");
    return false
    }else{
        // calling my emit function
        emitChat(message)
    }    
    
})
//emit chat function after validation
// chat measage from back end when users are online
function emitChat(value){
    socket.emit("chat",{
        receiver: sendTo,
        sender:sender,
        message:value
    });
    $("input:text").val('');
    $("#incoming").append($('<p class=dmout>').text(`You:  
    ${value}`));
    
}
//retrieve chat measage from back end when users are online
socket.on("messageRecieved",function(message){
    console.log(message)
    if(message.sender==conversationWith){
    $("#incoming").append($('<p class=dmIn>').html(`${message.sender} says:  ${message.message}`))
    }
    // $("#incoming").append($('<p class=dmIn>').html(`${message.sender} says:  ${message.message}`))
    $(`#newSms[value=${message.sender}`).css("visibility", "visible")

})



//UI
$("#toggler").click(function(){
    // $("#thisArea").toggle();
    // $("#from").toggle();
    // $("#sendName").toggle();
    $("#container").toggleClass("col-sm-10")

  });

  //this interval keeps letting everyone know that you are logged in 
  //if they logged in after you
  keepNotify()
  function keepNotify(){
    setInterval(function()
    { socket.emit("keepNotify",sender); }, 5000);
    
  }
  socket.on("keepNotify",function(data){
    //for testing only to be deleted
     console.log("front-end "+data)
    $(`#onlineNow[value=${data}`).css("visibility", "visible")
     })
