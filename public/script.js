var socket = io();


let btn=document.getElementById('but');
btn.onclick=function exec(){
    socket.emit('from_client');
}

socket.on('from_server', ()=>{
    
    const div= document.createElement('div');
    div.innerText='new event from server';
    document.body.appendChild(div);
});