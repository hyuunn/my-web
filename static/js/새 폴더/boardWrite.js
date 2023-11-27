var open = document.querySelector("#openModal");
 var modal = document.querySelector("#modal");
 function openModal(){
     modal.classList.add("show");
 }
 open.addEventListener("click",openModal);